import Link from "next/link";
import { Download, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { registrarPago, eliminarPago } from "@/app/admin/actions";
import BotonConfirmar from "@/components/admin/BotonConfirmar";
import SelectorPlanPago from "@/components/admin/SelectorPlanPago";

const TIPO_LEGIBLE: Record<string, string> = {
  mensualidad: "Mensualidad",
  comida: "Comida",
  inscripcion: "Inscripción",
  extra: "Extra",
  tarjeta_horas: "Tarjeta de horas",
};

export default async function PagosPage() {
  const supabase = await createClient();

  const [{ data: ninos }, { data: pagos }, { data: planes }] = await Promise.all([
    supabase.from("ninos").select("id, nombre, apellido_paterno").eq("activo", true).order("nombre"),
    supabase
      .from("pagos")
      .select("*, ninos(nombre, apellido_paterno)")
      .order("fecha_pago", { ascending: false })
      .limit(50),
    supabase
      .from("planes")
      .select("id, nombre, tipo, monto, horas_incluidas")
      .eq("activo", true)
      .order("monto"),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-brand-blue-dark">Pagos</h1>
        <a
          href="/admin/pagos/exportar"
          className="flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-extrabold text-white transition-transform hover:scale-105"
        >
          <Download className="h-4 w-4" />
          Exportar a Excel
        </a>
      </div>

      <form
        action={registrarPago}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-3"
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
        <SelectorPlanPago planes={planes ?? []} />
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Tipo</label>
          <select
            id="campo-tipo"
            name="tipo"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          >
            <option value="mensualidad">Mensualidad</option>
            <option value="tarjeta_horas">Tarjeta de horas</option>
            <option value="comida">Comida</option>
            <option value="inscripcion">Inscripción</option>
            <option value="extra">Extra</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">Monto (MXN)</label>
          <input
            id="campo-monto"
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
          <input
            id="campo-concepto"
            name="concepto"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
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

      <div className="glass mt-6 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-blue-light text-brand-blue-dark">
            <tr>
              <th className="px-4 py-3">Niño</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos?.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold">
                  {p.ninos?.nombre} {p.ninos?.apellido_paterno}
                </td>
                <td className="px-4 py-3">{TIPO_LEGIBLE[p.tipo] ?? p.tipo}</td>
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/pagos/${p.id}/editar`}
                      aria-label="Editar pago"
                      className="text-brand-blue-dark hover:text-brand-blue"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={eliminarPago}>
                      <input type="hidden" name="pago_id" value={p.id} />
                      <BotonConfirmar
                        mensaje="¿Borrar este pago? Esta acción no se puede deshacer."
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Borrar
                      </BotonConfirmar>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!pagos?.length && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-foreground/50">
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
