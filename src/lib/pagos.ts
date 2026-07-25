// Utilidades del calendario de pagos: calcular la próxima fecha de cobro a
// partir de un "día de pago" fijo, y clasificar esa fecha en 3 estatus para
// las alertas (al día / por vencer / vencido).

function parseFechaISO(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Regresa la fecha (YYYY-MM-DD) del próximo "día de pago" estrictamente
 * después de `desdeISO`. Si el día de pago ya pasó este mes (o es hoy), se
 * usa el mes siguiente. Si el mes no tiene ese día (ej. 31 en febrero), se
 * usa el último día del mes. */
export function siguienteFechaPago(diaPago: number, desdeISO: string): string {
  const [y, m, d] = desdeISO.split("-").map(Number);
  let anio = y;
  let mes = m; // 1-12
  if (d >= diaPago) {
    mes += 1;
    if (mes > 12) {
      mes = 1;
      anio += 1;
    }
  }
  const ultimoDiaDelMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const diaFinal = Math.min(diaPago, ultimoDiaDelMes);
  return `${anio}-${String(mes).padStart(2, "0")}-${String(diaFinal).padStart(2, "0")}`;
}

export type EstatusPago = "sin_fecha" | "al_dia" | "por_vencer" | "vencido";

/** Clasifica la próxima fecha de pago respecto a hoy. `diasAviso` es cuántos
 * días antes (inclusive) se considera "por vencer". */
export function estatusPago(
  proximaFechaPago: string | null | undefined,
  hoyISO: string,
  diasAviso = 3,
): EstatusPago {
  if (!proximaFechaPago) return "sin_fecha";
  const dias = Math.round(
    (parseFechaISO(proximaFechaPago).getTime() -
      parseFechaISO(hoyISO).getTime()) /
      86400000,
  );
  if (dias < 0) return "vencido";
  if (dias <= diasAviso) return "por_vencer";
  return "al_dia";
}

export const ESTATUS_PAGO_LEGIBLE: Record<EstatusPago, string> = {
  sin_fecha: "Sin fecha de pago",
  al_dia: "Al día",
  por_vencer: "Por vencer",
  vencido: "Vencido",
};
