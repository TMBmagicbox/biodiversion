import { createClient } from "@/lib/supabase/server";
import { registrarEntrada, registrarSalida } from "@/app/admin/actions";

function formatHora(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AsistenciaPage() {
  const supabase = await createClient();
  const hoy = new Date().toISOString().slice(0, 10);

  const [{ data: ninos }, { data: registros }] = await Promise.all([
    supabase.from("ninos").select("id, nombre, apellido_paterno").eq("activo", true).order("nombre"),
    supabase
      .from("asistencia_horas")
      .select("*, ninos(nombre, apellido_paterno)")
      .eq("fecha", hoy)
      .order("hora_entrada", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Asistencia de hoy — control de horas
      </h1>

      <form
        action={registrarEntrada}
        className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Niño</label>
          <select
            name="nino_id"
            required
            className="mt-1 w-56 rounded-lg border border-black/10 px-3 py-2"
          >
            <option value="">Selecciona…</option>
            {ninos?.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre} {n.apellido_paterno}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Entregado por
          </label>
          <input
            name="entregado_por"
            className="mt-1 w-56 rounded-lg border border-black/10 px-3 py-2"
            placeholder="Nombre de quien lo dejó"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-brand-green px-5 py-2.5 font-extrabold text-white"
        >
          Registrar entrada
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-blue-light text-brand-blue-dark">
            <tr>
              <th className="px-4 py-3">Niño</th>
              <th className="px-4 py-3">Entrada</th>
              <th className="px-4 py-3">Salida</th>
              <th className="px-4 py-3">Horas</th>
              <th className="px-4 py-3">Recoger / acción</th>
            </tr>
          </thead>
          <tbody>
            {registros?.map((r) => (
              <tr key={r.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold">
                  {r.ninos?.nombre} {r.ninos?.apellido_paterno}
                </td>
                <td className="px-4 py-3">{formatHora(r.hora_entrada)}</td>
                <td className="px-4 py-3">{formatHora(r.hora_salida)}</td>
                <td className="px-4 py-3">
                  {r.horas_totales ? `${r.horas_totales} h` : "En curso"}
                </td>
                <td className="px-4 py-3">
                  {r.hora_salida ? (
                    r.recogido_por || "—"
                  ) : (
                    <form action={registrarSalida} className="flex gap-2">
                      <input type="hidden" name="asistencia_id" value={r.id} />
                      <input
                        name="recogido_por"
                        placeholder="¿Quién lo recoge?"
                        className="w-40 rounded-lg border border-black/10 px-2 py-1"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-brand-blue px-3 py-1 text-xs font-extrabold text-white"
                      >
                        Registrar salida
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {!registros?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-foreground/50">
                  Aún no hay registros de asistencia hoy.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
