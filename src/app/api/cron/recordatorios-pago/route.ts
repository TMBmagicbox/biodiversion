import { NextRequest, NextResponse } from "next/server";
import { enviarRecordatoriosPago } from "@/app/admin/actions";

// Tarea programada (ver vercel.json) que revisa todos los días los pagos
// por vencer/vencidos y manda el recordatorio de WhatsApp automáticamente.
// Mientras Twilio no esté configurado (ver src/lib/whatsapp.ts), simplemente
// no manda nada y regresa "fallidos" en la respuesta — no rompe nada.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const resultado = await enviarRecordatoriosPago();
  return NextResponse.json(resultado);
}
