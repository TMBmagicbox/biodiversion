import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function edad(fechaNacimiento: string) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses -= 1;
  if (meses < 24) return `${meses} meses`;
  return `${Math.floor(meses / 12)} años`;
}

export default async function NinosPage() {
  const supabase = await createClient();
  const { data: ninos } = await supabase
    .from("ninos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-brand-blue-dark">Niños</h1>
        <Link
          href="/admin/ninos/nuevo"
          className="rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white"
        >
          + Nuevo niño
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-blue-light text-brand-blue-dark">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Edad</th>
              <th className="px-4 py-3">Salón</th>
              <th className="px-4 py-3">Alergias</th>
              <th className="px-4 py-3">Vacunas</th>
              <th className="px-4 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {ninos?.map((n) => (
              <tr key={n.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold">
                  {n.nombre} {n.apellido_paterno} {n.apellido_materno}
                </td>
                <td className="px-4 py-3">{edad(n.fecha_nacimiento)}</td>
                <td className="px-4 py-3">{n.salon || "—"}</td>
                <td className="px-4 py-3">{n.alergias || "Ninguna"}</td>
                <td className="px-4 py-3">
                  {n.vacunas_al_dia ? (
                    <span className="rounded-full bg-brand-green/15 px-2 py-1 text-xs font-bold text-brand-green-dark">
                      Al día
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                      Revisar
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {n.activo ? "Activo" : "Inactivo"}
                </td>
              </tr>
            ))}
            {!ninos?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-foreground/50">
                  Aún no hay niños registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
