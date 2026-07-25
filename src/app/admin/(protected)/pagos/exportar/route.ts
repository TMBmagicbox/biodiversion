import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ESTATUS_LEGIBLE: Record<string, string> = {
  pagado: "Pagado",
  pendiente: "Pendiente",
  vencido: "Vencido",
};

export async function GET() {
  const supabase = await createClient();

  const { data: pagos, error } = await supabase
    .from("pagos")
    .select("*, ninos(nombre, apellido_paterno, apellido_materno)")
    .order("fecha_pago", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Biodiversión";
  workbook.created = new Date();

  const hoja = workbook.addWorksheet("Pagos");
  hoja.columns = [
    { header: "Niño/a", key: "nino", width: 28 },
    { header: "Tipo", key: "tipo", width: 16 },
    { header: "Concepto", key: "concepto", width: 24 },
    { header: "Monto (MXN)", key: "monto", width: 14 },
    { header: "Mes que cubre", key: "mes", width: 16 },
    { header: "Fecha de pago", key: "fecha", width: 16 },
    { header: "Método", key: "metodo", width: 16 },
    { header: "Estatus", key: "estatus", width: 14 },
  ];
  hoja.getRow(1).font = { bold: true };
  hoja.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE6F5FA" },
  };

  for (const p of pagos ?? []) {
    const nino = p.ninos as {
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string | null;
    } | null;
    hoja.addRow({
      nino: nino
        ? `${nino.nombre} ${nino.apellido_paterno} ${nino.apellido_materno ?? ""}`.trim()
        : "—",
      tipo: p.tipo,
      concepto: p.concepto ?? "",
      monto: Number(p.monto),
      mes: p.mes_correspondiente ?? "",
      fecha: p.fecha_pago ?? "",
      metodo: p.metodo_pago ?? "",
      estatus: ESTATUS_LEGIBLE[p.estatus as string] ?? p.estatus,
    });
  }
  hoja.getColumn("monto").numFmt = '"$"#,##0.00';

  const buffer = await workbook.xlsx.writeBuffer();
  const fecha = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="pagos-biodiversion-${fecha}.xlsx"`,
    },
  });
}
