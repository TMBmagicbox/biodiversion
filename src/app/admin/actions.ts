"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { subirFoto } from "@/lib/supabase/storage";

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// Quintana Roo no cambia de horario (siempre UTC-5), así que podemos fijar
// el offset y evitar líos de zona horaria entre el navegador y el servidor.
const OFFSET_CANCUN = "-05:00";

/** Fecha de hoy (YYYY-MM-DD) en horario de Cancún. */
function fechaHoyCancun() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Cancun" });
}

/** Hora actual (HH:MM) en horario de Cancún, para precargar los formularios. */
function horaAhoraCancun() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "America/Cancun",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Combina una hora "HH:MM" con el día de hoy y devuelve un timestamp ISO. */
function horaDeHoyISO(hora: string | null | undefined) {
  const horaValida = hora && /^\d{2}:\d{2}$/.test(hora) ? hora : horaAhoraCancun();
  return `${fechaHoyCancun()}T${horaValida}:00${OFFSET_CANCUN}`;
}

// ---------- Familias (tutor + sus hijos, con fotos) ----------

/** Crea un tutor y, en el mismo formulario, uno o más hijos vinculados. */
export async function crearFamilia(formData: FormData) {
  const supabase = await createClient();

  const fotoTutorUrl = await subirFoto(
    supabase,
    formData.get("tutor_foto"),
    "tutores",
  );

  const { data: tutor, error } = await supabase
    .from("tutores")
    .insert({
      nombre: formData.get("nombre"),
      apellido_paterno: formData.get("apellido_paterno"),
      apellido_materno: formData.get("apellido_materno") || null,
      telefono: formData.get("telefono"),
      telefono_alternativo: formData.get("telefono_alternativo") || null,
      email: formData.get("email") || null,
      direccion: formData.get("direccion") || null,
      foto_url: fotoTutorUrl,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const nombres = formData.getAll("nino_nombre");
  const apellidosP = formData.getAll("nino_apellido_paterno");
  const apellidosM = formData.getAll("nino_apellido_materno");
  const fechas = formData.getAll("nino_fecha_nacimiento");
  const parentescos = formData.getAll("nino_parentesco");
  const fotos = formData.getAll("nino_foto");

  for (let i = 0; i < nombres.length; i++) {
    const nombre = String(nombres[i] || "").trim();
    const fecha = String(fechas[i] || "").trim();
    if (!nombre || !fecha) continue; // fila vacía (no se agregó hijo aquí)

    const fotoNinoUrl = await subirFoto(supabase, fotos[i] ?? null, "ninos");

    const { data: nino, error: errorNino } = await supabase
      .from("ninos")
      .insert({
        nombre,
        apellido_paterno: String(apellidosP[i] || "").trim() || nombre,
        apellido_materno: apellidosM[i] || null,
        fecha_nacimiento: fecha,
        foto_url: fotoNinoUrl,
      })
      .select("id")
      .single();

    if (errorNino) throw new Error(errorNino.message);

    await supabase.from("tutores_ninos").insert({
      tutor_id: tutor.id,
      nino_id: nino.id,
      parentesco: parentescos[i] || "tutor",
      contacto_principal: i === 0,
      autorizado_recoger: true,
    });
  }

  revalidatePath("/admin/familias");
  redirect(`/admin/familias/${tutor.id}`);
}

/** Agrega otro hijo a un tutor que ya existe. */
export async function agregarNinoAFamilia(formData: FormData) {
  const supabase = await createClient();
  const tutorId = String(formData.get("tutor_id"));

  const fotoUrl = await subirFoto(supabase, formData.get("foto"), "ninos");

  const { data: nino, error } = await supabase
    .from("ninos")
    .insert({
      nombre: formData.get("nombre"),
      apellido_paterno: formData.get("apellido_paterno"),
      apellido_materno: formData.get("apellido_materno") || null,
      fecha_nacimiento: formData.get("fecha_nacimiento"),
      foto_url: fotoUrl,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("tutores_ninos").insert({
    tutor_id: tutorId,
    nino_id: nino.id,
    parentesco: formData.get("parentesco") || "tutor",
    contacto_principal: false,
    autorizado_recoger: true,
  });

  revalidatePath(`/admin/familias/${tutorId}`);
  redirect(`/admin/familias/${tutorId}`);
}

/** Actualiza los datos de un tutor (y opcionalmente su foto). */
export async function actualizarTutor(formData: FormData) {
  const supabase = await createClient();
  const tutorId = String(formData.get("tutor_id"));

  const nuevaFotoUrl = await subirFoto(
    supabase,
    formData.get("foto"),
    "tutores",
  );

  const { error } = await supabase
    .from("tutores")
    .update({
      nombre: formData.get("nombre"),
      apellido_paterno: formData.get("apellido_paterno"),
      apellido_materno: formData.get("apellido_materno") || null,
      telefono: formData.get("telefono"),
      telefono_alternativo: formData.get("telefono_alternativo") || null,
      email: formData.get("email") || null,
      direccion: formData.get("direccion") || null,
      ...(nuevaFotoUrl ? { foto_url: nuevaFotoUrl } : {}),
    })
    .eq("id", tutorId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/familias/${tutorId}`);
  revalidatePath("/admin/familias");
  redirect(`/admin/familias/${tutorId}`);
}

/** Actualiza los datos de un niño/a (y opcionalmente su foto). */
export async function actualizarNino(formData: FormData) {
  const supabase = await createClient();
  const ninoId = String(formData.get("nino_id"));
  const tutorId = String(formData.get("tutor_id"));

  const nuevaFotoUrl = await subirFoto(supabase, formData.get("foto"), "ninos");

  const { error } = await supabase
    .from("ninos")
    .update({
      nombre: formData.get("nombre"),
      apellido_paterno: formData.get("apellido_paterno"),
      apellido_materno: formData.get("apellido_materno") || null,
      fecha_nacimiento: formData.get("fecha_nacimiento") || null,
      salon: formData.get("salon") || null,
      tipo_sangre: formData.get("tipo_sangre") || null,
      alergias: formData.get("alergias") || null,
      condiciones_medicas: formData.get("condiciones_medicas") || null,
      medicamentos: formData.get("medicamentos") || null,
      pediatra_nombre: formData.get("pediatra_nombre") || null,
      pediatra_telefono: formData.get("pediatra_telefono") || null,
      vacunas_al_dia: formData.get("vacunas_al_dia") === "on",
      ...(nuevaFotoUrl ? { foto_url: nuevaFotoUrl } : {}),
    })
    .eq("id", ninoId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/familias/${tutorId}`);
  redirect(`/admin/familias/${tutorId}`);
}

/** Borra un tutor por completo. También borra a los hijos que se queden sin
 * ningún otro tutor vinculado (útil para limpiar familias de prueba). */
export async function eliminarFamilia(formData: FormData) {
  const supabase = await createClient();
  const tutorId = String(formData.get("tutor_id"));

  const { data: vinculos } = await supabase
    .from("tutores_ninos")
    .select("nino_id")
    .eq("tutor_id", tutorId);
  const ninoIds = (vinculos ?? []).map((v) => v.nino_id as string);

  const { error } = await supabase.from("tutores").delete().eq("id", tutorId);
  if (error) throw new Error(error.message);

  for (const ninoId of ninoIds) {
    const { count } = await supabase
      .from("tutores_ninos")
      .select("*", { count: "exact", head: true })
      .eq("nino_id", ninoId);
    if (!count) {
      await supabase.from("ninos").delete().eq("id", ninoId);
    }
  }

  revalidatePath("/admin/familias");
  redirect("/admin/familias");
}

/** Borra a un hijo/a de una familia. Si se queda sin ningún tutor vinculado,
 * borra también su registro de niño. */
export async function eliminarNino(formData: FormData) {
  const supabase = await createClient();
  const ninoId = String(formData.get("nino_id"));
  const tutorId = String(formData.get("tutor_id"));

  await supabase
    .from("tutores_ninos")
    .delete()
    .eq("nino_id", ninoId)
    .eq("tutor_id", tutorId);

  const { count } = await supabase
    .from("tutores_ninos")
    .select("*", { count: "exact", head: true })
    .eq("nino_id", ninoId);
  if (!count) {
    await supabase.from("ninos").delete().eq("id", ninoId);
  }

  revalidatePath(`/admin/familias/${tutorId}`);
  redirect(`/admin/familias/${tutorId}`);
}

// ---------- Asistencia ----------
export async function registrarEntrada(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("asistencia").insert({
    nino_id: formData.get("nino_id"),
    fecha: fechaHoyCancun(),
    hora_entrada: horaDeHoyISO(formData.get("hora_entrada") as string | null),
    entregado_por: formData.get("entregado_por") || null,
    registrado_por: user?.id ?? null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/asistencia");
}

export async function registrarSalida(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("asistencia")
    .update({
      hora_salida: horaDeHoyISO(formData.get("hora_salida") as string | null),
      recogido_por: formData.get("recogido_por") || null,
    })
    .eq("id", formData.get("asistencia_id"));

  if (error) throw new Error(error.message);
  revalidatePath("/admin/asistencia");
}

// ---------- Pagos ----------
export async function registrarPago(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("pagos").insert({
    nino_id: formData.get("nino_id"),
    tipo: formData.get("tipo"),
    concepto: formData.get("concepto") || null,
    monto: formData.get("monto"),
    mes_correspondiente: formData.get("mes_correspondiente") || null,
    fecha_pago: formData.get("fecha_pago") || new Date().toISOString(),
    metodo_pago: formData.get("metodo_pago") || null,
    estatus: formData.get("estatus") || "pagado",
    registrado_por: user?.id ?? null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
  redirect("/admin/pagos");
}

/** Actualiza un pago ya registrado. */
export async function actualizarPago(formData: FormData) {
  const supabase = await createClient();
  const pagoId = String(formData.get("pago_id"));

  const { error } = await supabase
    .from("pagos")
    .update({
      nino_id: formData.get("nino_id"),
      tipo: formData.get("tipo"),
      concepto: formData.get("concepto") || null,
      monto: formData.get("monto"),
      mes_correspondiente: formData.get("mes_correspondiente") || null,
      fecha_pago: formData.get("fecha_pago") || null,
      metodo_pago: formData.get("metodo_pago") || null,
      estatus: formData.get("estatus") || "pagado",
    })
    .eq("id", pagoId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
  redirect("/admin/pagos");
}

/** Borra un pago registrado. */
export async function eliminarPago(formData: FormData) {
  const supabase = await createClient();
  const pagoId = String(formData.get("pago_id"));

  const { error } = await supabase.from("pagos").delete().eq("id", pagoId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}

// ---------- Usuarios del personal (panel admin) ----------

/** Si el usuario que inició sesión no tiene fila en perfiles_admin, se la crea
 *  automáticamente como "admin" (bootstrap de la primera cuenta).
 *
 *  Nota: la tabla perfiles_admin solo tiene política de RLS de lectura
 *  ("staff_read_perfiles"), a propósito, para que el personal no pueda
 *  escribirse a sí mismo un rol distinto. Por eso aquí usamos el cliente
 *  de administrador (service role) únicamente para este autochequeo. */
export async function asegurarPerfilPropio() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existente } = await supabase
    .from("perfiles_admin")
    .select("id, nombre, rol")
    .eq("id", user.id)
    .maybeSingle();

  if (existente) return existente;

  try {
    const admin = createAdminClient();
    const { data: creado, error } = await admin
      .from("perfiles_admin")
      .insert({
        id: user.id,
        nombre: user.email?.split("@")[0] ?? "Administrador",
        rol: "admin",
      })
      .select("id, nombre, rol")
      .single();

    if (error) {
      console.error("No se pudo crear el perfil propio:", error.message);
      return null;
    }
    return creado ?? null;
  } catch (err) {
    // Si aún no está configurada SUPABASE_SERVICE_ROLE_KEY, no tumbamos el
    // panel: solo seguimos sin perfil hasta que se configure.
    console.error("asegurarPerfilPropio:", err);
    return null;
  }
}

export async function crearUsuarioPersonal(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nombre = String(formData.get("nombre") || "");
  const rol = String(formData.get("rol") || "educadora");

  if (!email || !password || password.length < 6) {
    throw new Error(
      "Correo y contraseña son obligatorios (mínimo 6 caracteres).",
    );
  }

  const admin = createAdminClient();

  const { data: nuevoUsuario, error: errorAuth } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (errorAuth) throw new Error(errorAuth.message);

  const { error: errorPerfil } = await admin.from("perfiles_admin").insert({
    id: nuevoUsuario.user.id,
    nombre,
    rol,
  });

  if (errorPerfil) throw new Error(errorPerfil.message);

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

// ---------- Slides del banner de inicio ----------

export async function crearHeroSlide(formData: FormData) {
  const supabase = await createClient();

  const imagenFondoUrl = await subirFoto(
    supabase,
    formData.get("imagen_fondo"),
    "hero",
  );
  const logoUrl = await subirFoto(supabase, formData.get("logo"), "hero");

  const { count } = await supabase
    .from("hero_slides")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("hero_slides").insert({
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion") || null,
    imagen_fondo_url: imagenFondoUrl,
    logo_url: logoUrl,
    texto_boton: formData.get("texto_boton") || "Agenda una visita",
    url_boton: formData.get("url_boton") || "#contacto",
    orden: count ?? 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/inicio");
  revalidatePath("/");
  redirect("/admin/inicio");
}

export async function eliminarHeroSlide(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_slides")
    .delete()
    .eq("id", formData.get("id"));

  if (error) throw new Error(error.message);

  revalidatePath("/admin/inicio");
  revalidatePath("/");
}

export async function alternarHeroSlide(formData: FormData) {
  const supabase = await createClient();
  const activo = formData.get("activo") === "true";

  const { error } = await supabase
    .from("hero_slides")
    .update({ activo: !activo })
    .eq("id", formData.get("id"));

  if (error) throw new Error(error.message);

  revalidatePath("/admin/inicio");
  revalidatePath("/");
}
