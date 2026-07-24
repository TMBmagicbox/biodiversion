import { crearTutor } from "@/app/admin/actions";

export default function NuevoTutorPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Nuevo tutor
      </h1>
      <form action={crearTutor} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre" name="nombre" required />
          <Campo label="Apellido paterno" name="apellido_paterno" required />
          <Campo label="Apellido materno" name="apellido_materno" />
          <Campo label="Teléfono" name="telefono" required />
          <Campo label="Teléfono alternativo" name="telefono_alternativo" />
          <Campo label="Correo" name="email" type="email" />
        </div>
        <Campo label="Dirección" name="direccion" />
        <button
          type="submit"
          className="rounded-full bg-brand-blue px-6 py-2.5 font-extrabold text-white"
        >
          Guardar tutor
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
      />
    </div>
  );
}
