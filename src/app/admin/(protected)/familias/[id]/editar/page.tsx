import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { actualizarTutor } from "@/app/admin/actions";
import FotoInput from "@/components/admin/FotoInput";

export default async function EditarTutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tutor } = await supabase
    .from("tutores")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!tutor) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/admin/familias/${tutor.id}`}
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la familia
      </Link>

      <h1 className="mt-4 text-2xl font-black text-brand-blue-dark">
        Editar datos del tutor
      </h1>

      <form
        action={actualizarTutor}
        encType="multipart/form-data"
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="tutor_id" value={tutor.id} />
        <Campo label="Nombre" name="nombre" defaultValue={tutor.nombre} required />
        <Campo
          label="Apellido paterno"
          name="apellido_paterno"
          defaultValue={tutor.apellido_paterno}
          required
        />
        <Campo
          label="Apellido materno"
          name="apellido_materno"
          defaultValue={tutor.apellido_materno ?? ""}
        />
        <Campo
          label="Teléfono"
          name="telefono"
          defaultValue={tutor.telefono}
          required
        />
        <Campo
          label="Teléfono alternativo"
          name="telefono_alternativo"
          defaultValue={tutor.telefono_alternativo ?? ""}
        />
        <Campo
          label="Correo"
          name="email"
          type="email"
          defaultValue={tutor.email ?? ""}
        />
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Dirección
          </label>
          <input
            name="direccion"
            defaultValue={tutor.direccion ?? ""}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <FotoInput
            name="foto"
            label="Foto del tutor (tipo credencial)"
            fotoActualUrl={tutor.foto_url}
          />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white"
          >
            Guardar cambios
          </button>
          <Link
            href={`/admin/familias/${tutor.id}`}
            className="rounded-full border-2 border-black/10 px-6 py-2.5 font-extrabold text-brand-blue-dark"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-brand-blue-dark">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
      />
    </div>
  );
}
