"use client";

export type Plan = {
  id: string;
  nombre: string;
  tipo: "mensualidad" | "tarjeta_horas";
  monto: number;
  horas_incluidas: number | null;
};

/** Al elegir un plan, llena automáticamente el tipo, el monto y el concepto
 * del formulario de pago (los campos siguen siendo editables a mano). */
export default function SelectorPlanPago({ planes }: { planes: Plan[] }) {
  function aplicarPlan(planId: string) {
    const plan = planes.find((p) => p.id === planId);
    const tipoEl = document.getElementById("campo-tipo") as HTMLSelectElement | null;
    const montoEl = document.getElementById("campo-monto") as HTMLInputElement | null;
    const conceptoEl = document.getElementById(
      "campo-concepto",
    ) as HTMLInputElement | null;

    if (!plan) return;
    if (tipoEl) tipoEl.value = plan.tipo;
    if (montoEl) montoEl.value = String(plan.monto);
    if (conceptoEl) conceptoEl.value = plan.nombre;
  }

  return (
    <div>
      <label className="text-sm font-bold text-brand-blue-dark">Plan</label>
      <select
        onChange={(e) => aplicarPlan(e.target.value)}
        defaultValue=""
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
      >
        <option value="">Personalizado…</option>
        {planes.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre} — ${p.monto.toLocaleString("es-MX")}
            {p.tipo === "tarjeta_horas" ? ` (${p.horas_incluidas} h)` : "/mes"}
          </option>
        ))}
      </select>
    </div>
  );
}
