// Publicación en la página de Facebook vía Meta Graph API.
//
// Para activarlo:
//   1. Crea una app en https://developers.facebook.com (tipo "Business").
//   2. Vincula la página de Facebook de Biodiversión a esa app.
//   3. Genera un token de acceso de PÁGINA de larga duración (no expira)
//      con el permiso "pages_manage_posts" (Meta debe aprobar el permiso
//      si la página no es tuya directamente — puede tardar unos días).
//   4. Configura en Vercel:
//        FACEBOOK_PAGE_ID
//        FACEBOOK_PAGE_ACCESS_TOKEN

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export function facebookConfigurado() {
  return Boolean(FACEBOOK_PAGE_ID && FACEBOOK_PAGE_ACCESS_TOKEN);
}

export async function publicarEnFacebook(
  mensaje: string,
  imagenUrl: string | null,
): Promise<{ ok: boolean; error?: string }> {
  if (!facebookConfigurado()) {
    return {
      ok: false,
      error: "Facebook no está conectado todavía (faltan las credenciales de la app de Meta).",
    };
  }

  try {
    const endpoint = imagenUrl
      ? `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`
      : `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/feed`;
    const params = new URLSearchParams({
      access_token: FACEBOOK_PAGE_ACCESS_TOKEN!,
      ...(imagenUrl ? { url: imagenUrl, caption: mensaje } : { message: mensaje }),
    });

    const res = await fetch(endpoint, { method: "POST", body: params });
    if (!res.ok) {
      const detalle = await res.text();
      console.error("Error de Facebook al publicar:", detalle);
      return { ok: false, error: detalle };
    }
    return { ok: true };
  } catch (err) {
    console.error("publicarEnFacebook:", err);
    return { ok: false, error: String(err) };
  }
}
