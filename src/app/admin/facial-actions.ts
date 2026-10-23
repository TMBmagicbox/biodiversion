"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esDescriptorValido } from "@/lib/rostros";
import {
  MAX_BYTES_CONSENTIMIENTO,
  VERSION_CONSENTIMIENTO,
} from "@/lib/consentimiento";

const BUCKET = "consentimientos";

function fechaHoyCancun() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Cancun" });
}

function nombreCompleto(p: { nombre: string; apellido_paterno: string }) {
  return `${p.nombre} ${p.apellido_paterno}`.trim();
}

async function usuarioActual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function volverConsentimiento(tutorId: string, params: Record<string, string>) {
  const q = new URLSearchParams(params).toString();
  redirect(`/admin/familias/${tutorId}/consentimiento?${q}`);
}

// ---------------------------------------------------------------
// Consentimiento firmado (copia escaneada del documento físico)
// ---------------------------------------------------------------

export async function subirConsentimiento(formData: FormData) {
  const { supabase, user } = await usuarioActual();
  if (!user) redirect("/admin/login");

  const tutorId = String(formData.get("tutor_id") ?? "");
  const fechaFirma = String(formData.get("fecha_firma") ?? "");
  const archivo = formData.get("archivo");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaFirma) || fechaFirma > fechaHoyCancun()) {
    volverConsentimiento(tutorId, { error: "Indica una fecha de firma válida." });
  }
  if (!(archivo instanceof File) || archivo.size === 0) {
    volverConsentimiento(tutorId, { error: "Adjunta la copia firmada." });
  }
  const file = archivo as File;
  const esPdf = file.type === "application/pdf";
  const esImagen = file.type.startsWith("image/");
  if (!esPdf && !esImagen) {
    volverConsentimiento(tutorId, { error: "El archivo debe ser una imagen o un PDF." });
  }
  if (file.size > MAX_BYTES_CONSENTIMIENTO) {
    volverConsentimiento(tutorId, {
      error: "El archivo pesa más de 4 MB. Reduce su tamaño o toma la foto con menos resolución.",
    });
  }

  const { count } = await supabase
    .from("consentimientos_biometricos")
    .select("*", { count: "exact", head: true })
    .eq("tutor_id", tutorId)
    .is("revocado_at", null);
  if (count) {
    volverConsentimiento(tutorId, {
      error: "Ya hay un consentimiento vigente. Revócalo primero para subir uno nuevo.",
    });
  }

  const ext = esPdf ? "pdf" : (file.name.split(".").pop() || "jpg").toLowerCase();
  const ruta = `${tutorId}/${crypto.randomUUID()}.${ext}`;

  const { error: errSubida } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, file, { contentType: file.type || undefined });
  if (errSubida) {
    console.error("subirConsentimiento (storage):", errSubida.message);
    volverConsentimiento(tutorId, {
      error: "No se pudo guardar el archivo. Revisa que ya corriste la migración 014.",
    });
  }

  const { data: perfil } = await supabase
    .from("perfiles_admin")
    .select("id")
    .eq("id", user!.id)
    .maybeSingle();

  const { error: errFila } = await supabase.from("consentimientos_biometricos").insert({
    tutor_id: tutorId,
    fecha_firma: fechaFirma,
    archivo_path: ruta,
    version_texto: VERSION_CONSENTIMIENTO,
    registrado_por: perfil?.id ?? null,
  });
  if (errFila) {
    // No dejar un archivo huérfano si no se pudo registrar.
    await supabase.storage.from(BUCKET).remove([ruta]);
    console.error("subirConsentimiento (fila):", errFila.message);
    volverConsentimiento(tutorId, { error: "No se pudo registrar el consentimiento." });
  }

  revalidatePath(`/admin/familias/${tutorId}/consentimiento`);
  volverConsentimiento(tutorId, { ok: "consentimiento" });
}

/** Revoca el consentimiento vigente y BORRA el rostro. La copia firmada se
 * conserva como constancia. */
