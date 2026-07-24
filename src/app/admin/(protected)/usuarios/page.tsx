import { createClient } from "@/lib/supabase/server";
import { asegurarPerfilPropio, crearUsuarioPersonal } from "@/app/admin/actions";

const roles = [
  { value: "admin", label: "Administrador/a" },
  { value: "direccion", label: "Dirección" },
  { value: "educadora", label: "Educadora" },
  { value: "recepcion", label: "Recepción" },
];

export default async function UsuariosPage() {
  // Si el usuario actual (tú) no tiene fila en perfiles_admin, se crea sola.
  await asegurarPerfilPropio();

  const supabase = await createClient();
  const { data: perfiles } = await supabase
    .from("perfiles_admin")
    .select("id, nombre, rol, activo, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Usuarios del personal
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Crea accesos al panel para el equipo (dirección, educadoras,
        recepción).
      </p>

      <form
        action={crearUsuarioPersonal}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Nombre
          </label>
          <input
            name="nombre"
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            placeholder="Nombre de la persona"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Rol
          </label>
          <select
            name="rol"
            defaultValue="educadora"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Correo
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Contraseña temporal
          </label>
          <input
            type="text"
            name="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white transition-transform hover:scale-105"
          >
            Crear acceso
          </button>
          <p className="mt-2 text-xs text-foreground/50">
            Comparte el correo y esta contraseña con la persona; podrá
            entrar en <code>/admin/login</code>.
          </p>
        </div>
      </form>

      <div className="glass mt-6 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-blue-light text-brand-blue-dark">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {perfiles?.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold">{p.nombre}</td>
                <td className="px-4 py-3 capitalize">{p.rol}</td>
                <td className="px-4 py-3">
                  {p.activo ? "Activo" : "Inactivo"}
                </td>
              </tr>
            ))}
            {!perfiles?.length && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-foreground/50">
                  Aún no hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
