"use client";

export type NinoPago = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  plan: {
    nombre: string;
    tipo: "mensualidad" | "tarjeta_horas";
    monto: number;
  } | null;
};

/** Al elegir un niño/a, llena automáticamente el tipo, el monto y el
 * concepto del formulario de pago según el plan que tiene asignado (los
 * campos siguen siendo editables a mano por si el cobro es distinto). */
export default function SelectorNinoPago({ ninos }: { ninos: NinoPago[] }) {
  function aplicarNino(ninoId: string) {
    const nino = ninos.find((n) => n.id === ninoId);
    const tipoEl = document.getElementById(
      "campo-tipo",
    ) as HTMLSelectElement | null;
    const montoEl = document.getElementById(
      "campo-monto",
    ) as HTMLInputElement | null;
    const conceptoEl = document.getElementById(
      "campo-concepto",
    ) as HTMLInputElement | null;

    if (!nino?.plan) return;
    if (tipoEl) tipoEl.value = nino.plan.tipo;
    if (montoEl) montoEl.value = String(nino.plan.monto);
    if (conceptoEl) conceptoEl.value = nino.plan.nombre;
  }

  return (
    <div>
      <label className="text-sm font-bold text-brand-blue-dark">Niño</label>
      <select
        name="nino_id"
        required
        onChange={(e) => aplicarNino(e.target.value)}
        defaultValue=""
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
      >
        <option value="">Selecciona…</option>
        {ninos.map((n) => (
          <option key={n.id} value={n.id}>
            {n.nombre} {n.apellidoPaterno}
            {n.plan ? ` — ${n.plan.nombre}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
