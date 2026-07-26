import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { actualizarHeroSlide } from "@/app/admin/actions";

export default async function EditarHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: slide } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!slide) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/inicio"
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al banner de inicio
      </Link>

      <h1 className="mt-4 text-2xl font-black text-brand-blue-dark">
        Editar slide
      </h1>

      <form
        action={actualizarHeroSlide}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value={slide.id} />
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Título
          </label>
          <input
            name="titulo"
            required
            defaultValue={slide.titulo}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={2}
            defaultValue={slide.descripcion ?? ""}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Imagen de fondo
          </label>
          {slide.imagen_fondo_url && (
            <div className="relative mt-1 h-24 w-full overflow-hidden rounded-lg">
              <Image
                src={slide.imagen_fondo_url}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            name="imagen_fondo"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-foreground/50">
            Déjalo vacío para conservar la imagen actual.
          </p>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Imagen decorativa (PNG sin fondo)
          </label>
          {slide.imagen_decorativa_url && (
            <div className="relative mt-1 h-24 w-full overflow-hidden rounded-lg bg-brand-blue/10">
              <Image
                src={slide.imagen_decorativa_url}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          )}
          <input
            type="file"
            name="imagen_decorativa"
            accept="image/png"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-foreground/50">
            Déjalo vacío para conservar la imagen actual.
          </p>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Logo (PNG sin fondo)
          </label>
          {slide.logo_url && (
            <div className="relative mt-1 h-24 w-full overflow-hidden rounded-lg bg-brand-blue/10">
              <Image
                src={slide.logo_url}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          )}
          <input
            type="file"
            name="logo"
            accept="image/png"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-foreground/50">
            Déjalo vacío para conservar el logo actual.
          </p>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Texto del botón
          </label>
          <input
            name="texto_boton"
            defaultValue={slide.texto_boton ?? "Agenda una visita"}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            URL del botón
          </label>
          <input
            name="url_boton"
            defaultValue={slide.url_boton ?? "#contacto"}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white transition-transform hover:scale-105"
          >
            Guardar cambios
          </button>
          <Link
            href="/admin/inicio"
            className="rounded-full border-2 border-black/10 px-6 py-2.5 font-extrabold text-brand-blue-dark"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
