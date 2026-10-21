import fs from "node:fs";
import path from "node:path";

const EXTENSIONES = /\.(jpe?g|png|webp|avif)$/i;

export type FotoInstalacion = {
  src: string;
  alt: string;
  nombre: string;
};

export type SlideHero = {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagen_fondo_url: string | null;
  imagen_decorativa_url: string | null;
  logo_url: string | null;
  texto_boton: string | null;
  url_boton: string | null;
};

function fotosLocales(): FotoInstalacion[] {
  const dir = path.join(process.cwd(), "public", "images", "instalaciones");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((nombre) => EXTENSIONES.test(nombre) && !nombre.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((nombre, indice) => ({
      nombre,
      src: `/images/instalaciones/${nombre}`,
      alt: `Instalaciones de Biodiversión en Cancún, foto ${indice + 1}`,
    }));
}

type ArchivoStorage = {
  name?: string;
  id?: string | null;
};

export async function fotosInstalacionesSupabase(): Promise<FotoInstalacion[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(`${url}/storage/v1/object/list/fotos`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefix: "instalaciones",
        limit: 48,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      }),
      next: { revalidate: 300, tags: ["instalaciones"] },
    });
    if (!res.ok) return [];

    const archivos = (await res.json()) as ArchivoStorage[];
    if (!Array.isArray(archivos)) return [];

    return archivos
      .filter(
        (archivo) =>
          archivo.id &&
          archivo.name &&
          EXTENSIONES.test(archivo.name) &&
          !archivo.name.includes("/"),
      )
      .map((archivo, indice) => ({
        nombre: archivo.name as string,
        src: `${url}/storage/v1/object/public/fotos/instalaciones/${encodeURIComponent(archivo.name as string)}`,
        alt: `Instalaciones de Biodiversión en Cancún, foto ${indice + 1}`,
      }));
  } catch (error) {
    console.error("No se pudieron leer las fotos de instalaciones:", error);
    return [];
  }
}

export async function fotosInstalaciones(): Promise<FotoInstalacion[]> {
  const [locales, remotas] = await Promise.all([
    Promise.resolve(fotosLocales()),
    fotosInstalacionesSupabase(),
  ]);
  return [...locales, ...remotas].map((foto, indice) => ({
    ...foto,
    alt: `Instalaciones de Biodiversión en Cancún, foto ${indice + 1}`,
  }));
}

export async function obtenerSlidesHero(): Promise<SlideHero[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const consulta = new URL(`${url}/rest/v1/hero_slides`);
    consulta.searchParams.set(
      "select",
      "id,titulo,descripcion,imagen_fondo_url,imagen_decorativa_url,logo_url,texto_boton,url_boton",
    );
    consulta.searchParams.set("activo", "eq.true");
    consulta.searchParams.set("order", "orden.asc");

    const res = await fetch(consulta, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      next: { revalidate: 300, tags: ["hero"] },
    });
    if (!res.ok) return [];
    const slides = (await res.json()) as SlideHero[];
    return Array.isArray(slides) ? slides : [];
  } catch (error) {
    console.error("No se pudo leer el banner de inicio:", error);
    return [];
  }
}