export async function revocarConsentimiento(formData: FormData) {
  const { supabase, user } = await usuarioActual();
  if (!user) redirect("/admin/login");
  const tutorId = String(formData.get("tutor_id") ?? "");

  // Primero el rostro: lo más importante es dejar de tener el dato biométrico.
  const { error: errRostro } = await supabase
    .from("rostros_tutores")
    .delete()
    .eq("tutor_id", tutorId);
  if (errRostro) throw new Error(errRostro.message);

  const { error } = await supabase
    .from("consentimientos_biometricos")
    .update({ revocado_at: new Date().toISOString() })
    .eq("tutor_id", tutorId)
    .is("revocado_at", null);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/familias/${tutorId}/consentimiento`);
  volverConsentimiento(tutorId, { ok: "revocado" });
}

// ---------------------------------------------------------------
// Registro del rostro (solo con consentimiento vigente)
// ---------------------------------------------------------------

export async function guardarRostro(
  tutorId: string,
  descriptores: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, user } = await usuarioActual();
  if (!user) return { ok: false, error: "Sesión expirada. Vuelve a iniciar sesión." };

  if (
    !Array.isArray(descriptores) ||
    descriptores.length < 1 ||
    descriptores.length > 5 ||
    !descriptores.every(esDescriptorValido)
  ) {
    return { ok: false, error: "Las capturas no son válidas. Inténtalo de nuevo." };
  }

  const { data: consentimiento } = await supabase
    .from("consentimientos_biometricos")
    .select("id")
    .eq("tutor_id", tutorId)
    .is("revocado_at", null)
    .maybeSingle();
  if (!consentimiento) {
    return {
      ok: false,
      error: "Este tutor no tiene un consentimiento firmado vigente.",
    };
  }

  const { error } = await supabase.from("rostros_tutores").upsert({
    tutor_id: tutorId,
    consentimiento_id: consentimiento.id,
    descriptores,
  });
  if (error) {
    console.error("guardarRostro:", error.message);
    return { ok: false, error: "No se pudo guardar el rostro." };
  }

  revalidatePath(`/admin/familias/${tutorId}/consentimiento`);
  return { ok: true };
}

// ---------------------------------------------------------------
// Kiosco de la tableta
// ---------------------------------------------------------------

export type TutorKiosco = {
  tutorId: string;
  nombre: string;
  descriptores: number[][];
};

/** Rostros de todos los tutores con consentimiento vigente. Solo personal
 * con sesión iniciada (la tableta debe estar con sesión del personal). */
export async function obtenerRostrosKiosco(): Promise<
  { ok: true; tutores: TutorKiosco[] } | { ok: false; error: string }
> {
  const { supabase, user } = await usuarioActual();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const { data, error } = await supabase
    .from("rostros_tutores")
    .select(
      "tutor_id, descriptores, consentimiento:consentimientos_biometricos(revocado_at), tutor:tutores(nombre, apellido_paterno)",
    );
  if (error) return { ok: false, error: "No se pudieron cargar los rostros." };

  type Fila = {
    tutor_id: string;
    descriptores: unknown;
    consentimiento: { revocado_at: string | null } | { revocado_at: string | null }[] | null;
    tutor: { nombre: string; apellido_paterno: string } | { nombre: string; apellido_paterno: string }[] | null;
  };
  const uno = <T,>(v: T | T[] | null) => (Array.isArray(v) ? (v[0] ?? null) : v);

  const tutores: TutorKiosco[] = [];
  for (const fila of (data ?? []) as unknown as Fila[]) {
    const consentimiento = uno(fila.consentimiento);
    const tutor = uno(fila.tutor);
    if (!tutor || !consentimiento || consentimiento.revocado_at) continue;
    if (!Array.isArray(fila.descriptores) || !fila.descriptores.every(esDescriptorValido)) continue;
    tutores.push({
      tutorId: fila.tutor_id,
      nombre: nombreCompleto(tutor),
      descriptores: fila.descriptores as number[][],
    });
  }
  return { ok: true, tutores };
}

export type HijoKiosco = { id: string; nombre: string; dentro: boolean };

/** Hijos activos del tutor y si ahora mismo están dentro (entrada sin salida hoy). */
export async function consultarHijosKiosco(
  tutorId: string,
): Promise<{ ok: true; hijos: HijoKiosco[] } | { ok: false; error: string }> {
  const { supabase, user } = await usuarioActual();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const { data: vinculos, error } = await supabase
    .from("tutores_ninos")
    .select("nino:ninos(id, nombre, apellido_paterno, activo)")
    .eq("tutor_id", tutorId);
  if (error) return { ok: false, error: "No se pudieron cargar los niños." };

  type Nino = { id: string; nombre: string; apellido_paterno: string; activo: boolean };
  const ninos = ((vinculos ?? []) as unknown as { nino: Nino | Nino[] | null }[])
    .map((v) => (Array.isArray(v.nino) ? v.nino[0] : v.nino))
    .filter((n): n is Nino => !!n && n.activo);
  if (!ninos.length) return { ok: true, hijos: [] };

  const { data: abiertas } = await supabase
    .from("asistencia")
    .select("nino_id")
    .in("nino_id", ninos.map((n) => n.id))
    .eq("fecha", fechaHoyCancun())
    .is("hora_salida", null);
  const dentro = new Set((abiertas ?? []).map((a) => a.nino_id as string));

  return {
    ok: true,
    hijos: ninos.map((n) => ({
      id: n.id,
      nombre: nombreCompleto(n),
      dentro: dentro.has(n.id),
    })),
  };
}

/** Marca la entrada (si el niño/a no está dentro) o la salida (si lo está). */
export async function registrarPasoKiosco(
  tutorId: string,
  ninoId: string,
): Promise<
  | { ok: true; accion: "entrada" | "salida"; nino: string; hora: string }
  | { ok: false; error: string }
> {
  const { supabase, user } = await usuarioActual();
  if (!user) return { ok: false, error: "Sesión expirada." };

  // El tutor debe tener rostro registrado con consentimiento vigente.
  const { data: rostro } = await supabase
    .from("rostros_tutores")
    .select("tutor_id, consentimiento:consentimientos_biometricos(revocado_at)")
    .eq("tutor_id", tutorId)
    .maybeSingle();
  const consent = Array.isArray(rostro?.consentimiento)
    ? rostro?.consentimiento[0]
    : rostro?.consentimiento;
  if (!rostro || !consent || consent.revocado_at) {
    return { ok: false, error: "Este tutor no tiene el reconocimiento facial habilitado." };
  }

  // Y debe estar vinculado a ese niño/a.
  const { data: vinculo } = await supabase
    .from("tutores_ninos")
    .select(
      "autorizado_recoger, tutor:tutores(nombre, apellido_paterno), nino:ninos(nombre, apellido_paterno, activo)",
    )
    .eq("tutor_id", tutorId)
    .eq("nino_id", ninoId)
    .maybeSingle();
  if (!vinculo) return { ok: false, error: "Ese niño/a no pertenece a este tutor." };

  const tutor = Array.isArray(vinculo.tutor) ? vinculo.tutor[0] : vinculo.tutor;
  const nino = Array.isArray(vinculo.nino) ? vinculo.nino[0] : vinculo.nino;
  if (!tutor || !nino || !nino.activo) {
    return { ok: false, error: "El niño/a no está activo." };
  }
  const nombreTutor = nombreCompleto(tutor);
  const nombreNino = nombreCompleto(nino);

  const ahora = new Date();
  const hora = ahora.toLocaleTimeString("es-MX", {
    timeZone: "America/Cancun",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data: abierta } = await supabase
    .from("asistencia")
    .select("id, notas")
    .eq("nino_id", ninoId)
    .eq("fecha", fechaHoyCancun())
    .is("hora_salida", null)
    .order("hora_entrada", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (abierta) {
    if (vinculo.autorizado_recoger === false) {
      return { ok: false, error: "Este tutor no está autorizado para recoger. Avisa al personal." };
    }
    const nota = [abierta.notas, "Salida por kiosco facial"].filter(Boolean).join(" · ");
    const { error } = await supabase
      .from("asistencia")
      .update({
        hora_salida: ahora.toISOString(),
        recogido_por: nombreTutor,
        notas: nota,
      })
      .eq("id", abierta.id);
    if (error) return { ok: false, error: "No se pudo registrar la salida." };
    revalidatePath("/admin/asistencia");
    return { ok: true, accion: "salida", nino: nombreNino, hora };
  }

  const { data: perfil } = await supabase
    .from("perfiles_admin")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("asistencia").insert({
    nino_id: ninoId,
    fecha: fechaHoyCancun(),
    hora_entrada: ahora.toISOString(),
    entregado_por: nombreTutor,
    registrado_por: perfil?.id ?? null,
    metodo_registro: "kiosco",
  });
  if (error) return { ok: false, error: "No se pudo registrar la entrada." };
  revalidatePath("/admin/asistencia");
  return { ok: true, accion: "entrada", nino: nombreNino, hora };
}
