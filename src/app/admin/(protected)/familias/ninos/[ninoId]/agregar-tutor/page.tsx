import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { crearTutorParaNino } from "@/app/admin/actions";
import FotoInput from "@/components/admin/FotoInput";

export default async function AgregarTutorPage({
  params,
}: {
  params: Promise<{ ninoId: string }>;
}) {
  const { ninoId } = await params;
  const supabase = await createClient();

  const { data: nino } = await supabase
    .from("ninos")
    .select("id, nombre, apellido_paterno, salon")
    .eq("id", ninoId)
    .maybeSingle();

  if (!nino) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/familias"
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a familias
      </Link>

      <h1 className="mt-4 text-2xl font-black text-brand-blue-dark">
        Agregar tutor de {nino.nombre} {nino.apellido_paterno}
      </h1>
      {nino.salon && (
        <p className="mt-1 text-sm text-foreground/60">Salón: {nino.salon}</p>
      )}

      <form
        action={crearTutorParaNino}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="nino_id" value={nino.id} />
        <Campo label="Nombre" name="nombre" required />
        <Campo label="Apellido paterno" name="apellido_paterno" required />
        <Campo label="Apellido materno" name="apellido_materno" />
        <Campo label="Teléfono" name="telefono" required />
        <Campo label="Teléfono alternativo" name="telefono_alternativo" />
        <Campo label="Correo" name="email" type="email" />
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Dirección
          </label>
          <input
            name="direccion"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          />
        </div>
        <Campo
          label="Parentesco"
          name="parentesco"
          placeholder="Mamá, papá, etc."
        />
        <div className="sm:col-span-2">
          <FotoInput name="tutor_foto" label="Foto del tutor (tipo credencial)" />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white"
          >
            Guardar tutor
          </button>
          <Link
            href="/admin/familias"
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
      />
    </div>
  );
}
