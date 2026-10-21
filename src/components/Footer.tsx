import Image from "next/image";
import { Clock3, MapPin, Phone } from "lucide-react";
import FacebookIcon from "@/components/icons/FacebookIcon";
import {
  DIRECCION_CORTA,
  FACEBOOK_URL,
  HORARIOS,
  TELEFONOS,
} from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer w-full text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-10">
        <div>
          <Image
            src="/images/logo-white.png"
            alt="Biodiversión"
            width={200}
            height={80}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90">
            Guardería y estancia infantil en Cancún. Cuidado, educación y
            amor por la naturaleza. Atendemos bebés desde los 3 meses hasta
            los 4 años.
          </p>
        </div>
        <div>
          <h2 className="flex items-center gap-2 font-extrabold text-brand-green">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Horarios
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-white/90">
            {HORARIOS.map((horario) => (
              <li key={horario.dia}>
                {horario.dia}: {horario.horas}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="flex items-center gap-2 font-extrabold text-brand-green">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Contacto
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-white/90">
            <li>{DIRECCION_CORTA}</li>
            {TELEFONOS.map((telefono) => (
              <li key={telefono.tel} className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href={telefono.tel} className="underline-offset-2 hover:underline">
                  {telefono.display}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <FacebookIcon className="h-4 w-4 shrink-0" />
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 px-16 py-4 text-center text-xs text-white/85">
        © {new Date().getFullYear()} Biodiversión. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
