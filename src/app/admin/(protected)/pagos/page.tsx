import { createClient } from "@/lib/supabase/server";
import { registrarPago } from "@/app/admin/actions";

export default async function PagosPage() {
  const supabase = await createClient();

  const [{ data: ninos }, { data: pagos }] = await Promise.all([
    supabase.from("ninos").select("id, nombre, apellido_paterno").eq("activo", true).order("nombre"),
    supabase
      .from("pagos")
      .select("*, ninos(nombre, apellido_paterno)")
      .order("fecha_pago", { ascending: false })
      .limit(50),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">Pagos</h1>

      <form
        action={registrarPago}
        className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3"
      >
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Niño</label>
          <select name="nino_id" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
            <option value="">Selecciona…</option>
            {ninos?.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre} {n.apellido_paterno}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Tipo</label>
          <select name="tipo" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
            <option value="mensualidad">Mensualidad</option>
            <option value="comida">Comida</option>
            <option value="inscripcion">Inscripción</option>
            <option value="extra">Extra</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Monto (MXN)</label>
          <input
            type="number"
            step="0.01"
            name="monto"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Mes que cubre</label>
          <input type="date" name="mes_correspondiente" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Fecha de pago</label>
          <input type="date" name="fecha_pago" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Método</label>
          <select name="metodo_pago" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">Concepto</label>
          <input name="concepto" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Estatus</label>
          <select name="estatus" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white"
          >
            Registrar pago
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-blue-light text-brand-blue-dark">
            <tr>
              <th className="px-4 py-3">Niño</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {pagos?.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold">
                  {p.ninos?.nombre} {p.ninos?.apellido_paterno}
                </td>
                <td className="px-4 py-3 capitalize">{p.tipo}</td>
                <td className="px-4 py-3">${Number(p.monto).toLocaleString("es-MX")}</td>
                <td className="px-4 py-3">{p.fecha_pago}</td>
                <td className="px-4 py-3 capitalize">{p.metodo_pago || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      p.estatus === "pagado"
                        ? "bg-brand-green/15 text-brand-green-dark"
                        : p.estatus === "pendiente"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.estatus}
                  </span>
                </td>
              </tr>
            ))}
            {!pagos?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-foreground/50">
                  Aún no hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
