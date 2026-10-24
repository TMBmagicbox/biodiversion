"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftFromLine, Baby, CheckCircle2, LogIn, LogOut, ScanFace, TriangleAlert } from "lucide-react";
import {
  consultarHijosKiosco,
  obtenerRostrosKiosco,
  registrarPasoKiosco,
  type HijoKiosco,
  type TutorKiosco,
} from "@/app/admin/facial-actions";
import {
  cargarFaceApi,
  detenerCamara,
  iniciarCamara,
  leerRostro,
} from "@/lib/face-client";
import { crearConfirmador, mejorCoincidencia } from "@/lib/rostros";

type Fase =
  | { tipo: "cargando" }
  | { tipo: "error"; mensaje: string }
  | { tipo: "vacio" }
  | { tipo: "buscando"; pista: string }
  | { tipo: "reconocido"; tutor: TutorKiosco; hijos: HijoKiosco[]; guardando: boolean }
  | { tipo: "desconocido" }
  | { tipo: "hecho"; ok: boolean; mensaje: string };

const INTERVALO_MS = 350;
const ANCHO_MINIMO = 0.2; // el rostro debe ocupar al menos 20% del ancho: gente cerca de la tableta
const CUADROS_PARA_CONFIRMAR = 3;
const CUADROS_DESCONOCIDO = 6;
const RECARGA_ROSTROS_MS = 5 * 60 * 1000;

