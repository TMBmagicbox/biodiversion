"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Niños ----------
export async function crearNino(formData: FormData) {
  const supabase = await createClient();

  const { data: nino, error } = await supabase
    .from("ninos")
    .insert({
      nombre: formData.get("nombre"),
      apellido_paterno: formData.get("apellido_paterno"),
      apellido_materno: formData.get("apellido_materno") || null,
      fecha_nacimiento: formData.get("fecha_nacimiento"),
      sexo: formData.get("sexo") || null,
      salon: formData.get("salon") || null,
      tipo_sangre: formData.get("tipo_sangre") || null,
      alergias: formData.get("alergias") || null,
      condiciones_medicas: formData.get("condiciones_medicas") || null,
      pediatra_nombre: formData.get("pediatra_nombre") || null,
      pediatra_telefono: formData.get("pediatra_telefono") || null,
      vacunas_al_dia: formData.get("vacunas_al_dia") === "on",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const tutorId = formData.get("tutor_id");
  if (tutorId && nino) {
    await supabase.from("tutores_ninos").insert({
      tutor_id: tutorId,
      nino_id: nino.id,
      parentesco: formData.get("parentesco") || "tutor",
      contacto_principal: true,
      autorizado_recoger: true,
    });
  }

  revalidatePath("/admin/ninos");
  redirect("/admin/ninos");
}

// ---------- Tutores ----------
export async function crearTutor(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("tutores").insert({
    nombre: formData.get("nombre"),
    apellido_paterno: formData.get("apellido_paterno"),
    apellido_materno: formData.get("apellido_materno") || null,
    telefono: formData.get("telefono"),
    telefono_alternativo: formData.get("telefono_alternativo") || null,
    email: formData.get("email") || null,
    direccion: formData.get("direccion") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/tutores");
  redirect("/admin/tutores");
}

// ---------- Asistencia ----------
export async function registrarEntrada(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("asistencia").insert({
    nino_id: formData.get("nino_id"),
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
      hora_salida: new Date().toISOString(),
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

// ---------- Usuarios del personal (panel admin) ----------

/** Si el usuario que inició sesión no tiene fila en perfiles_admin, se la crea
 *  automáticamente como "admin" (bootstrap de la primera cuenta). */
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

  const { data: creado } = await supabase
    .from("perfiles_admin")
    .insert({
      id: user.id,
      nombre: user.email?.split("@")[0] ?? "Administrador",
      rol: "admin",
    })
    .select("id, nombre, rol")
    .single();

  return creado ?? null;
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
