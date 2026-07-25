"use client";

import { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";

/** Campo de foto con dos formas de capturarla: elegir un archivo, o tomarla
 * en el momento con la cámara del dispositivo (laptop o celular). Siempre
 * muestra una vista previa de la foto elegida/capturada. */
export default function FotoInput({
  name,
  label,
  fotoActualUrl,
}: {
  name: string;
  label: string;
  fotoActualUrl?: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [camaraAbierta, setCamaraAbierta] = useState(false);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);

  function onArchivoSeleccionado(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function abrirCamara() {
    setErrorCamara(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCamaraAbierta(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setErrorCamara(
        "No se pudo acceder a la cámara (revisa los permisos del navegador). Puedes subir una foto en su lugar.",
      );
    }
  }

  function cerrarCamara() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamaraAbierta(false);
  }

  function capturarFoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob || !fileInputRef.current) return;
        const file = new File([blob], `foto-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        setPreview(URL.createObjectURL(file));
        cerrarCamara();
      },
      "image/jpeg",
      0.9,
    );
  }

  const mostrar = preview ?? fotoActualUrl ?? null;

  return (
    <div>
      <label className="text-sm font-bold text-brand-blue-dark">
        {label}
      </label>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white/70">
          {mostrar ? (
            // Vista previa dinámica (archivo local o foto ya guardada) — no usamos next/image aquí porque puede ser un blob: URL.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mostrar}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-1 text-center text-[10px] text-foreground/40">
              Sin foto
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold text-brand-blue-dark hover:bg-white"
            >
              <Upload className="h-3.5 w-3.5" />
              Subir archivo
            </button>
            <button
              type="button"
              onClick={abrirCamara}
              className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-blue-dark"
            >
              <Camera className="h-3.5 w-3.5" />
              Tomar foto
            </button>
          </div>
          {errorCamara && (
            <p className="text-xs text-red-600">{errorCamara}</p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        capture="user"
        onChange={onArchivoSeleccionado}
        className="hidden"
      />

      {camaraAbierta && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="max-h-[70vh] w-full max-w-md rounded-2xl bg-black object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={capturarFoto}
              className="flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-extrabold text-white"
            >
              <Camera className="h-4 w-4" />
              Capturar
            </button>
            <button
              type="button"
              onClick={cerrarCamara}
              className="flex items-center gap-2 rounded-full border-2 border-white/50 px-6 py-3 font-extrabold text-white"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
