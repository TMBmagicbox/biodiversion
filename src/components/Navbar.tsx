import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#horarios", label: "Horarios" },
  { href: "#instalaciones", label: "Instalaciones" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Biodiversión, guardería en Cancún"
            width={220}
            height={90}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>
        <nav className="hidden gap-6 text-sm font-bold text-brand-blue-dark md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-brand-green-dark transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="tel:+529983724752"
          className="rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white shadow-sm transition-transform hover:scale-105"
        >
          Llámanos
        </a>
      </div>
    </header>
  );
}
