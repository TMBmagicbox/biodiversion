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

/** Alerta flotante en la esquina derecha con un carrusel de niños con pago
 * por vencer o vencido. Se queda ahí (no se cierra sola) mientras haya
 * deudores — cada quien sale de la lista solo cuando su estatus cambia a
 * "al día" (es decir, cuando se le registra el pago). */
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
    <div className="fixed right-4 top-24 z-40 w-72 overflow-hidden rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between bg-red-600 px-4 py-2.5 text-white">
        <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide">
          <AlertTriangle className="h-4 w-4" />
          {deudores.length} con pago pendiente
        </p>
        <button
          type="button"
          onClick={() => setMinimizado(true)}
          aria-label="Minimizar alerta"
          className="rounded-full p-1 hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <FichaIdentificacion
        fotoUrl={actual.fotoUrl}
        nombreCompleto={actual.nombreCompleto}
        salon={actual.salon}
        plan={actual.plan}
        proximaFechaPago={actual.proximaFechaPago}
        hoyISO={hoyISO}
        tutores={actual.tutores}
        personasAutorizadas={actual.personasAutorizadas}
        className="glass-strong block w-full text-left"
      >
        <div className="relative h-32 w-full bg-black">
          {actual.fotoUrl ? (
            <Image
              src={actual.fotoUrl}
              alt={actual.nombreCompleto}
              fill
              sizes="288px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">
              <Baby className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="space-y-1.5 p-3">
          <p className="truncate font-extrabold text-brand-blue-dark">
            {actual.nombreCompleto}
          </p>
          <InsigniaEstatusPago
            proximaFechaPago={actual.proximaFechaPago}
            hoyISO={hoyISO}
          />
          <p className="text-[11px] text-foreground/50">
            Toca para ver la ficha completa
          </p>
        </div>
      </FichaIdentificacion>

      {deudores.length > 1 && (
        <div className="flex items-center justify-between bg-white/80 px-3 py-2">
          <button
            type="button"
            onClick={() =>
              setIndice((i) => (i - 1 + deudores.length) % deudores.length)
            }
            aria-label="Deudor anterior"
            className="rounded-full p-1.5 text-brand-blue-dark hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-bold text-foreground/50">
            {indiceSeguro + 1} / {deudores.length}
          </p>
          <button
            type="button"
            onClick={() => setIndice((i) => (i + 1) % deudores.length)}
            aria-label="Siguiente deudor"
            className="rounded-full p-1.5 text-brand-blue-dark hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
