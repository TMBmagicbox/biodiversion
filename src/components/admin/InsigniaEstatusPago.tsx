import { estatusPago, ESTATUS_PAGO_LEGIBLE } from "@/lib/pagos";

const ESTILOS: Record<string, string> = {
  sin_fecha: "bg-black/5 text-foreground/50",
  al_dia: "bg-brand-green/15 text-brand-green-dark",
  por_vencer: "bg-amber-100 text-amber-800",
  vencido: "bg-red-100 text-red-700",
};

/** Insignia de color según qué tan cerca está la próxima fecha de pago. */
export default function InsigniaEstatusPago({
  proximaFechaPago,
  hoyISO,
}: {
  proximaFechaPago: string | null;
  hoyISO: string;
}) {
  const estatus = estatusPago(proximaFechaPago, hoyISO);
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${ESTILOS[estatus]}`}
    >
      {ESTATUS_PAGO_LEGIBLE[estatus]}
      {proximaFechaPago ? ` · ${proximaFechaPago}` : ""}
    </span>
  );
}
