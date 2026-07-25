"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Baby, Phone } from "lucide-react";

type Persona = {
  nombre: string;
  parentesco?: string | null;
  telefono?: string | null;
};

function insigniaPlan(plan: { nombre: string; tipo: string } | null) {
  if (!plan) {
    return (
      <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-bold text-foreground/50">
        Sin plan asignado
      </span>
    );
  }
  const esPorHoras = plan.tipo === "tarjeta_horas";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        esPorHoras
          ? "bg-amber-100 text-amber-800"
          : "bg-brand-blue/10 text-brand-blue-dark"
      }`}
    >
      {esPorHoras
        ? `${plan.nombre} · por horas`
        : `${plan.nombre} · tiempo completo`}
    </span>
  );
}

/** Ficha rápida para identificar a un niño/a al momento de la salida: foto
 * a toda la altura de la pantalla (30% del ancho) y, junto a ella, sus
 * datos, plan y quién está autorizado a recogerlo. */
export default function FichaIdentificacion({
  fotoUrl,
  nombreCompleto,
  salon,
  plan,
  tutores,
  personasAutorizadas,
  className,
  children,
}: {
  fotoUrl: string | null;
  nombreCompleto: string;
  salon?: string | null;
  plan?: { nombre: string; tipo: string } | null;
  tutores: Persona[];
  personasAutorizadas?: Persona[];
  className?: string;
  children: React.ReactNode;
}) {
  const [abierta, setAbierta] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        aria-label={`Ver ficha de ${nombreCompleto}`}
        className={className}
      >
        {children}
      </button>

      {abierta && (
        <div
          className="fixed inset-0 z-[100] bg-black/80"
          onClick={() => setAbierta(false)}
        >
          <button
            type="button"
            onClick={() => setAbierta(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="mx-auto flex h-full w-full max-w-5xl flex-col sm:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 w-full shrink-0 bg-black sm:h-full sm:w-[38%]">
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={nombreCompleto}
                  fill
                  sizes="(min-width: 640px) 38vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/40">
                  <Baby className="h-16 w-16" strokeWidth={1.5} />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-black text-brand-blue-dark">
                {nombreCompleto}
              </h2>
              {salon && (
                <p className="mt-1 text-sm text-foreground/60">
                  Salón: {salon}
                </p>
              )}
              <div className="mt-3">{insigniaPlan(plan ?? null)}</div>

              <h3 className="mt-6 text-xs font-extrabold uppercase tracking-wide text-foreground/50">
                Tutor(es)
              </h3>
              <div className="mt-2 space-y-2">
                {tutores.length ? (
                  tutores.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-brand-blue/5 p-3"
                    >
                      <p className="font-bold text-brand-blue-dark">
                        {t.nombre}
                        {t.parentesco ? ` · ${t.parentesco}` : ""}
                      </p>
                      {t.telefono && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground/60">
                          <Phone className="h-3.5 w-3.5" />
                          {t.telefono}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/40">
                    Sin tutor registrado todavía.
                  </p>
                )}
              </div>

              {(personasAutorizadas?.length ?? 0) > 0 && (
                <>
                  <h3 className="mt-6 text-xs font-extrabold uppercase tracking-wide text-foreground/50">
                    Personas autorizadas a recoger
                  </h3>
                  <div className="mt-2 space-y-2">
                    {personasAutorizadas!.map((p, i) => (
                      <div key={i} className="rounded-xl bg-amber-50 p-3">
                        <p className="font-bold text-amber-900">
                          {p.nombre}
                          {p.parentesco ? ` · ${p.parentesco}` : ""}
                        </p>
                        {p.telefono && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-amber-800/70">
                            <Phone className="h-3.5 w-3.5" />
                            {p.telefono}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
