import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Phone } from "lucide-react";
import FacebookIcon from "@/components/icons/FacebookIcon";

export default function Footer() {
  return (
    <footer className="px-3 pb-3 sm:px-6">
      <div className="glass-dark mx-auto max-w-6xl rounded-3xl text-white">
        <div className="grid gap-8 px-6 py-12 sm:px-10 md:grid-cols-3">
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
            <h3 className="flex items-center gap-2 font-extrabold text-brand-green">
              <Clock3 className="h-4 w-4" />
              Horarios
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>Lunes a viernes: 7:00 – 19:00</li>
              <li>Sábado: 7:00 – 16:00</li>
              <li>Domingo: cerrado</li>
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-extrabold text-brand-green">
              <MapPin className="h-4 w-4" />
              Contacto
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>Av. Kohunlich 210, SM 50, 77533 Cancún, Q.R.</li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+529981290100" className="hover:underline">
                  998 129 0100
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FacebookIcon className="h-4 w-4 shrink-0" />
                <a
                  href="https://www.facebook.com/biodiversion"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  /biodiversion
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
      </div>
    </footer>
  );
}
