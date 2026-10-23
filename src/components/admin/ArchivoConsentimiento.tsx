"use client";

import { useState } from "react";
import { MAX_BYTES_CONSENTIMIENTO } from "@/lib/consentimiento";

const LADO_MAXIMO = 2000;

/** Reduce una foto de escaneo para que quepa en el límite de subida, sin
 * perder legibilidad (JPEG, lado mayor 2000 px). */
async function reducirImagen(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const calidad of [0.85, 0.7, 0.55]) {
    const blob = await new Promise<Blob | null>((ok) =>
      canvas.toBlob(ok, "image/jpeg", calidad),
    );
    if (blob && blob.size <= MAX_BYTES_CONSENTIMIENTO) {
      return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
        type: "image/jpeg",
      });
    }
  }
  return file;
}

/** Selector de la copia firmada (foto/escaneo o PDF). Las imágenes se
 * reducen automáticamente antes de subirse. */
export default function ArchivoConsentimiento({ name }: { name: string }) {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    setMensaje(null);
    if (!file) return;

    if (file.type === "application/pdf") {
      if (file.size > MAX_BYTES_CONSENTIMIENTO) {
        input.value = "";
        setMensaje("El PDF pesa más de 4 MB. Escanéalo con menos resolución o súbelo como foto.");
      }
      return;
    }
    if (!file.type.startsWith("image/")) {
      input.value = "";
      setMensaje("Elige una foto o un PDF.");
      return;
    }

    setProcesando(true);
    try {
      const reducido = await reducirImagen(file);
      if (reducido.size > MAX_BYTES_CONSENTIMIENTO) {
        input.value = "";
        setMensaje("La imagen es demasiado pesada. Toma la foto de nuevo.");
        return;
      }
      const dt = new DataTransfer();
      dt.items.add(reducido);
      input.files = dt.files;
      setMensaje(`Listo: ${reducido.name} (${Math.round(reducido.size / 1024)} KB)`);
    } catch {
      setMensaje("No se pudo procesar la imagen. Prueba con otra foto o un PDF.");
      input.value = "";
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        name={name}
        accept="image/*,application/pdf"
        required
        onChange={alElegir}
        className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />
      {procesando && <p className="mt-1 text-xs text-foreground/60">Procesando imagen…</p>}
      {mensaje && <p className="mt-1 text-xs text-foreground/70">{mensaje}</p>}
    </div>
  );
}
