import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { actualizarNino } from "@/app/admin/actions";

export default async function EditarNinoPage({
  params,
}: {
  params: Promise<{ id: string; ninoId: string }>;
}) {
  const { id, ninoId } = await params;
  const supabase = await createClient();

  const { data: nino } = await supabase
    .from("ninos")
    .select("*")
    .eq("id", ninoId)
    .maybeSingle();

  if (!nino) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/admin/familias/${id}`}
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la familia
      </Link>

      <h1 className="mt-4 text-2xl font-black text-brand-blue-dark">
        Editar datos de {nino.nombre}
      </h1>

      <form
        action={actualizarNino}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="nino_id" value={nino.id} />
        <input type="hidden" name="tutor_id" value={id} />

        <Campo label="Nombre" name="nombre" defaultValue={nino.nombre} required />
        <Campo
          label="Apellido paterno"
          name="apellido_paterno"
          defaultValue={nino.apellido_paterno}
          required
        />
        <Campo
          label="Apellido materno"
          name="apellido_materno"
          defaultValue={nino.apellido_materno ?? ""}
        />
        <Campo
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          defaultValue={nino.fecha_nacimiento ?? ""}
        />
        <Campo
          label="Salón"
          name="salon"
          defaultValue={nino.salon ?? ""}
          placeholder="Lactantes, Maternal 1, etc."
        />
        <Campo
          label="Tipo de sangre"
          name="tipo_sangre"
          defaultValue={nino.tipo_sangre ?? ""}
        />
        <Campo
          label="Alergias"
          name="alergias"
          defaultValue={nino.alergias ?? ""}
        />
        <Campo
          label="Condiciones médicas"
          name="condiciones_medicas"
          defaultValue={nino.condiciones_medicas ?? ""}
        />
        <Campo
          label="Medicamentos"
          name="medicamentos"
          defaultValue={nino.medicamentos ?? ""}
        />
        <Campo
          label="Pediatra"
          name="pediatra_nombre"
          defaultValue={nino.pediatra_nombre ?? ""}
        />
        <Campo
          label="Teléfono del pediatra"
          name="pediatra_telefono"
          defaultValue={nino.pediatra_telefono ?? ""}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="vacunas_al_dia"
            name="vacunas_al_dia"
            defaultChecked={nino.vacunas_al_dia}
            className="h-4 w-4 rounded border-black/20"
          />
          <label
            htmlFor="vacunas_al_dia"
            className="text-sm font-bold text-brand-blue-dark"
          >
            Vacunas al día
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Nueva foto (opcional, reemplaza la actual)
          </label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
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
            href={`/admin/familias/${id}`}
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
      />
    </div>
  );
}
