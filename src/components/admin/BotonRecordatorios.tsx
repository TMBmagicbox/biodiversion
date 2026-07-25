"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { enviarRecordatoriosPago } from "@/app/admin/actions";
import InsigniaEstatusPago from "@/components/admin/InsigniaEstatusPago";

export type NinoRecordatorio = {
  id: string;
  nombre: string;
  proximaFechaPago: string | null;
  tutorNombre: string | null;
  tutorTelefono: string | null;
};

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

/** Lista de niños por vencer/vencidos con casilla para elegir a quién sí
 * mandarle el recordatorio de WhatsApp y a quién no. */
export default function BotonRecordatorios({
  ninos,
  hoyISO,
}: {
  ninos: NinoRecordatorio[];
  hoyISO: string;
}) {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(
    new Set(ninos.map((n) => n.id)),
  );
  const [estado, accion, enviando] = useActionState(
    async (_prev: Estado, formData: FormData) => {
      const resultado = await enviarRecordatoriosPago(formData);
      return { ...resultado, listo: true };
    },
    estadoInicial,
  );

  function alternar(id: string) {
    setSeleccionados((prev) => {
      const copia = new Set(prev);
      if (copia.has(id)) copia.delete(id);
      else copia.add(id);
      return copia;
    });
  }

  return (
    <form action={accion}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-foreground/60">
          {seleccionados.size} de {ninos.length} seleccionados
        </p>
        <div className="flex gap-3 text-xs font-bold text-brand-blue-dark">
          <button
            type="button"
            onClick={() => setSeleccionados(new Set(ninos.map((n) => n.id)))}
            className="hover:underline"
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSeleccionados(new Set())}
            className="hover:underline"
          >
            Ninguno
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-1.5">
        {ninos.map((n) => (
          <label
            key={n.id}
            className="flex flex-wrap items-center gap-2 rounded-xl bg-white/60 px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              name="nino_id"
              value={n.id}
              checked={seleccionados.has(n.id)}
              onChange={() => alternar(n.id)}
              className="h-4 w-4 shrink-0 rounded border-black/20"
            />
            <span className="min-w-[10rem] flex-1 font-bold text-brand-blue-dark">
              {n.nombre}
            </span>
            <span className="text-xs text-foreground/60">
              {n.tutorTelefono
                ? `${n.tutorNombre} · ${n.tutorTelefono}`
                : "Sin tutor con teléfono"}
            </span>
            <InsigniaEstatusPago
              proximaFechaPago={n.proximaFechaPago}
              hoyISO={hoyISO}
            />
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={enviando || seleccionados.size === 0}
        className="mt-4 flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {enviando
          ? "Enviando…"
          : `Enviar recordatorio a ${seleccionados.size} tutor(es)`}
      </button>

      {estado.listo && (
        <p className="mt-2 text-xs text-foreground/60">
          Enviados: {estado.enviados} · Sin tutor con teléfono:{" "}
          {estado.omitidos}
          {estado.fallidos > 0 &&
            ` · Fallidos: ${estado.fallidos} (revisa que el número haya mandado "join" al Sandbox, o que WhatsApp esté bien configurado)`}
        </p>
      )}
    </form>
  );
}
