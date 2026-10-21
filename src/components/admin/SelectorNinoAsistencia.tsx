"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type OpcionNino = {
  id: string;
  nombre: string;
};

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

/** Mismo recuadro que el select de asistencia, pero se puede escribir
 * para filtrar por nombre. El formulario sigue enviando `nino_id`. */
export default function SelectorNinoAsistencia({
  ninos,
}: {
  ninos: OpcionNino[];
}) {
  const [texto, setTexto] = useState("");
  const [ninoId, setNinoId] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const listaId = useId();

  const coincidencias = useMemo(() => {
    const consulta = normalizar(texto);
    if (!consulta) return ninos;
    return ninos.filter((nino) => normalizar(nino.nombre).includes(consulta));
  }, [ninos, texto]);

  useEffect(() => {
    function clicFuera(evento: MouseEvent) {
      if (!contenedor.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", clicFuera);
    return () => document.removeEventListener("mousedown", clicFuera);
  }, []);

  function idExacto(valor: string) {
    const consulta = normalizar(valor);
    if (!consulta) return "";
    const exactos = ninos.filter((nino) => normalizar(nino.nombre) === consulta);
    return exactos.length === 1 ? exactos[0].id : "";
  }

  function marcarValidez(id: string) {
    campo.current?.setCustomValidity(
      id ? "" : "Selecciona un niño de la lista",
    );
  }

  function alEscribir(valor: string) {
    const id = idExacto(valor);
    setTexto(valor);
    setNinoId(id);
    setAbierto(true);
    setActivo(0);
    marcarValidez(id);
  }

  function elegir(nino: OpcionNino) {
    setNinoId(nino.id);
    setTexto(nino.nombre);
    setAbierto(false);
    marcarValidez(nino.id);
    campo.current?.focus();
  }

  return (
    <div ref={contenedor} className="relative">
      <label
        htmlFor={`${listaId}-input`}
        className="text-sm font-bold text-brand-blue-dark"
      >
        Niño
      </label>
      <input type="hidden" name="nino_id" value={ninoId} />
      <input
        ref={campo}
        id={`${listaId}-input`}
        role="combobox"
        aria-expanded={abierto}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={
          abierto && coincidencias[activo]
            ? `${listaId}-opcion-${coincidencias[activo].id}`
            : undefined
        }
        required
        value={texto}
        placeholder="Selecciona…"
        autoComplete="off"
        spellCheck={false}
        className="mt-1 w-56 rounded-lg border border-black/10 px-3 py-2"
        onChange={(evento) => alEscribir(evento.target.value)}
        onFocus={() => setAbierto(true)}
        onKeyDown={(evento) => {
          if (evento.key === "ArrowDown") {
            evento.preventDefault();
            setAbierto(true);
            setActivo((indice) =>
              Math.min(indice + 1, Math.max(coincidencias.length - 1, 0)),
            );
          } else if (evento.key === "ArrowUp") {
            evento.preventDefault();
            setAbierto(true);
            setActivo((indice) => Math.max(indice - 1, 0));
          } else if (evento.key === "Enter" && abierto && coincidencias[activo]) {
            evento.preventDefault();
            elegir(coincidencias[activo]);
          } else if (evento.key === "Escape") {
            setAbierto(false);
          }
        }}
      />
      {abierto && (
        <ul
          id={listaId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-56 overflow-auto rounded-lg border border-black/10 bg-white py-1 shadow-lg"
        >
          {coincidencias.length === 0 ? (
            <li className="px-3 py-2 text-sm text-foreground/50">
              Sin coincidencias
            </li>
          ) : (
            coincidencias.map((nino, indice) => (
              <li
                key={nino.id}
                id={`${listaId}-opcion-${nino.id}`}
                role="option"
                aria-selected={nino.id === ninoId}
              >
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left text-sm ${
                    indice === activo ? "bg-brand-blue-light" : "hover:bg-brand-blue-light"
                  }`}
                  onMouseEnter={() => setActivo(indice)}
                  onMouseDown={(evento) => evento.preventDefault()}
                  onClick={() => elegir(nino)}
                >
                  {nino.nombre}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
