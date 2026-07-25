// Publicación en TikTok vía la Content Posting API.
//
// Para activarlo:
//   1. Crea una app en https://developers.tiktok.com.
//   2. Solicita el scope "video.publish" (o "photo.publish" para fotos) —
//      TikTok revisa manualmente antes de aprobarlo para producción; sin
//      la revisión, la app solo puede publicar como "privado/borrador" en
//      la cuenta que dio permiso, no de forma pública.
//   3. Conecta la cuenta de TikTok de Biodiversión y genera un token de
//      acceso (OAuth, se renueva periódicamente).
//   4. Configura en Vercel:
//        TIKTOK_ACCESS_TOKEN
//        TIKTOK_OPEN_ID
//
// NOTA: esta función queda como plantilla — la llamada real a la API se
// completa cuando se tengan las credenciales, porque el formato exacto de
// publicación (foto vs. video) depende de qué tipo de contenido decidan
// publicar ahí.

const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;
const TIKTOK_OPEN_ID = process.env.TIKTOK_OPEN_ID;

export function tiktokConfigurado() {
  return Boolean(TIKTOK_ACCESS_TOKEN && TIKTOK_OPEN_ID);
}

export async function publicarEnTiktok(
  mensaje: string,
  imagenUrl: string | null,
): Promise<{ ok: boolean; error?: string }> {
  if (!tiktokConfigurado()) {
    return {
      ok: false,
      error: "TikTok no está conectado todavía.",
    };
  }
  console.warn(
    "publicarEnTiktok: falta implementar la llamada a la API de TikTok. Contenido pendiente de publicar:",
    { mensaje, imagenUrl },
  );
  return {
    ok: false,
    error:
      "Falta completar la llamada a la API de TikTok (pendiente de que la app sea revisada y aprobada por TikTok).",
  };
}