export default function Kiosco() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const faseRef = useRef<Fase>({ tipo: "cargando" });
  const rostrosRef = useRef<TutorKiosco[]>([]);
  const desconocidosRef = useRef(0);
  const confirmador = useMemo(() => crearConfirmador(CUADROS_PARA_CONFIRMAR), []);
  const [fase, setFase] = useState<Fase>({ tipo: "cargando" });

  const cambiarFase = useCallback((f: Fase) => {
    faseRef.current = f;
    setFase(f);
  }, []);

  const volverABuscar = useCallback(() => {
    confirmador.reiniciar();
    desconocidosRef.current = 0;
    cambiarFase({ tipo: "buscando", pista: "" });
  }, [confirmador, cambiarFase]);

  // Cámara, modelos y ciclo de reconocimiento.
  useEffect(() => {
    let activo = true;
    let stream: MediaStream | null = null;
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    let recarga: ReturnType<typeof setInterval> | undefined;
    let pantalla: WakeLockSentinel | null = null;

    function pista(texto: string) {
      const f = faseRef.current;
      if (f.tipo === "buscando" && f.pista !== texto) cambiarFase({ tipo: "buscando", pista: texto });
    }

    async function analizar(faceapi: Awaited<ReturnType<typeof cargarFaceApi>>, video: HTMLVideoElement) {
      const lectura = await leerRostro(faceapi, video);
      if (faseRef.current.tipo !== "buscando") return; // cambió mientras se analizaba

      if (lectura.cantidad === 0) {
        confirmador.reiniciar();
        desconocidosRef.current = 0;
        return pista("");
      }
      if (lectura.cantidad > 1) {
        confirmador.reiniciar();
        return pista("Una persona a la vez, por favor");
      }
      if (!lectura.descriptor || lectura.anchoRelativo < ANCHO_MINIMO) {
        confirmador.reiniciar();
        return pista("Acércate un poco más");
      }

      const coincidencia = mejorCoincidencia(lectura.descriptor, rostrosRef.current);
      if (!coincidencia) {
        confirmador.reiniciar();
        desconocidosRef.current += 1;
        if (desconocidosRef.current >= CUADROS_DESCONOCIDO) {
          desconocidosRef.current = 0;
          return cambiarFase({ tipo: "desconocido" });
        }
        return pista("Buscando…");
      }

      desconocidosRef.current = 0;
      const confirmado = confirmador.agregar(coincidencia.tutorId);
      if (!confirmado) return pista("Buscando…");

      confirmador.reiniciar();
      const tutor = rostrosRef.current.find((t) => t.tutorId === confirmado);
      if (!tutor) return;
      const hijos = await consultarHijosKiosco(confirmado);
      if (faseRef.current.tipo !== "buscando") return;
      if (!hijos.ok) return cambiarFase({ tipo: "hecho", ok: false, mensaje: hijos.error });
      if (!hijos.hijos.length) {
        return cambiarFase({ tipo: "hecho", ok: false, mensaje: "No hay niños activos para este tutor. Avisa al personal." });
      }
      cambiarFase({ tipo: "reconocido", tutor, hijos: hijos.hijos, guardando: false });
    }

    async function ciclo(faceapi: Awaited<ReturnType<typeof cargarFaceApi>>) {
      if (!activo) return;
      const video = videoRef.current;
      if (faseRef.current.tipo === "buscando" && video) {
        try {
          await analizar(faceapi, video);
        } catch (e) {
          console.error("kiosco:", e);
        }
      }
      if (activo) temporizador = setTimeout(() => ciclo(faceapi), INTERVALO_MS);
    }

    (async () => {
      try {
        const faceapi = await cargarFaceApi();
        if (!activo || !videoRef.current) return;
        stream = await iniciarCamara(videoRef.current);
        if (!activo) return detenerCamara(stream);

        const r = await obtenerRostrosKiosco();
        if (!r.ok) throw new Error(r.error);
        rostrosRef.current = r.tutores;
        cambiarFase(r.tutores.length ? { tipo: "buscando", pista: "" } : { tipo: "vacio" });

        try {
          pantalla = (await navigator.wakeLock?.request("screen")) ?? null;
        } catch {
          /* no todos los navegadores lo permiten */
        }

        recarga = setInterval(async () => {
          const nuevo = await obtenerRostrosKiosco();
          if (!nuevo.ok) return;
          rostrosRef.current = nuevo.tutores;
          if (faseRef.current.tipo === "vacio" && nuevo.tutores.length) {
            cambiarFase({ tipo: "buscando", pista: "" });
          }
        }, RECARGA_ROSTROS_MS);

        ciclo(faceapi);
      } catch (e) {
        console.error(e);
        if (activo) {
          cambiarFase({
            tipo: "error",
            mensaje:
              "No se pudo abrir la cámara o cargar el reconocimiento. Revisa los permisos de la cámara en el navegador (la página debe abrirse con https).",
          });
        }
      }
    })();

    return () => {
      activo = false;
      clearTimeout(temporizador);
      clearInterval(recarga);
      detenerCamara(stream);
      pantalla?.release().catch(() => {});
    };
  }, [cambiarFase, confirmador]);

  // Regresa a "buscando" después de un rato en cada pantalla.
  useEffect(() => {
    const espera =
      fase.tipo === "reconocido" ? 25000 : fase.tipo === "desconocido" ? 6000 : fase.tipo === "hecho" ? 4500 : 0;
    if (!espera) return;
    const t = setTimeout(volverABuscar, espera);
    return () => clearTimeout(t);
  }, [fase, volverABuscar]);

  async function registrar(hijo: HijoKiosco) {
    const f = faseRef.current;
    if (f.tipo !== "reconocido" || f.guardando) return;
    cambiarFase({ ...f, guardando: true });
    const r = await registrarPasoKiosco(f.tutor.tutorId, hijo.id);
    cambiarFase(
      r.ok
        ? {
            tipo: "hecho",
            ok: true,
            mensaje: `${r.accion === "entrada" ? "Entrada" : "Salida"} registrada · ${r.nino} · ${r.hora}`,
          }
        : { tipo: "hecho", ok: false, mensaje: r.error },
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center overflow-y-auto bg-brand-blue-dark px-4 py-6 text-white">
      <Link
        href="/admin"
        className="absolute left-3 top-3 flex items-center gap-1 text-xs font-bold text-white/40 hover:text-white"
      >
        <ArrowLeftFromLine className="h-3.5 w-3.5" />
        Salir
      </Link>

      <h1 className="mt-2 flex items-center gap-2 text-lg font-black tracking-wide text-white/90">
        <Baby className="h-5 w-5" /> Biodiversión · Entrada y salida
      </h1>

      <div className="relative mt-4 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl bg-black shadow-xl">
        <video ref={videoRef} muted playsInline className="h-full w-full -scale-x-100 object-cover" />
        {fase.tipo === "buscando" && (
          <div className="pointer-events-none absolute inset-6 rounded-[2rem] border-4 border-dashed border-white/40" />
        )}
      </div>

      <div className="mt-6 w-full max-w-md text-center">
        {fase.tipo === "cargando" && <p className="text-lg font-bold">Preparando cámara…</p>}

        {fase.tipo === "error" && (
          <p className="flex items-start gap-2 rounded-2xl bg-red-500/20 p-4 text-left text-sm font-bold">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            {fase.mensaje}
          </p>
        )}

        {fase.tipo === "vacio" && (
          <p className="text-lg font-bold">
            Aún no hay rostros registrados. Registra a un tutor desde su ficha en el panel.
          </p>
        )}

        {fase.tipo === "buscando" && (
          <div>
            <p className="flex items-center justify-center gap-2 text-2xl font-black">
              <ScanFace className="h-7 w-7" /> Mira a la cámara
            </p>
            <p className="mt-2 h-6 text-base font-bold text-white/70">{fase.pista}</p>
          </div>
        )}

        {fase.tipo === "reconocido" && (
          <div>
            <p className="text-3xl font-black">Hola, {fase.tutor.nombre.split(" ")[0]}</p>
            <p className="mt-1 text-sm font-bold text-white/70">¿Por quién vienes?</p>
            <div className="mt-4 space-y-3">
              {fase.hijos.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  disabled={fase.guardando}
                  onClick={() => registrar(h)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-lg font-black shadow disabled:opacity-60 ${
                    h.dentro ? "bg-amber-400 text-black" : "bg-brand-green text-white"
                  }`}
                >
                  <span className="min-w-0 truncate">{h.nombre}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm">
                    {h.dentro ? (
                      <>
                        <LogOut className="h-5 w-5" /> Registrar salida
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" /> Registrar entrada
                      </>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={volverABuscar}
              className="mt-5 text-sm font-bold text-white/60 underline"
            >
              No soy {fase.tutor.nombre.split(" ")[0]}
            </button>
          </div>
        )}

        {fase.tipo === "desconocido" && (
          <p className="rounded-2xl bg-amber-400/20 p-4 text-xl font-black">
            No te reconozco todavía. Por favor avisa al personal.
          </p>
        )}

        {fase.tipo === "hecho" && (
          <p
            className={`flex items-center justify-center gap-2 rounded-2xl p-5 text-xl font-black ${
              fase.ok ? "bg-brand-green" : "bg-red-500/30"
            }`}
          >
            {fase.ok ? <CheckCircle2 className="h-7 w-7 shrink-0" /> : <TriangleAlert className="h-7 w-7 shrink-0" />}
            {fase.mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
