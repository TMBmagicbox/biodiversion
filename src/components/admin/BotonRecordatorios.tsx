"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { enviarRecordatoriosPago } from "@/app/admin/actions";

type Estado = {
  enviados: number;
  fallidos: number;
  omitidos: number;
  listo: boolean;
};

const estadoInicial: Estado = {
  enviados: 0,
  fallidos: 0,
  omitidos: 0,
  listo: false,
};

/** Botón que dispara el envío manual de recordatorios por WhatsApp a los
 * tutores de los niños "por vencer" o "vencidos". */
export default function BotonRecordatorios() {
  const [estado, accion, enviando] = useActionState(async () => {
    const resultado = await enviarRecordatoriosPago();
    return { ...resultado, listo: true };
  }, estadoInicial);

  return (
    <div>
      <form action={accion}>
        <button
          type="submit"
          disabled={enviando}
          className="flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white transition-transform hover:scale-105 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {enviando ? "Enviando…" : "Enviar recordatorios por WhatsApp"}
        </button>
      </form>
      {estado.listo && (
        <p className="mt-2 text-xs text-foreground/60">
          Enviados: {estado.enviados} · Sin tutor con teléfono:{" "}
          {estado.omitidos}
          {estado.fallidos > 0 &&
            ` · Fallidos: ${estado.fallidos} (revisa que WhatsApp esté configurado — ver src/lib/whatsapp.ts)`}
        </p>
      )}
    </div>
  );
}
