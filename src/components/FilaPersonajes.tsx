import Image from "next/image";
import { PERSONAJES } from "@/lib/personajes";

export default function FilaPersonajes({
  compacta = false,
  conTexto = true,
}: {
  compacta?: boolean;
  conTexto?: boolean;
}) {
  return (
    <ul
      className={`fila-personajes ${compacta ? "tam-sm" : ""}`}
    >
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
          {conTexto && (
            <div className="mt-3 text-center">
              <h3 className="text-lg font-bold text-brand-blue-dark">
                {personaje.nombre}
              </h3>
              <p className="text-sm font-bold text-brand-green-dark">
                {personaje.edad}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                {personaje.bio}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
