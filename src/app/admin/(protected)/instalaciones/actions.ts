"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { subirFoto } from "@/lib/supabase/storage";

async function exigirPersonal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function volver(estado: string): never {
  updateTag("instalaciones");
  revalidatePath("/");
  revalidatePath("/admin/instalaciones");
  redirect(`/admin/instalaciones?estado=${estado}`);
}

export async function subirFotoInstalacion(formData: FormData) {
  const supabase = await exigirPersonal();
  const archivo = formData.get("foto");

  if (!(archivo instanceof File) || archivo.size === 0) {
    redirect("/admin/instalaciones?estado=vacio");
  }
  if (archivo.size > 8 * 1024 * 1024) {
    redirect("/admin/instalaciones?estado=grande");
  }
  if (!/^image\/(jpeg|png|webp|avif)$/.test(archivo.type)) {
    redirect("/admin/instalaciones?estado=formato");
  }

  const url = await subirFoto(supabase, archivo, "instalaciones");
  if (!url) redirect("/admin/instalaciones?estado=error");
  volver("subida");
}

export async function eliminarFotoInstalacion(formData: FormData) {
  const supabase = await exigirPersonal();
  const nombre = String(formData.get("nombre") || "");
  if (!nombre || nombre.includes("/") || nombre.includes("\\") || nombre.includes("..")) {
    redirect("/admin/instalaciones?estado=error");
  }

  const { error } = await supabase.storage
    .from("fotos")
    .remove([`instalaciones/${nombre}`]);
  if (error) redirect("/admin/instalaciones?estado=error");
  volver("eliminada");
}
