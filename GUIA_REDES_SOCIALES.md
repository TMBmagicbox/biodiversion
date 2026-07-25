# Cómo conectar cada red social al Blog de Biodiversión

Ya puedes escribir y guardar publicaciones desde **Admin → Blog / Redes sociales**. El envío automático a cada red se activa cuando me compartas las credenciales de esa red (igual que hicimos con Twilio/WhatsApp). Mientras una red no esté conectada, sus publicaciones se guardan igual y quedan marcadas "pendiente" — se pueden reintentar después con el botón "Reintentar publicar".

## 1. Facebook

1. Entra a https://developers.facebook.com y crea una app tipo **"Negocios"**.
2. En la app, vincula la página de Facebook de Biodiversión.
3. Genera un **token de acceso de página** de larga duración con el permiso `pages_manage_posts` (Meta puede pedir verificar el negocio — puede tardar unos días).
4. Compárteme: el **ID de la página** y el **token de acceso**.

## 2. Instagram

1. Requiere que la cuenta de Instagram sea de tipo **profesional/negocio** y esté vinculada a la misma página de Facebook.
2. Se vincula desde Meta Business Suite → Configuración → Cuentas vinculadas.
3. Con la misma app de Facebook, agrega el permiso `instagram_content_publish`.
4. Compárteme: el **ID de cuenta de negocio de Instagram** y el token (normalmente el mismo de Facebook).

*Instagram siempre necesita una imagen — no se puede publicar solo texto.*

## 3. Google (perfil de negocio — aparece en Maps y Búsqueda)

1. Verifica el perfil de negocio de Biodiversión en https://business.google.com si aún no está verificado (puede tardar varios días).
2. Crea un proyecto en Google Cloud Console y solicita acceso a la **Business Profile API** (Google aprueba manualmente).
3. Genera credenciales OAuth y un token de una cuenta con acceso al perfil.
4. Compárteme: **ID de cuenta**, **ID de ubicación** y **token de acceso**.

## 4. TikTok

1. Crea una app en https://developers.tiktok.com.
2. Solicita el scope `video.publish` o `photo.publish` — TikTok revisa la app antes de aprobarla para producción (mientras tanto solo se puede publicar en modo privado/borrador en la cuenta que dio permiso).
3. Conecta la cuenta de TikTok de Biodiversión y genera el token.
4. Compárteme: **token de acceso** y **Open ID**.

---

En cuanto tengas cualquiera de estos, mándamelos y yo configuro las variables de entorno en Vercel y completo la conexión — no hace falta esperar a tener las 4 listas, se pueden ir conectando una por una.
