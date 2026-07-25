import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { actualizarPago } from "@/app/admin/actions";

export default async function EditarPagoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: pago }, { data: ninos }] = await Promise.all([
    supabase.from("pagos").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("ninos")
      .select("id, nombre, apellido_paterno")
      .eq("activo", true)
      .order("nombre"),
  ]);

  if (!pago) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/pagos"
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a pagos
      </Link>

      <h1 className="mt-4 text-2xl font-black text-brand-blue-dark">
        Editar pago
      </h1>

      <form
        action={actualizarPago}
        className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="pago_id" value={pago.id} />
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Niño
          </label>
          <select
            name="nino_id"
            required
            defaultValue={pago.nino_id}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          >
            {ninos?.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre} {n.apellido_paterno}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Tipo
          </label>
          <select
            name="tipo"
            required
            defaultValue={pago.tipo}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          >
            <option value="mensualidad">Mensualidad</option>
            <option value="comida">Comida</option>
            <option value="inscripcion">Inscripción</option>
            <option value="extra">Extra</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Monto (MXN)
          </label>
          <input
            type="number"
            step="0.01"
            name="monto"
            required
            defaultValue={pago.monto}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Mes que cubre
          </label>
          <input
            type="date"
            name="mes_correspondiente"
            defaultValue={pago.mes_correspondiente ?? ""}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Fecha de pago
          </label>
          <input
            type="date"
            name="fecha_pago"
            defaultValue={pago.fecha_pago ?? ""}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Método
          </label>
          <select
            name="metodo_pago"
            defaultValue={pago.metodo_pago ?? ""}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-bold text-brand-blue-dark">
            Concepto
          </label>
          <input
            name="concepto"
            defaultValue={pago.concepto ?? ""}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Estatus
          </label>
          <select
            name="estatus"
            defaultValue={pago.estatus}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
          >
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white"
          >
            Guardar cambios
          </button>
          <Link
            href="/admin/pagos"
            className="rounded-full border-2 border-black/10 px-6 py-2.5 font-extrabold text-brand-blue-dark"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
