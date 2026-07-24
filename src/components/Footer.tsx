import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Image
            src="/images/logo.png"
            alt="Biodiversión"
            width={200}
            height={80}
            className="h-12 w-auto brightness-0 invert opacity-90"
          />
          <p className="mt-4 text-sm text-white/80">
            Guardería y estancia infantil en Cancún. Cuidado, educación y
            amor por la naturaleza para bebés y niños desde 45 días de
            nacidos.
          </p>
        </div>
        <div>
          <h3 className="font-extrabold text-brand-green">Horarios</h3>
          <ul className="mt-3 space-y-1 text-sm text-white/80">
            <li>Lunes a viernes: 7:00 – 19:00</li>
            <li>Sábado: 7:00 – 16:00</li>
            <li>Domingo: cerrado</li>
          </ul>
        </div>
        <div>
          <h3 className="font-extrabold text-brand-green">Contacto</h3>
          <ul className="mt-3 space-y-1 text-sm text-white/80">
            <li>Av. Kohunlich 210, SM 50, 77533 Cancún, Q.R.</li>
            <li>
              <a href="tel:+529983724752" className="hover:underline">
                998 372 4752
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/biodiversion"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Facebook: /biodiversion
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Biodiversión. Todos los derechos
        reservados. ·{" "}
        <Link href="/admin/login" className="hover:underline">
          Acceso administrativo
        </Link>
      </div>
    </footer>
  );
}
