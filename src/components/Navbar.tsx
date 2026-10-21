"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, PhoneCall, X } from "lucide-react";
import { TELEFONO_DISPLAY, TELEFONO_TEL, TELEFONOS } from "@/lib/site";

const links = [
  { href: "#amigos", label: "Amigos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#horarios", label: "Horarios" },
  { href: "#instalaciones", label: "Instalaciones" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    function alTeclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") setMenuAbierto(false);
    }
    window.addEventListener("keydown", alTeclado);
    return () => window.removeEventListener("keydown", alTeclado);
  }, []);

  return (
    <header className="glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <Link href="/" className="min-w-0 shrink">
          <Image
            src="/images/logo.png"
            alt="Biodiversión, guardería en Cancún"
            width={220}
            height={90}
            priority
            className="h-12 w-auto max-w-[42vw] object-contain object-left sm:h-14 sm:max-w-none"
          />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold text-brand-blue-dark lg:flex" aria-label="Secciones">
          {links.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="transition-colors hover:text-brand-green-dark"
            >
              {enlace.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={TELEFONO_TEL}
            aria-label={`Llámanos al ${TELEFONO_DISPLAY}`}
            className="flex items-center gap-2 rounded-full bg-brand-green px-3 py-2 text-sm font-extrabold text-[#14240a] shadow-sm sm:px-4"
          >
            <PhoneCall className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden lg:inline">{TELEFONO_DISPLAY}</span>
            <span className="lg:hidden">Llámanos</span>
          </a>
          <a
            href={TELEFONOS[1].tel}
            className="hidden rounded-full border-2 border-brand-blue-dark px-3 py-2 text-sm font-extrabold text-brand-blue-dark lg:inline-flex"
          >
            {TELEFONOS[1].display}
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-blue-dark lg:hidden"
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            {menuAbierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {menuAbierto && (
        <nav id="menu-principal" className="border-t border-black/10 px-4 py-2 lg:hidden" aria-label="Secciones">
          <ul>
            {TELEFONOS.map((telefono) => (
              <li key={telefono.tel}>
                <a
                  href={telefono.tel}
                  className="block py-3 text-base font-bold text-brand-blue-dark"
                >
                  Llamar al {telefono.display}
                </a>
              </li>
            ))}
            {links.map((enlace) => (
              <li key={enlace.href}>
                <a
                  href={enlace.href}
                  className="block py-3 text-base font-bold text-brand-blue-dark"
                  onClick={() => setMenuAbierto(false)}
                >
                  {enlace.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
