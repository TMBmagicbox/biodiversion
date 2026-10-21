import Link from "next/link";
import { TELEFONOS, WHATSAPP_URL } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-extrabold text-brand-blue-dark">404</p>
      <h1 className="mt-2 text-3xl font-black text-brand-blue-dark">
        No encontramos esta página
      </h1>
      <p className="mt-3 text-foreground/80">
        El enlace no existe o cambió. Puedes volver al inicio, llamar al{" "}
        {TELEFONOS.map((telefono) => telefono.display).join(" o al ")} o
        escribirnos por WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-green px-5 py-3 font-extrabold text-[#14240a]"
        >
          Ir al inicio
        </Link>
        {TELEFONOS.map((telefono) => (
          <a
            key={telefono.tel}
            href={telefono.tel}
            className="rounded-full border-2 border-brand-blue-dark px-5 py-3 font-extrabold text-brand-blue-dark"
          >
            Llamar al {telefono.display}
          </a>
        ))}
        <a
          href={WHATSAPP_URL}
          className="rounded-full bg-[#075E54] px-5 py-3 font-extrabold text-white"
        >
          WhatsApp
        </a>
      </div>
    </main>
  );
}
