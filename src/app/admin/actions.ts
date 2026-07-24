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
