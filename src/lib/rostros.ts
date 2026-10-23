/**
 * Lógica de coincidencia de rostros (sin dependencias, probable en Node).
 *
 * Un "descriptor" es la huella numérica de 128 valores que produce face-api.
 * Cada tutor puede tener varios descriptores (varias capturas); la distancia
 * a un tutor es la MENOR distancia a cualquiera de los suyos.
 */

export const TAM_DESCRIPTOR = 128;

/** Distancia euclidiana máxima para aceptar una coincidencia. 0.6 es el
 * valor por defecto de face-api; usamos 0.5 para reducir falsos positivos
 * porque aquí identificar mal a alguien es más grave que pedirle reintentar. */
export const UMBRAL_DISTANCIA = 0.5;

/** Diferencia mínima entre el mejor candidato y el segundo mejor (de otra
 * persona). Si dos tutores se parecen demasiado, no se decide solo. */
export const MARGEN_MINIMO = 0.08;

export type Candidato = {
  tutorId: string;
  descriptores: number[][];
};

export type Coincidencia = {
  tutorId: string;
  distancia: number;
};

export function distanciaEuclidiana(a: ArrayLike<number>, b: ArrayLike<number>) {
  if (a.length !== b.length) return Infinity;
  let suma = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    suma += d * d;
  }
  return Math.sqrt(suma);
}

/** Valida que algo recibido del navegador sea un descriptor utilizable. */
export function esDescriptorValido(valor: unknown): valor is number[] {
  return (
    Array.isArray(valor) &&
    valor.length === TAM_DESCRIPTOR &&
    valor.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

/** Mejor coincidencia entre los candidatos, o null si no hay una
 * suficientemente clara (por umbral o por margen contra el segundo). */
export function mejorCoincidencia(
  descriptor: ArrayLike<number>,
  candidatos: Candidato[],
  umbral = UMBRAL_DISTANCIA,
  margen = MARGEN_MINIMO,
): Coincidencia | null {
  const distancias: Coincidencia[] = [];
  for (const c of candidatos) {
    let mejor = Infinity;
    for (const d of c.descriptores) {
      const dist = distanciaEuclidiana(descriptor, d);
      if (dist < mejor) mejor = dist;
    }
    if (Number.isFinite(mejor)) distancias.push({ tutorId: c.tutorId, distancia: mejor });
  }
  distancias.sort((x, y) => x.distancia - y.distancia);

  const primero = distancias[0];
  if (!primero || primero.distancia > umbral) return null;

  const segundo = distancias[1];
  if (segundo && segundo.distancia - primero.distancia < margen) return null;

  return primero;
}

/** Confirma una identificación solo cuando la MISMA persona sale en varios
 * cuadros seguidos (evita decisiones por un cuadro borroso o un parpadeo). */
export function crearConfirmador(cuadrosNecesarios = 3) {
  let actual: string | null = null;
  let seguidos = 0;
  return {
    /** Pasa el resultado de cada cuadro (null si no hubo rostro/coincidencia).
     * Devuelve el tutorId cuando ya está confirmado. */
    agregar(tutorId: string | null): string | null {
      if (!tutorId) {
        actual = null;
        seguidos = 0;
        return null;
      }
      if (tutorId === actual) seguidos += 1;
      else {
        actual = tutorId;
        seguidos = 1;
      }
      return seguidos >= cuadrosNecesarios ? tutorId : null;
    },
    reiniciar() {
      actual = null;
      seguidos = 0;
    },
  };
}
