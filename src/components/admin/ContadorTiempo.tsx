"use client";

import { useEffect, useState } from "react";

function formatear(segundos: number) {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(seg)}`;
}

/** Cronómetro en vivo que cuenta el tiempo transcurrido desde la hora de
 * entrada de un niño que aún no tiene hora de salida registrada. */
export default function ContadorTiempo({
  horaEntradaISO,
}: {
  horaEntradaISO: string;
}) {
  const inicio = new Date(horaEntradaISO).getTime();
  const [segundos, setSegundos] = useState(() => (Date.now() - inicio) / 1000);

  useEffect(() => {
    const id = setInterval(() => {
      setSegundos((Date.now() - inicio) / 1000);
    }, 1000);
    return () => clearInterval(id);
  }, [inicio]);

  return (
    <span className="font-mono font-bold text-brand-green-dark">
      {formatear(segundos)}
    </span>
  );
}
