"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check } from "lucide-react";

/** Genera un QR con el enlace de WhatsApp ("wa.me") que abre el chat con el
 * mensaje ya escrito — la familia solo tiene que darle enviar. Útil para
 * el modo Sandbox de Twilio, donde cada número debe mandar "join <código>"
 * una vez antes de poder recibir recordatorios. */
export default function InvitarWhatsApp({
  numeroSandbox,
}: {
  numeroSandbox: string; // formato E.164 sin espacios, ej. "+14155238886"
}) {
  const [codigo, setCodigo] = useState("");
  const [datosQr, setDatosQr] = useState<{ enlace: string; url: string } | null>(
    null,
  );
  const [copiado, setCopiado] = useState(false);

  const mensaje = codigo.trim() ? `join ${codigo.trim()}` : "";
  const numeroLimpio = numeroSandbox.replace(/[^\d]/g, "");
  const enlace = mensaje
    ? `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`
    : null;
  // Solo se usa el QR si corresponde al enlace actual (evita mostrar uno
  // desactualizado mientras se genera el nuevo, sin actualizar estado de
  // forma síncrona dentro del efecto).
  const qrUrl = datosQr && datosQr.enlace === enlace ? datosQr.url : null;

  useEffect(() => {
    if (!enlace) return;
    let cancelado = false;
    QRCode.toDataURL(enlace, { width: 260, margin: 1 }).then((url) => {
      if (!cancelado) setDatosQr({ enlace, url });
    });
    return () => {
      cancelado = true;
    };
  }, [enlace]);

  function copiarEnlace() {
    if (!enlace) return;
    navigator.clipboard.writeText(enlace);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="glass mt-6 rounded-2xl p-6">
      <h2 className="text-lg font-extrabold text-brand-blue-dark">
        Invitar tutores al WhatsApp (Sandbox)
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Mientras uses el número de prueba de Twilio, cada tutor debe mandar
        &ldquo;join [código]&rdquo; una vez antes de poder recibir
        recordatorios. Escribe aquí tu código del Sandbox (Twilio Console →
        Messaging → Try it out → Send a WhatsApp message) y comparte el QR
        o el enlace — así solo tienen que escanear y darle enviar.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Código del Sandbox
          </label>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="ej. purple-tiger"
            className="mt-1 w-56 rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
        </div>
        {enlace && (
          <button
            type="button"
            onClick={copiarEnlace}
            className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-brand-blue-dark hover:bg-white"
          >
            {copiado ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copiado ? "¡Copiado!" : "Copiar enlace"}
          </button>
        )}
      </div>

      {qrUrl && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl bg-white/70 p-4 sm:w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`Código QR para unirse al WhatsApp de Biodiversión`}
            className="h-56 w-56"
          />
          <p className="max-w-[260px] text-center text-xs text-foreground/60">
            Escanéalo desde el celular de la familia (o compárteles el
            enlace copiado) — se abre WhatsApp con el mensaje listo, solo
            deben darle enviar.
          </p>
        </div>
      )}
    </div>
  );
}
