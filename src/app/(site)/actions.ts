"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarWhatsApp } from "@/lib/whatsapp";

// Número del negocio al que llega el aviso de WhatsApp por cada mensaje
// nuevo del formulario de contacto. Se puede sobreescribir con la variable
// de entorno NEGOCIO_WHATSAPP_TO en Vercel; si no está configurada, usa el
// teléfono público de Biodiversión que ya aparece en la página.
const NEGOCIO_WHATSAPP_TO = process.env.NEGOCIO_WHATSAPP_TO || "9981290100";

export async function enviarMensajeContacto(formData: FormData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const contacto = String(formData.get("contacto") || "").trim();
  const mensaje = String(formData.get("mensaje") || "").trim();

  if (!nombre || !contacto || !mensaje) {
    redirect("/?contacto=error#contacto");
  }

  // Se usa la service role porque este formulario lo llena cualquier
  // visitante sin sesión (RLS solo deja leer/editar al personal logueado).
  const supabase = createAdminClient();
  const { error } = await supabase.from("mensajes_contacto").insert({
    nombre,
    contacto,
    mensaje,
  });

  if (error) {
    console.error("No se pudo guardar el mensaje de contacto:", error.message);
    redirect("/?contacto=error#contacto");
  }

  // Aviso inmediato por WhatsApp al negocio (no bloquea si falla o si
  // WhatsApp todavía no está configurado en este entorno).
  await enviarWhatsApp(
    NEGOCIO_WHATSAPP_TO,
    `📩 Nuevo mensaje de contacto en la página web\n\nNombre: ${nombre}\nContacto: ${contacto}\nMensaje: ${mensaje}`,
  );

  redirect("/?contacto=enviado#contacto");
}
