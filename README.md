# Biodiversión — sitio web + panel administrativo

Sitio institucional y panel de administración para la guardería
**Biodiversión** (Cancún, Q.R.). Construido con **Next.js 16 (App Router) +
TypeScript + Tailwind CSS v4** para el frontend, y **Supabase** (Postgres +
Auth) para el panel administrativo.

## Estructura

```
src/app/(site)/        -> sitio público (info, servicios, horarios, ubicación)
src/app/admin/login/    -> login del personal
src/app/admin/(protected)/  -> panel: dashboard, niños, tutores, asistencia, pagos
src/lib/supabase/       -> clientes de Supabase (browser, server, middleware)
supabase/schema.sql     -> esquema completo de base de datos + seguridad (RLS)
```

## 1. Configurar Supabase

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega y ejecuta el contenido de `supabase/schema.sql`.
   Esto crea todas las tablas (tutores, niños, asistencia, pagos, etc.) y
   las reglas de seguridad (RLS) para que solo el personal autenticado
   pueda leer/escribir datos.
3. Crea tu primer usuario (el tuyo) en **Authentication > Users** con tu
   correo y contraseña — ese es tu acceso a `/admin`. Los siguientes
   usuarios del personal ya se crean **desde el propio panel**, en
   `/admin/usuarios` (ver sección más abajo), no hace falta volver a
   Supabase para eso.
4. Copia la **URL del proyecto** y la **anon/publishable key** desde
   *Project Settings > API Keys*.
5. En esa misma pantalla copia también la **secret key** (antes llamada
   `service_role`) — la necesitas para poder crear usuarios desde el panel.
   **Es secreta, nunca la compartas ni la pongas en variables `NEXT_PUBLIC_`.**

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y llena los valores de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-o-secret-key
```

## 3. Correr en local

```bash
npm install
npm run dev
```

Sitio público: http://localhost:3000
Panel admin: http://localhost:3000/admin/login

## 4. Subir el código a GitHub (repo `biodiversion` ya creado)

Desde la carpeta del proyecto:

```bash
git init                     # si aún no es un repo git
git add .
git commit -m "Sitio y panel administrativo Biodiversión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/biodiversion.git
git push -u origin main
```

Si el repo en GitHub ya tiene algo (README inicial, licencia, etc.), primero
haz `git pull origin main --allow-unrelated-histories` antes del push, o
crea el repo vacío (sin README) desde GitHub para evitar conflictos.

## 5. Desplegar

Recomendado: [Vercel](https://vercel.com/new) (gratis para este tamaño de
proyecto).

1. Importa el repo `biodiversion` desde GitHub en Vercel.
2. Agrega las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) en
   *Project Settings > Environment Variables*.
3. Deploy. Cada push a `main` genera un nuevo despliegue automático.

## Módulos del panel administrativo

- **Niños**: alta con datos del niño y de salud (alergias, tipo de sangre,
  pediatra, vacunas).
- **Tutores**: alta de tutores/padres, se pueden vincular a uno o varios
  niños.
- **Asistencia / control de horas**: registrar hora de entrada y salida por
  niño; calcula automáticamente las horas de estancia del día
  (vista `asistencia_horas` en la base de datos).
- **Pagos**: registro de mensualidad, comida, inscripción y extras, con
  método de pago y estatus (pagado / pendiente / vencido).
- **Usuarios del personal** (`/admin/usuarios`): crear accesos nuevos
  (correo + contraseña) para dirección, educadoras o recepción, sin salir
  del panel ni tocar Supabase. Requiere la variable
  `SUPABASE_SERVICE_ROLE_KEY` configurada (paso 1.5 arriba).

## Recomendaciones de control adicionales (ya incluidas en el esquema)

El esquema (`supabase/schema.sql`) ya deja listas estas tablas para cuando
las quieras usar desde el panel:

- **`personas_autorizadas`**: personas distintas a los tutores autorizadas
  a recoger al niño (con nombre, teléfono e identificación) — muy común y
  recomendado en guarderías por seguridad.
- **`incidentes`**: bitácora de accidentes, temas de salud o de
  comportamiento, con la opción de marcar si ya se notificó al tutor.
- **`planes_mensualidad`**: para dejar precargado el monto mensual y si
  incluye comida, y así generar recordatorios de pago automáticos a
  futuro.
- Campos de salud en `ninos`: alergias, condiciones médicas, medicamentos,
  tipo de sangre, pediatra y si las vacunas están al día.
- **`camaras`**: tabla placeholder para cuando conectes las cámaras de
  vigilancia (ver siguiente sección).

Otras ideas útiles para una guardería que puedes ir agregando:

- Registro de temperatura/estado de salud al llegar (ya hay un campo
  `temperatura_entrada` en `asistencia`).
- Reportes mensuales por niño (asistencia total, pagos, incidentes) en PDF.
- Notificaciones automáticas por WhatsApp/correo a tutores (recordatorio de
  pago, o cuando el niño es recogido).
- Portal para tutores (solo lectura) donde vean asistencia y estado de
  cuenta de su hijo — reutilizando las mismas tablas.
- Control de inventario de pañales/artículos que cada niño deja en la
  guardería.

## Cámaras de vigilancia (fase futura)

No se integran cámaras en esta primera versión, pero el esquema ya
contempla la tabla `camaras` (nombre, ubicación, `stream_url`, si está
activa y si es visible para tutores). El enfoque recomendado cuando llegue
el momento:

1. Las cámaras deben soportar streaming **RTSP/HLS** (la mayoría de marcas
   modernas como Hikvision, Dahua, TP-Link Tapo, Reolink lo soportan).
2. Se necesita un servicio intermedio (ej. un mini servidor con
   [MediaMTX](https://github.com/bluenviron/mediamtx) o un proveedor como
   Cloudflare Stream) que convierta el RTSP de las cámaras en un link HLS
   seguro que el navegador pueda reproducir — los navegadores no
   reproducen RTSP directo.
3. Ese link se guarda en `camaras.stream_url` y se muestra en una nueva
   sección `/admin/camaras` (y opcionalmente en un portal para tutores).
4. Importante: revisar el aviso de privacidad con los padres antes de dar
   acceso a cámaras en vivo.

## Fotos del local

En la sección "Nuestras instalaciones" de la página de inicio hay tarjetas
de marcador de posición. Cuando tengas fotos reales del local, colócalas en
`public/images/instalaciones/` y reemplaza esa sección en
`src/app/(site)/page.tsx`.
