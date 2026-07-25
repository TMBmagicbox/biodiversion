// Publicación en el perfil de negocio de Google (aparece en Google Maps y
// en la Búsqueda de Google) vía la API de Perfiles de Negocio.
//
// Para activarlo:
//   1. Verifica el perfil de negocio de Biodiversión en
//      https://business.google.com (si no está verificado todavía, hay
//      que pedirlo — puede tardar varios días).
//   2. Crea un proyecto en Google Cloud Console y solicita acceso a la
//      "Business Profile API" (Google aprueba manualmente el acceso).
//   3. Genera credenciales OAuth y un token de una cuenta con acceso al
//      perfil (renovable).
//   4. Configura en Vercel:
//        GOOGLE_BUSINESS_ACCOUNT_ID
//        GOOGLE_BUSINESS_LOCATION_ID
//        GOOGLE_BUSINESS_ACCESS_TOKEN

const GOOGLE_BUSINESS_ACCOUNT_ID = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
const GOOGLE_BUSINESS_LOCATION_ID = process.env.GOOGLE_BUSINESS_LOCATION_ID;
const GOOGLE_BUSINESS_ACCESS_TOKEN = process.env.GOOGLE_BUSINESS_ACCESS_TOKEN;

export function googleConfigurado() {
  return Boolean(
    GOOGLE_BUSINESS_ACCOUNT_ID &&
      GOOGLE_BUSINESS_LOCATION_ID &&
      GOOGLE_BUSINESS_ACCESS_TOKEN,
  );
}

export async function publicarEnGoogle(
  mensaje: string,
  imagenUrl: string | null,
): Promise<{ ok: boolean; error?: string }> {
  if (!googleConfigurado()) {
    return {
      ok: false,
      error: "El perfil de negocio de Google no está conectado todavía.",
    };
  }

  try {
    const endpoint = `https://mybusiness.googleapis.com/v4/accounts/${GOOGLE_BUSINESS_ACCOUNT_ID}/locations/${GOOGLE_BUSINESS_LOCATION_ID}/localPosts`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GOOGLE_BUSINESS_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode: "es-MX",
        summary: mensaje,
        topicType: "STANDARD",
        ...(imagenUrl
          ? { media: [{ mediaFormat: "PHOTO", sourceUrl: imagenUrl }] }
          : {}),
      }),
    });
    if (!res.ok) {
      const detalle = await res.text();
      console.error("Error de Google al publicar:", detalle);
      return { ok: false, error: detalle };
    }
    return { ok: true };
  } catch (err) {
    console.error("publicarEnGoogle:", err);
    return { ok: false, error: String(err) };
  }
}
