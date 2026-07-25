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

  // Si algo falla al subir la foto (bucket, formato, red, etc.) no
  // tumbamos todo el formulario: seguimos sin foto y se puede agregar
  // después desde "Editar". Así un problema con la imagen no bloquea el
  // registro del tutor/niño/pago.
  try {
    const ext = file.name.split(".").pop() || "jpg";
    const ruta = `${carpeta}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("fotos")
      .upload(ruta, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error) {
      console.error("No se pudo subir la foto:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("fotos").getPublicUrl(ruta);
    return data.publicUrl;
  } catch (err) {
    console.error("subirFoto:", err);
    return null;
  }
}
