import Image from "next/image";
import { Share2, Camera, MapPin, Music2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  crearPublicacion,
  eliminarPublicacion,
  reintentarPublicacion,
} from "@/app/admin/actions";
import BotonConfirmar from "@/components/admin/BotonConfirmar";
import FotoInput from "@/components/admin/FotoInput";
import { facebookConfigurado } from "@/lib/redes-sociales/facebook";
import { instagramConfigurado } from "@/lib/redes-sociales/instagram";
import { googleConfigurado } from "@/lib/redes-sociales/google";
import { tiktokConfigurado } from "@/lib/redes-sociales/tiktok";

const REDES = [
  { key: "facebook", nombre: "Facebook", Icon: Share2, configurada: facebookConfigurado() },
  { key: "instagram", nombre: "Instagram", Icon: Camera, configurada: instagramConfigurado() },
  { key: "google", nombre: "Google (perfil de negocio)", Icon: MapPin, configurada: googleConfigurado() },
  { key: "tiktok", nombre: "TikTok", Icon: Music2, configurada: tiktokConfigurado() },
] as const;

type BlogPost = {
  id: string;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  estado: "borrador" | "publicado";
  redes_seleccionadas: string[];
  redes_resultado: Record<string, { ok: boolean; error?: string } | undefined>;
  created_at: string;
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const postsList = (posts ?? []) as unknown as BlogPost[];

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Blog / Redes sociales
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Escribe aquí la publicación una sola vez y elige a qué redes
        enviarla. Las que digan &ldquo;no conectada&rdquo; se guardan
        igual — en cuanto conectes esa red se pueden reintentar.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {REDES.map(({ key, nombre, Icon, configurada }) => (
          <span
            key={key}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              configurada
                ? "bg-brand-green/15 text-brand-green-dark"
                : "bg-black/5 text-foreground/50"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {nombre} · {configurada ? "Conectada" : "No conectada"}
          </span>
        ))}
      </div>

      <form
        action={crearPublicacion}
        className="glass mt-6 grid gap-4 rounded-2xl p-6"
      >
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Título
          </label>
          <input
            name="titulo"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Contenido
          </label>
          <textarea
            name="contenido"
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>

        <FotoInput name="imagen" label="Imagen" />

        <div>
          <p className="text-sm font-bold text-brand-blue-dark">
            Publicar en
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            {REDES.map(({ key, nombre, configurada }) => (
              <label
                key={key}
                className="flex items-center gap-1.5 rounded-lg bg-white/60 px-3 py-2 text-sm"
              >
                <input type="checkbox" name="redes" value={key} className="h-4 w-4 rounded border-black/20" />
                {nombre}
                {!configurada && (
                  <span className="text-[10px] font-bold text-foreground/40">
                    (no conectada)
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-sm font-bold text-brand-blue-dark">
              Estatus
            </label>
            <select
              name="estado"
              defaultValue="borrador"
              className="mt-1 w-40 rounded-lg border border-black/10 px-3 py-2"
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicar ahora</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white"
          >
            Guardar publicación
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {postsList.map((post) => (
          <div key={post.id} className="glass flex gap-4 rounded-2xl p-4">
            {post.imagen_url ? (
              <Image
                src={post.imagen_url}
                alt={post.titulo}
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="h-24 w-24 shrink-0 rounded-xl bg-brand-green/10" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-extrabold text-brand-blue-dark">
                  {post.titulo}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    post.estado === "publicado"
                      ? "bg-brand-green/15 text-brand-green-dark"
                      : "bg-black/5 text-foreground/50"
                  }`}
                >
                  {post.estado === "publicado" ? "Publicado" : "Borrador"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
                {post.contenido}
              </p>

              {post.redes_seleccionadas?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.redes_seleccionadas.map((red) => {
                    const resultado = post.redes_resultado?.[red];
                    const ok = resultado?.ok;
                    return (
                      <span
                        key={red}
                        title={resultado?.error}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          ok
                            ? "bg-brand-green/15 text-brand-green-dark"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {red} · {ok ? "publicado" : "pendiente"}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="mt-2 flex items-center gap-3">
                {post.redes_seleccionadas?.length > 0 && (
                  <form action={reintentarPublicacion}>
                    <input type="hidden" name="post_id" value={post.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1 text-xs font-bold text-brand-blue-dark hover:underline"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Reintentar publicar
                    </button>
                  </form>
                )}
                <form action={eliminarPublicacion}>
                  <input type="hidden" name="post_id" value={post.id} />
                  <BotonConfirmar
                    mensaje="¿Borrar esta publicación?"
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Borrar
                  </BotonConfirmar>
                </form>
              </div>
            </div>
          </div>
        ))}
        {!postsList.length && (
          <p className="text-center text-sm text-foreground/50">
            Aún no hay publicaciones.
          </p>
        )}
      </div>
    </div>
  );
}
