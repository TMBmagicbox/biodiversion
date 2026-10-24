"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check } from "lucide-react";
import { guardarRostro } from "@/app/admin/facial-actions";
import {
  cargarFaceApi,
  detenerCamara,
  iniciarCamara,
  leerRostro,
} from "@/lib/face-client";
import { distanciaEuclidiana, UMBRAL_DISTANCIA } from "@/lib/rostros";

const PASOS = [
  "Mira de frente a la cámara",
  "Gira la cara un poco a tu izquierda",
  "Gira la cara un poco a tu derecha",
];
const ANCHO_MINIMO = 0.25;

type Estado = "cargando" | "listo" | "error";

/** Captura 3 muestras del rostro del tutor y guarda solo su huella numérica. */
export default function RegistroRostro({
  tutorId,
  nombre,
}: {
  tutorId: string;
  nombre: string;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [estado, setEstado] = useState<Estado>("cargando");
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [muestras, setMuestras] = useState<number[][]>([]);
  const [capturando, setCapturando] = useState(false);
  const [guardando, iniciarGuardado] = useTransition();

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        await cargarFaceApi();
        if (cancelado || !videoRef.current) return;
        streamRef.current = await iniciarCamara(videoRef.current);
        if (!cancelado) setEstado("listo");
      } catch (e) {
        console.error(e);
        if (!cancelado) {
          setEstado("error");
          setError(
            "No se pudo abrir la cámara o cargar el reconocimiento. Revisa los permisos del navegador (la página debe abrirse con https).",
          );
        }
      }
    })();
    return () => {
      cancelado = true;
      detenerCamara(streamRef.current);
    };
  }, []);

  async function capturar() {
    if (!videoRef.current || capturando) return;
    setCapturando(true);
    setAviso(null);
    try {
      const faceapi = await cargarFaceApi();
      const lectura = await leerRostro(faceapi, videoRef.current);
      if (lectura.cantidad === 0) return setAviso("No se ve ningún rostro. Acércate y busca buena luz.");
      if (lectura.cantidad > 1) return setAviso("Se ven varias personas. Debe salir solo el tutor.");
      if (!lectura.descriptor) return setAviso("No se pudo leer el rostro. Intenta de nuevo.");
      if (lectura.anchoRelativo < ANCHO_MINIMO) return setAviso("Acércate un poco más a la cámara.");
      if (
        muestras.length &&
        distanciaEuclidiana(lectura.descriptor, muestras[0]) > UMBRAL_DISTANCIA
      ) {
        return setAviso("Esta captura no coincide con la primera. Debe ser la misma persona.");
      }
      setMuestras((m) => [...m, lectura.descriptor!]);
    } finally {
      setCapturando(false);
    }
  }

  function guardar() {
    setError(null);
    iniciarGuardado(async () => {
      const r = await guardarRostro(tutorId, muestras);
      if (!r.ok) return setError(r.error);
      detenerCamara(streamRef.current);
      router.push(`/admin/familias/${tutorId}/consentimiento?ok=rostro`);
    });
  }

  const completo = muestras.length >= PASOS.length;

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-foreground/70">
        Registrando el rostro de <strong>{nombre}</strong>. Solo se guarda una
        huella numérica, no fotos.
      </p>

      <div className="relative mx-auto mt-4 aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          muted
          playsInline
          className="h-full w-full -scale-x-100 object-cover"
        />
        {estado === "cargando" && (
          <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            Cargando cámara y reconocimiento…
          </p>
        )}
      </div>

      <ol className="mx-auto mt-4 max-w-md space-y-1.5">
        {PASOS.map((paso, i) => (
          <li
            key={paso}
            className={`flex items-center gap-2 text-sm font-bold ${
              i < muestras.length
                ? "text-brand-green-dark"
                : i === muestras.length
                  ? "text-brand-blue-dark"
                  : "text-foreground/40"
            }`}
          >
            {i < muestras.length ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="inline-block w-4 text-center">{i + 1}</span>
            )}
            {paso}
          </li>
        ))}
      </ol>

      {aviso && <p className="mx-auto mt-3 max-w-md text-sm font-bold text-amber-700">{aviso}</p>}
      {error && <p className="mx-auto mt-3 max-w-md text-sm font-bold text-red-600">{error}</p>}

      <div className="mx-auto mt-4 flex max-w-md gap-2">
        {!completo ? (
          <button
            type="button"
            onClick={capturar}
            disabled={estado !== "listo" || capturando}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
            {capturando ? "Capturando…" : `Capturar (${muestras.length}/${PASOS.length})`}
          </button>
        ) : (
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="flex-1 rounded-full bg-brand-green px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
          >
            {guardando ? "Guardando…" : "Guardar rostro"}
          </button>
        )}
        {muestras.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMuestras([]);
              setAviso(null);
            }}
            className="rounded-full bg-black/5 px-4 py-3 text-sm font-bold text-foreground/70"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}
