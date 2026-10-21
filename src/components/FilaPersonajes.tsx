import Image from "next/image";
import { PERSONAJES } from "@/lib/personajes";

export default function FilaPersonajes({
  compacta = false,
  conTexto = true,
}: {
  compacta?: boolean;
  conTexto?: boolean;
}) {
  const fila = (
    <ul className={`fila-personajes ${compacta ? "tam-sm" : ""}`}>
      {PERSONAJES.map((personaje, indice) => (
        <li key={personaje.id}>
          <Image
            src={personaje.src}
            alt={personaje.alt}
            width={personaje.width}
            height={personaje.height}
            className={`${personaje.clase} flotar object-contain object-bottom ${
              indice === 1 ? "flotar-tarde" : ""
            } ${indice === 2 ? "flotar-mas" : ""}`}
          />
        </li>
      ))}
    </ul>
  );

  if (!conTexto) return fila;

  return (
    <div>
      {fila}
      <ul className="mt-4 grid list-none grid-cols-3 gap-3 p-0">
        {PERSONAJES.map((personaje) => (
          <li key={personaje.id} className="text-center">
            <h3 className="text-lg font-bold text-brand-blue-dark">
              {personaje.nombre}
            </h3>
            <p className="text-sm font-bold text-brand-green-dark">
              {personaje.edad}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
              {personaje.bio}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
