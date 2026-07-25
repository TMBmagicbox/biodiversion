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

  // Parallax: mueve la foto de la derecha más lento que el scroll de la página
  useEffect(() => {
    function onScroll() {
      if (!seccionRef.current) return;
      const rect = seccionRef.current.getBoundingClientRect();
      setOffset(rect.top * 0.12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const slide = data[activo];

  return (
    <section
      ref={seccionRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green-dark"
    >
      {/* Contenido: texto a la izquierda, foto a la derecha */}
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Columna de texto */}
        <div className="order-2 lg:order-1">
          {slide.logo_url && (
            <Image
              src={slide.logo_url}
              alt="Logo"
              width={140}
              height={60}
              className="mb-6 h-12 w-auto drop-shadow-lg"
            />
          )}
          <p className="inline-block w-fit rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-white backdrop-blur">
            Guardería en Cancún · SM 50
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            {slide.titulo}
          </h1>
          {slide.descripcion && (
            <p className="mt-5 max-w-xl text-lg text-white/90">
              {slide.descripcion}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={slide.url_boton || "#contacto"}
              className="rounded-full bg-brand-green px-6 py-3 font-extrabold text-white shadow-md transition-transform hover:scale-105"
            >
              {slide.texto_boton || "Agenda una visita"}
            </a>
            <a
              href="#servicios"
              className="rounded-full border-2 border-white/70 px-6 py-3 font-extrabold text-white backdrop-blur transition-transform hover:scale-105"
            >
              Ver servicios
            </a>
          </div>

          {/* Puntos de navegación entre slides */}
          {data.length > 1 && (
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                aria-label="Slide anterior"
                onClick={() =>
                  setActivo((i) => (i - 1 + data.length) % data.length)
                }
                className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
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
              <button
                type="button"
                aria-label="Siguiente slide"
                onClick={() => setActivo((i) => (i + 1) % data.length)}
                className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Columna de la foto: contenida, sin distorsión, del lado derecho */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl sm:aspect-[3/4]">
            {data.map((s, i) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  i === activo ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={i !== activo}
              >
                {s.imagen_fondo_url ? (
                  <div
                    className="absolute -inset-y-6 inset-x-0 will-change-transform"
                    style={{ transform: `translateY(${offset}px)` }}
                  >
                    <Image
                      src={s.imagen_fondo_url}
                      alt=""
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 480px, 90vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10">
                    <Baby
                      className="h-28 w-28 text-white/25 sm:h-36 sm:w-36"
                      strokeWidth={1}
                    />
                    <span className="sr-only">Espacio para foto de un niño</span>
                  </div>
                )}
              </div>
            ))}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
