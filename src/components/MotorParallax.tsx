"use client";

import { useEffect } from "react";

/** Desplaza un poco los recortes al hacer scroll. No carga librerías. */
export default function MotorParallax() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    const mover = () => {
      frame = 0;
      const alto = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-velocidad]").forEach((el) => {
        const velocidad = Number(el.dataset.velocidad) || 0.2;
        const rect = el.getBoundingClientRect();
        const progreso = (alto - rect.top) / (alto + rect.height);
        const y = (0.5 - progreso) * velocidad * 28;
        el.style.setProperty("--y", `${y.toFixed(2)}px`);
      });
    };

    const pedir = () => {
      if (!frame) frame = window.requestAnimationFrame(mover);
    };

    mover();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
