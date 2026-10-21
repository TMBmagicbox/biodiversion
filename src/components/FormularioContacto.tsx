"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  enviarMensajeContacto,
  type EstadoContacto,
} from "@/app/(site)/actions";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { TELEFONOS, WHATSAPP_URL } from "@/lib/site";

const INICIAL: EstadoContacto = { estado: "idle", mensaje: "" };

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-green px-6 py-3 font-extrabold text-[#14240a] disabled:cursor-wait disabled:opacity-70 sm:flex-1"
    >
      {pending ? "Enviando…" : "Enviar mensaje"}
    </button>
  );
}

export default function FormularioContacto() {
  const [estado, accion] = useActionState(enviarMensajeContacto, INICIAL);

  if (estado.estado === "ok") {
    return (
      <div
        role="status"
        className="glass-strong mt-6 rounded-2xl p-6 text-center"
      >
        <p className="text-lg font-extrabold text-brand-blue-dark">
          {estado.mensaje}
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#075E54] px-5 py-3 font-extrabold text-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Seguir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={accion} className="glass-strong relative mt-6 space-y-4 rounded-2xl p-6">
      {estado.estado === "error" && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800"
        >
          {estado.mensaje}
        </p>
      )}

      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Empresa
          <input name="empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="contacto-nombre" className="text-sm font-bold text-brand-blue-dark">
          Nombre
        </label>
        <input
          id="contacto-nombre"
          type="text"
          name="nombre"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-[#5c6f68] bg-white px-3 py-2"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="contacto-dato" className="text-sm font-bold text-brand-blue-dark">
          Teléfono o correo
        </label>
        <input
          id="contacto-dato"
          type="text"
          name="contacto"
          required
          minLength={5}
          maxLength={120}
          autoComplete="tel"
          className="mt-1 w-full rounded-lg border border-[#5c6f68] bg-white px-3 py-2"
          placeholder="¿Cómo te contactamos?"
        />
      </div>
      <div>
        <label htmlFor="contacto-mensaje" className="text-sm font-bold text-brand-blue-dark">
          Mensaje
        </label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          rows={4}
          required
          minLength={8}
          maxLength={2000}
          className="mt-1 w-full rounded-lg border border-[#5c6f68] bg-white px-3 py-2"
          placeholder="Cuéntanos sobre tu hijo o tu hija y qué información necesitas"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <BotonEnviar />
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#075E54] px-6 py-3 font-extrabold text-white sm:flex-1"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
      <p className="text-center text-sm text-foreground/80">
        También puedes llamar al{" "}
        {TELEFONOS.map((telefono, indice) => (
          <span key={telefono.tel}>
            {indice > 0 && " o al "}
            <a href={telefono.tel} className="font-extrabold text-brand-blue-dark underline">
              {telefono.display}
            </a>
          </span>
        ))}
        .
      </p>
    </form>
  );
}
