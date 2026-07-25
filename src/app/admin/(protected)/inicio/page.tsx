import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  crearHeroSlide,
  eliminarHeroSlide,
  alternarHeroSlide,
} from "@/app/admin/actions";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export default async function InicioAdminPage() {
  const supabase = await createClient();
  const { data: slides } = await supabase
    .from("hero_slides")
    .select("*")
    .order("orden", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Banner de inicio
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Administra las diapositivas del banner de la página principal
        (fondo, logo, título, descripción y botón). Se muestran en el orden
        en que las creas.
      </p>

      <form
        action={crearHeroSlide}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Título
          </label>
          <input
            name="titulo"
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            placeholder="Un lugar seguro para que tu hijo crezca"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={2}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            placeholder="Texto corto debajo del título"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Imagen de fondo
          </label>
          <input
            type="file"
            name="imagen_fondo"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Imagen decorativa (PNG sin fondo, opcional — no el logo)
          </label>
          <input
            type="file"
            name="imagen_decorativa"
            accept="image/png"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-foreground/50">
            Flota sobre el fondo con su propio efecto parallax (se mueve
            más rápido al hacer scroll) para que el banner se sienta más
            dinámico. Ej. una ilustración o foto recortada.
          </p>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Logo (PNG sin fondo, opcional)
          </label>
          <input
            type="file"
            name="logo"
            accept="image/png"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Texto del botón
          </label>
          <input
            name="texto_boton"
            defaultValue="Agenda una visita"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            URL del botón
          </label>
          <input
            name="url_boton"
            defaultValue="#contacto"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            placeholder="#contacto o https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white transition-transform hover:scale-105"
          >
            Agregar slide
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {slides?.map((s) => (
          <div key={s.id} className="glass overflow-hidden rounded-2xl">
            <div className="relative h-32 w-full bg-brand-blue/10">
              {s.imagen_fondo_url && (
                <Image
                  src={s.imagen_fondo_url}
                  alt={s.titulo}
                  fill
                  className="object-cover"
                />
              )}
              {s.imagen_decorativa_url && (
                <Image
                  src={s.imagen_decorativa_url}
                  alt="decorativa"
                  width={64}
                  height={64}
                  className="absolute bottom-2 right-2 h-14 w-auto drop-shadow"
                />
              )}
              {s.logo_url && (
                <Image
                  src={s.logo_url}
                  alt="logo"
                  width={64}
                  height={64}
                  className="absolute bottom-2 left-2 h-10 w-auto drop-shadow"
                />
              )}
              {!s.activo && (
                <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white">
                  Oculto
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-extrabold text-brand-blue-dark">
                {s.titulo}
              </p>
              {s.descripcion && (
                <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
                  {s.descripcion}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <form action={alternarHeroSlide}>
                  <input type="hidden" name="id" value={s.id} />
                  <input
                    type="hidden"
                    name="activo"
                    value={String(s.activo)}
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-brand-blue-dark hover:bg-white"
                  >
                    {s.activo ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Mostrar
                      </>
                    )}
                  </button>
                </form>
                <form action={eliminarHeroSlide}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Eliminar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {!slides?.length && (
          <p className="text-sm text-foreground/50">
            Aún no hay slides — agrega el primero arriba.
          </p>
        )}
      </div>
    </div>
  );
}
