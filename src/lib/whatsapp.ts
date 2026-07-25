// Envío de recordatorios por WhatsApp usando la API de Twilio.
//
// Para activarlo hay que dar de alta una cuenta de Twilio con WhatsApp
// (https://www.twilio.com/whatsapp) y configurar estas 3 variables de
// entorno en Vercel (Project Settings -> Environment Variables):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_WHATSAPP_FROM   (ej. "whatsapp:+14155238886")
//
// Mientras no estén configuradas, enviarWhatsApp no hace nada y regresa un
// error controlado (no tumba el resto del panel).

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

export function whatsappConfigurado() {
  return Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM);
}

/** Convierte un teléfono guardado en cualquier formato local a formato
 * internacional E.164 para WhatsApp. Los celulares de México necesitan el
 * "1" extra entre el "52" y los 10 dígitos (una rareza que WhatsApp sigue
 * pidiendo aunque ya no se use para marcar) — si falta, se agrega solo. */
export function normalizarTelefonoMX(telefono: string): string {
  const soloDigitos = telefono.replace(/\D/g, "");

  if (soloDigitos.length === 10) {
    // Numero local sin codigo de pais: 9985592883
    return `+521${soloDigitos}`;
  }
  if (soloDigitos.length === 12 && soloDigitos.startsWith("52")) {
    // Con codigo de pais pero sin el "1" de WhatsApp: 529985592883
    return `+521${soloDigitos.slice(2)}`;
  }
  if (soloDigitos.length === 13 && soloDigitos.startsWith("521")) {
    // Ya viene completo: 5219985592883
    return `+${soloDigitos}`;
  }
  // Cualquier otro caso (otro país, formato raro): se manda tal cual con "+".
  return `+${soloDigitos}`;
}

export async function enviarWhatsApp(
  telefono: string,
  mensaje: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!whatsappConfigurado()) {
    return { ok: false, error: "WhatsApp no está configurado todavía." };
  }

  try {
    const to = `whatsapp:${normalizarTelefonoMX(telefono)}`;
    const params = new URLSearchParams({
      From: TWILIO_WHATSAPP_FROM!,
      To: to,
      Body: mensaje,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    if (!res.ok) {
      const detalle = await res.text();
      console.error("Error de Twilio al enviar WhatsApp:", detalle);
      return { ok: false, error: detalle };
    }
    return { ok: true };
  } catch (err) {
    console.error("enviarWhatsApp:", err);
    return { ok: false, error: String(err) };
  }
}
