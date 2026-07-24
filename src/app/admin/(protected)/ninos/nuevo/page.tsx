import { crearNino } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function NuevoNinoPage() {
  const supabase = await createClient();
  const { data: tutores } = await supabase
    .from("tutores")
    .select("id, nombre, apellido_paterno")
    .order("nombre");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Nuevo niño
      </h1>
      <form action={crearNino} className="glass mt-6 space-y-6 rounded-2xl p-6">
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-extrabold text-brand-blue-dark">
            Datos del niño
          </legend>
          <Campo label="Nombre" name="nombre" required />
          <Campo label="Apellido paterno" name="apellido_paterno" required />
          <Campo label="Apellido materno" name="apellido_materno" />
          <Campo label="Fecha de nacimiento" name="fecha_nacimiento" type="date" required />
          <div>
            <label className="text-sm font-bold text-brand-blue-dark">Sexo</label>
            <select name="sexo" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
              <option value="">Selecciona</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <Campo label="Salón / grupo" name="salon" placeholder="Ej. Lactantes, Maternal 1" />
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-extrabold text-brand-blue-dark">
            Salud
          </legend>
          <Campo label="Tipo de sangre" name="tipo_sangre" />
          <Campo label="Alergias" name="alergias" />
          <Campo label="Condiciones médicas" name="condiciones_medicas" />
          <Campo label="Pediatra" name="pediatra_nombre" />
          <Campo label="Teléfono del pediatra" name="pediatra_telefono" />
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-bold text-brand-blue-dark">
            <input type="checkbox" name="vacunas_al_dia" className="h-4 w-4" />
            Vacunas al día
          </label>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-extrabold text-brand-blue-dark">
            Tutor principal (opcional aquí)
          </legend>
          <div>
            <label className="text-sm font-bold text-brand-blue-dark">Tutor</label>
            <select name="tutor_id" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
              <option value="">Sin asignar (agrégalo después)</option>
              {tutores?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} {t.apellido_paterno}
                </option>
              ))}
            </select>
          </div>
          <Campo label="Parentesco" name="parentesco" placeholder="Mamá, papá, etc." />
        </fieldset>

        <button
          type="submit"
          className="rounded-full bg-brand-blue px-6 py-2.5 font-extrabold text-white"
        >
          Guardar niño
        </button>
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
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
      />
    </div>
  );
}
