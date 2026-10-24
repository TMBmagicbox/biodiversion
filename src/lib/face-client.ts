"use client";

/** Utilidades de cámara y reconocimiento facial que corren en el navegador
 * de la tableta (nada de video ni fotos sale del dispositivo; solo viaja la
 * huella numérica del rostro). */

import type * as FaceApi from "@vladmandic/face-api";

type FaceApiModulo = typeof FaceApi;

/** Los modelos se sirven desde /public/models/face. */
const RUTA_MODELOS = "/models/face";

let cargando: Promise<FaceApiModulo> | null = null;

/** Carga la librería y los modelos (una sola vez). Los modelos viven en /public/models/face. */
export function cargarFaceApi(): Promise<FaceApiModulo> {
  if (!cargando) {
    cargando = (async () => {
      const faceapi = await import("@vladmandic/face-api");
      // WebGL (rápido) y, si el dispositivo no lo permite, CPU (más lento pero
      // funciona). Se evita 'wasm' porque exige servir archivos adicionales.
      const tf = faceapi.tf as unknown as {
        setBackend(nombre: string): Promise<boolean>;
        ready(): Promise<void>;
      };
      if (!(await tf.setBackend("webgl"))) {
        await tf.setBackend("cpu");
      }
      await tf.ready();
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(RUTA_MODELOS),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(RUTA_MODELOS),
        faceapi.nets.faceRecognitionNet.loadFromUri(RUTA_MODELOS),
      ]);
      return faceapi;
    })().catch((e) => {
      cargando = null;
      throw e;
    });
  }
  return cargando;
}

export async function iniciarCamara(video: HTMLVideoElement): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
    audio: false,
  });
  video.srcObject = stream;
  await video.play();
  return stream;
}

export function detenerCamara(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

export type LecturaRostro = {
  /** Cuántos rostros se ven en el cuadro. */
  cantidad: number;
  /** Huella del rostro, solo si hay exactamente uno. */
  descriptor: number[] | null;
  /** Ancho del rostro respecto al ancho del video (0 a 1): qué tan cerca está. */
  anchoRelativo: number;
};

export async function leerRostro(
  faceapi: FaceApiModulo,
  video: HTMLVideoElement,
): Promise<LecturaRostro> {
  const resultados = await faceapi
    .detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }),
    )
    .withFaceLandmarks(true)
    .withFaceDescriptors();

  if (resultados.length !== 1) {
    return { cantidad: resultados.length, descriptor: null, anchoRelativo: 0 };
  }
  const r = resultados[0];
  return {
    cantidad: 1,
    descriptor: Array.from(r.descriptor),
    anchoRelativo: video.videoWidth ? r.detection.box.width / video.videoWidth : 0,
  };
}
