"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/** Miniatura clicable que abre la foto en grande (visualizador de imagen). */
export default function FotoLightbox({
  src,
  alt,
  className,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [abierta, setAbierta] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        aria-label={`Ver foto de ${alt}`}
        className={className}
      >
        {children}
      </button>

      {abierta && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setAbierta(false)}
        >
          <button
            type="button"
            onClick={() => setAbierta(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="90vw"
              className="rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
