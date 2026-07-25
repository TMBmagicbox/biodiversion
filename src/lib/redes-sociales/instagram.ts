// Publicación en Instagram vía Meta Graph API (requiere una cuenta de
// Instagram tipo "profesional/negocio" vinculada a la misma página de
// Facebook de Biodiversión).
//
// Para activarlo:
//   1. Vincula la cuenta de Instagram del negocio a la página de Facebook
//      (Meta Business Suite → Configuración → Cuentas vinculadas).
//   2. Con la misma app/token de Facebook, agrega el permiso
//      "instagram_content_publish".
//   3. Configura en Vercel:
//        INSTAGRAM_BUSINESS_ACCOUNT_ID
//        INSTAGRAM_ACCESS_TOKEN   (normalmente el mismo token de la página)
//
// Instagram publica en 2 pasos: primero se crea un "contenedor" con la
// imagen, y luego se publica ese contenedor. Por eso SIEMPRE necesita una
// imagen (no se puede publicar solo texto).

const IG_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const IG_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export function instagramConfigurado() {
  return Boolean(IG_BUSINESS_ACCOUNT_ID && IG_ACCESS_TOKEN);
}

export async function publicarEnInstagram(
  mensaje: string,
  imagenUrl: string | null,
): Promise<{ ok: boolean; error?: string }> {
  if (!instagramConfigurado()) {
    return {
      ok: false,
      error: "Instagram no está conectado todavía (faltan las credenciales de Meta).",
    };
  }
  if (!imagenUrl) {
    return {
      ok: false,
      error: "Instagram requiere una imagen para poder publicar.",
    };
  }

  try {
    const crear = await fetch(
      `https://graph.facebook.com/v21.0/${IG_BUSINESS_ACCOUNT_ID}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          image_url: imagenUrl,
          caption: mensaje,
          access_token: IG_ACCESS_TOKEN!,
        }),
      },
    );
    const creado = await crear.json();
    if (!crear.ok || !creado.id) {
      console.error("Error de Instagram al crear el contenedor:", creado);
      return { ok: false, error: JSON.stringify(creado) };
    }

    const publicar = await fetch(
      `https://graph.facebook.com/v21.0/${IG_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          creation_id: creado.id,
          access_token: IG_ACCESS_TOKEN!,
        }),
      },
    );
    if (!publicar.ok) {
      const detalle = await publicar.text();
      console.error("Error de Instagram al publicar:", detalle);
      return { ok: false, error: detalle };
    }
    return { ok: true };
  } catch (err) {
    console.error("publicarEnInstagram:", err);
    return { ok: false, error: String(err) };
  }
}
