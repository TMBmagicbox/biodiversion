import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Sube un archivo (si viene uno válido en el FormData) al bucket público
 * "fotos" y regresa su URL pública. Si no hay archivo, regresa null.
 */
export async function subirFoto(
  supabase: SupabaseClient,
  file: FormDataEntryValue | null,
  carpeta: "tutores" | "ninos" | "hero",
): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const ruta = `${carpeta}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("fotos").upload(ruta, file, {
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) throw new Error(`No se pudo subir la foto: ${error.message}`);

  const { data } = supabase.storage.from("fotos").getPublicUrl(ruta);
  return data.publicUrl;
}
