import Image from "next/image";
import BotonConfirmar from "@/components/admin/BotonConfirmar";
import { fotosInstalacionesSupabase } from "@/lib/contenido-publico";
import {
  eliminarFotoInstalacion,
  subirFotoInstalacion,
} from "./actions";

const AVISOS: Record<string, string> = {
  subida: "La foto ya está en el sitio público.",
  eliminada: "Se quitó la foto del sitio.",
  vacio: "Elige una foto antes de subirla.",
  grande: "La foto pesa más de 8 MB. Elige una más ligera.",
  formato: "Usa una imagen JPG, PNG, WEBP o AVIF.",
  error: "No se pudo completar la acción. Intenta de nuevo.",
};

export default async function InstalacionesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const fotos = await fotosInstalacionesSupabase();
  const aviso = estado ? AVISOS[estado] : null;

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Fotos de instalaciones
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-foreground/80">
        Estas fotos aparecen en la sección «Nuestras instalaciones» de la
        página pública. Si no hay ninguna, el sitio muestra la descripción
        de los espacios, sin tarjetas vacías.
      </p>

      {aviso && (
        <p
          role="status"
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-bold ${
            estado === "subida" || estado === "eliminada"
              ? "bg-brand-green/20 text-brand-green-dark"
              : "bg-red-50 text-red-800"
          }`}
        >
          {aviso}
        </p>
      )}

      <form action={subirFotoInstalacion} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="foto-instalacion" className="text-sm font-bold text-brand-blue-dark">
            Nueva foto
          </label>
          <input
            id="foto-instalacion"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className="mt-1 block w-full text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-brand-green px-5 py-2.5 font-extrabold text-[#14240a]"
        >
          Subir foto
        </button>
      </form>

      {fotos.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/80">
          Todavía no hay fotos en el almacenamiento.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((foto) => (
            <li key={foto.nombre} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 1024px) 240px, 50vw"
                  className="object-cover"
                />
              </div>
              <form action={eliminarFotoInstalacion} className="p-3">
                <input type="hidden" name="nombre" value={foto.nombre} />
                <BotonConfirmar
                  mensaje="¿Quitar esta foto del sitio público?"
                  className="text-sm font-bold text-red-700"
                >
                  Quitar foto
                </BotonConfirmar>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
