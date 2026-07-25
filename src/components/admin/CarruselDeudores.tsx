"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Baby, ChevronLeft, ChevronRight, X } from "lucide-react";
import FichaIdentificacion from "@/components/admin/FichaIdentificacion";
import InsigniaEstatusPago from "@/components/admin/InsigniaEstatusPago";

type Persona = {
  nombre: string;
  parentesco?: string | null;
  telefono?: string | null;
};

export type DeudorCarrusel = {
  id: string;
  nombreCompleto: string;
  fotoUrl: string | null;
  salon: string | null;
  plan: { nombre: string; tipo: string } | null;
  proximaFechaPago: string | null;
  tutores: Persona[];
  personasAutorizadas: Persona[];
};

/** Alerta flotante en la esquina derecha, estilo credencial vertical: la
 * foto ocupa toda la tarjeta y los datos (nombre + estatus de pago) van
 * encima, en un panel de vidrio opaco pegado abajo. Se queda ahí (no se
 * cierra sola) mientras haya deudores — cada quien sale de la lista solo
 * cuando su estatus cambia a "al día" (se le registra el pago). */
export default function CarruselDeudores({
  deudores,
  hoyISO,
}: {
  deudores: DeudorCarrusel[];
  hoyISO: string;
}) {
  const [indice, setIndice] = useState(0);
  const [minimizado, setMinimizado] = useState(false);
  // Si la lista se encoge (p. ej. alguien acaba de pagar), este índice
  // "recorta" al último válido sin necesitar un efecto para sincronizarlo.
  const indiceSeguro = deudores.length ? indice % deudores.length : 0;

  useEffect(() => {
    if (deudores.length < 2 || minimizado) return;
    const intervalo = setInterval(() => {
      setIndice((i) => (i + 1) % deudores.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [deudores.length, minimizado]);

  if (deudores.length === 0) return null;

  if (minimizado) {
    return (
      <button
        type="button"
        onClick={() => setMinimizado(false)}
        className="fixed right-4 top-24 z-40 flex animate-pulse items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-extrabold text-white shadow-2xl transition-transform hover:scale-105"
      >
        <AlertTriangle className="h-4 w-4" />
        {deudores.length} con pago pendiente
      </button>
    );
  }

  const actual = deudores[indiceSeguro];

  return (
    <div className="fixed right-4 top-24 z-40 w-64 overflow-hidden rounded-3xl shadow-2xl">
      {/* Cinta roja de alerta, flotando encima de la foto */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-red-600/90 px-3 py-2 text-white backdrop-blur-sm">
        <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide">
          <AlertTriangle className="h-3.5 w-3.5" />
          {deudores.length} con pago pendiente
        </p>
        <button
          type="button"
          onClick={() => setMinimizado(true)}
          aria-label="Minimizar alerta"
          className="rounded-full p-1 hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Credencial: la foto llena toda la tarjeta */}
      <FichaIdentificacion
        fotoUrl={actual.fotoUrl}
        nombreCompleto={actual.nombreCompleto}
        salon={actual.salon}
        plan={actual.plan}
        proximaFechaPago={actual.proximaFechaPago}
        hoyISO={hoyISO}
        tutores={actual.tutores}
        personasAutorizadas={actual.personasAutorizadas}
        className="relative block aspect-[3/4] w-full bg-black text-left"
      >
        {actual.fotoUrl ? (
          <Image
            src={actual.fotoUrl}
            alt={actual.nombreCompleto}
            fill
            sizes="256px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">
            <Baby className="h-16 w-16" strokeWidth={1.5} />
          </div>
        )}

        {/* Datos flotando sobre la foto, con vidrio opaco */}
        <div className="glass-strong absolute inset-x-0 bottom-0 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-extrabold text-brand-blue-dark">
              {actual.nombreCompleto}
            </p>
            {deudores.length > 1 && (
              <span className="shrink-0 text-[10px] font-bold text-foreground/40">
                {indiceSeguro + 1}/{deudores.length}
              </span>
            )}
          </div>
          <div className="mt-1.5">
            <InsigniaEstatusPago
              proximaFechaPago={actual.proximaFechaPago}
              hoyISO={hoyISO}
            />
          </div>
          <p className="mt-1 text-[10px] text-foreground/50">
            Toca para ver la ficha completa
          </p>
        </div>
      </FichaIdentificacion>

      {/* Flechas de navegación, flotando sobre la foto */}
      {deudores.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-1.5">
          <button
            type="button"
            onClick={() =>
              setIndice((i) => (i - 1 + deudores.length) % deudores.length)
            }
            aria-label="Deudor anterior"
            className="pointer-events-auto rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndice((i) => (i + 1) % deudores.length)}
            aria-label="Siguiente deudor"
            className="pointer-events-auto rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
