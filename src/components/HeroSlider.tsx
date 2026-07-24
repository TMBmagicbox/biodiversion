"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Baby } from "lucide-react";

export type HeroSlide = {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagen_fondo_url: string | null;
  logo_url: string | null;
  texto_boton: string | null;
  url_boton: string | null;
};

const SLIDE_POR_DEFECTO: HeroSlide = {
  id: "default",
  titulo:
    "Guardería y estancia infantil en Cancún: un lugar seguro para que tu hijo crezca, aprenda y se divierta",
  descripcion:
    "Atendemos bebés desde 45 días de nacidos hasta niños de 4 años, con horarios flexibles, alimentación cuidada y un enfoque educativo conectado con la naturaleza.",
  imagen_fondo_url: null,
  logo_url: null,
  texto_boton: "Agenda una visita",
  url_boton: "#contacto",
};

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const data = slides.length ? slides : [SLIDE_POR_DEFECTO];
  const [activo, setActivo] = useState(0);
  const [offset, setOffset] = useState(0);
  const seccionRef = useRef<HTMLElement>(null);

  // Autoplay
  useEffect(() => {
    if (data.length < 2) return;
    const t = setInterval(() => setActivo((i) => (i + 1) % data.length), 6500);
    return () => clearInterval(t);
  }, [data.length]);

  // Parallax: mueve el fondo más lento que el scroll de la página
  useEffect(() => {
    function onScroll() {
      if (!seccionRef.current) return;
      const rect = seccionRef.current.getBoundingClientRect();
      setOffset(rect.top * 0.35);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={seccionRef}
      className="relative min-h-[85vh] w-full overflow-hidden bg-brand-blue-dark"
    >
      {data.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === activo ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== activo}
        >
          {/* Fondo con efecto parallax */}
          <div
            className="absolute -inset-y-16 inset-x-0 will-change-transform"
            style={{ transform: `translateY(${offset}px)` }}
          >
            {slide.imagen_fondo_url ? (
              <Image
                src={slide.imagen_fondo_url}
                alt=""
                fill
                priority={i === 0}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green-dark">
                <Baby
                  className="h-40 w-40 text-white/15 sm:h-56 sm:w-56"
                  strokeWidth={1}
                />
                <span className="sr-only">Espacio para foto de un niño</span>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/80 via-brand-blue-dark/40 to-brand-blue-dark/20" />
        </div>
      ))}

      {/* Contenido */}
      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
        {data[activo].logo_url && (
          <Image
            src={data[activo].logo_url}
            alt="Logo"
            width={140}
            height={60}
            className="mb-6 h-12 w-auto drop-shadow-lg"
          />
        )}
        <p className="inline-block w-fit rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-white backdrop-blur">
          Guardería en Cancún · SM 50
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
          {data[activo].titulo}
        </h1>
        {data[activo].descripcion && (
          <p className="mt-5 max-w-xl text-lg text-white/90">
            {data[activo].descripcion}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={data[activo].url_boton || "#contacto"}
            className="rounded-full bg-brand-green px-6 py-3 font-extrabold text-white shadow-md transition-transform hover:scale-105"
          >
            {data[activo].texto_boton || "Agenda una visita"}
          </a>
          <a
            href="#servicios"
            className="rounded-full border-2 border-white/70 px-6 py-3 font-extrabold text-white backdrop-blur transition-transform hover:scale-105"
          >
            Ver servicios
          </a>
        </div>
      </div>

      {/* Controles */}
      {data.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => setActivo((i) => (i - 1 + data.length) % data.length)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Siguiente slide"
            onClick={() => setActivo((i) => (i + 1) % data.length)}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {data.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => setActivo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activo ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
