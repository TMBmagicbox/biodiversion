import { createClient } from "@/lib/supabase/server";
import { estatusPago } from "@/lib/pagos";
import type { DeudorCarrusel } from "@/components/admin/CarruselDeudores";

export type NinoDeudor = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  foto_url: string | null;
  salon: string | null;
  plan: { nombre: string; tipo: string } | null;
  proxima_fecha_pago: string | null;
  tutores_ninos: {
    parentesco: string | null;
    contacto_principal: boolean;
    tutor: {
      nombre: string;
      apellido_paterno: string;
      telefono: string | null;
    } | null;
  }[];
  personas_autorizadas: {
    nombre: string;
    parentesco: string | null;
    telefono: string | null;
  }[];
};

/** Trae los niños activos con pago por vencer (3 días o menos) o vencido,
 * con todos los datos necesarios para la alerta/carrusel de deudores (que
 * se muestra en todo el panel) y para la lista de recordatorios de
 * WhatsApp en Pagos. Centralizado aquí para no repetir la consulta. */
export async function obtenerNinosPorVencerOVencidos(hoyISO: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ninos")
    .select(
      "id, nombre, apellido_paterno, foto_url, salon, plan:planes(nombre, tipo), proxima_fecha_pago, tutores_ninos(parentesco, contacto_principal, tutor:tutores(nombre, apellido_paterno, telefono)), personas_autorizadas(nombre, parentesco, telefono)",
    )
    .eq("activo", true)
    .not("proxima_fecha_pago", "is", null)
    .order("proxima_fecha_pago", { ascending: true });

  const ninos = (data ?? []) as unknown as NinoDeudor[];
  return ninos
    .map((n) => ({ ...n, estatus: estatusPago(n.proxima_fecha_pago, hoyISO) }))
    .filter((n) => n.estatus === "por_vencer" || n.estatus === "vencido");
}

export function aDeudorCarrusel(
  n: Awaited<ReturnType<typeof obtenerNinosPorVencerOVencidos>>[number],
): DeudorCarrusel {
  return {
    id: n.id,
    nombreCompleto: `${n.nombre} ${n.apellido_paterno}`,
    fotoUrl: n.foto_url,
    salon: n.salon,
    plan: n.plan,
    proximaFechaPago: n.proxima_fecha_pago,
    tutores: (n.tutores_ninos ?? [])
      .filter((tn) => tn.tutor)
      .map((tn) => ({
        nombre: `${tn.tutor!.nombre} ${tn.tutor!.apellido_paterno}`,
        parentesco: tn.parentesco,
        telefono: tn.tutor!.telefono,
      })),
    personasAutorizadas: n.personas_autorizadas ?? [],
  };
}
