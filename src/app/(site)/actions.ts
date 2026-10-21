"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { enviarWhatsApp } from "@/lib/whatsapp";

const NEGOCIO_WHATSAPP_TO = process.env.NEGOCIO_WHATSAPP_TO || "9981290100";

export type EstadoContacto = {
  estado: "idle" | "ok" | "error";
  mensaje: string;
};

const MENSAJE_OK =
  "Gracias. Recibimos tu mensaje y te contactaremos pronto.";
const MENSAJE_ERROR =
  "No se pudo enviar tu mensaje. Intenta de nuevo, escríbenos por WhatsApp o llama al 998 129 0100 o al 998 372 4752.";

export async function enviarMensajeContacto(
  _previo: EstadoContacto,
  formData: FormData,
): Promise<EstadoContacto> {
  if (String(formData.get("empresa") || "").trim()) {
    return { estado: "ok", mensaje: MENSAJE_OK };
  }

  const nombre = String(formData.get("nombre") || "").trim().slice(0, 80);
  const contacto = String(formData.get("contacto") || "").trim().slice(0, 120);
  const mensaje = String(formData.get("mensaje") || "").trim().slice(0, 2000);

  if (nombre.length < 2 || contacto.length < 5 || mensaje.length < 8) {
    return {
      estado: "error",
      mensaje: "Revisa que el nombre, el contacto y el mensaje estén completos.",
    };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("mensajes_contacto").insert({
      nombre,
      contacto,
      mensaje,
    });

    if (error) {
      console.error("No se pudo guardar el mensaje de contacto:", error.message);
      return { estado: "error", mensaje: MENSAJE_ERROR };
    }
  } catch (error) {
    console.error("Error al guardar el mensaje de contacto:", error);
    return { estado: "error", mensaje: MENSAJE_ERROR };
  }

  await enviarWhatsApp(
    NEGOCIO_WHATSAPP_TO,
    `Nuevo mensaje de contacto en la página web\n\nNombre: ${nombre}\nContacto: ${contacto}\nMensaje: ${mensaje}`,
  );

  return { estado: "ok", mensaje: MENSAJE_OK };
}
