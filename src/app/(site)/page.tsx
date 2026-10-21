import type { Metadata } from "next";
import {
  Baby,
  Apple,
  Sprout,
  Leaf,
  HeartHandshake,
  ShieldCheck,
  Phone,
  Trees,
  Puzzle,
  UtensilsCrossed,
  Bath,
  Wind,
  Car,
} from "lucide-react";
import FacebookIcon from "@/components/icons/FacebookIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import FilaPersonajes from "@/components/FilaPersonajes";
import FormularioContacto from "@/components/FormularioContacto";
import { fotosInstalaciones } from "@/lib/contenido-publico";
import { PERSONAJES } from "@/lib/personajes";
import {
  DIRECCION_LINEA,
  EDAD_ATENCION,
  FACEBOOK_URL,
  GEO,
  HERO_DESCRIPCION,
  HORARIOS,
  MAPS_EMBED,
  MAPS_URL,
  SITE_URL,
  TELEFONOS,
  TEXTO_MENUS,
  WHATSAPP_URL,
} from "@/lib/site";
import Image from "next/image";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const servicios = [
  {
    titulo: "Estancia infantil",
    detalle:
      "Guarda, custodia, aseo y cuidado diario. Atendemos bebés desde los 3 meses hasta los 4 años.",
    Icon: Baby,
  },
  {
    titulo: "Alimentación",
    detalle: TEXTO_MENUS,
    Icon: Apple,
  },
  {
    titulo: "Estimulación y desarrollo",
    detalle:
      "Actividades de estimulación temprana, motricidad y autonomía con seguimiento individual.",
    Icon: Sprout,
  },
  {
    titulo: "Contacto con la naturaleza",
    detalle:
      "Juegos al aire libre y actividades ecológicas que fomentan el amor por la biodiversidad.",
    Icon: Leaf,
  },
  {
    titulo: "Valores",
    detalle:
      "Respeto, responsabilidad y compañerismo como base de la convivencia diaria.",
    Icon: HeartHandshake,
  },
  {
    titulo: "Seguridad",
    detalle:
      "Cámaras de vigilancia, chapas eléctricas, salidas de emergencia y personal capacitado.",
    Icon: ShieldCheck,
  },
];

const espacios = [
  {
    titulo: "Jardín",
    detalle: "Juego al aire libre y contacto con la naturaleza.",
    Icon: Trees,
  },
  {
    titulo: "Sala de juegos",
    detalle: "Espacio para motricidad, juego y estimulación.",
    Icon: Puzzle,
  },
  {
    titulo: "Cocina",
    detalle: "Preparación de comida según la edad de cada niño.",
    Icon: UtensilsCrossed,
  },
  {
    titulo: "Baños adaptados",
    detalle: "Aseo y cambio de pañal con medidas de higiene.",
    Icon: Bath,
  },
  {
    titulo: "Clima",
    detalle: "Aire acondicionado en las áreas de estancia.",
    Icon: Wind,
  },
  {
    titulo: "Estacionamiento",
    detalle: "Acceso para dejar y recoger con más calma.",
    Icon: Car,
  },
];

export default async function HomePage() {
  const fotos = await fotosInstalaciones();

  const imagen = `${SITE_URL}/personajes/trio-abrazo.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ChildCare",
    "@id": `${SITE_URL}/#guarderia`,
    name: "Biodiversión",
    description: `Guardería y estancia infantil en Cancún. ${EDAD_ATENCION}`,
    url: SITE_URL,
    telephone: ["+52-998-129-0100", "+52-998-372-4752"],
    image: imagen,
    inLanguage: "es-MX",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Kohunlich 210, SM 50",
      addressLocality: "Cancún",
      addressRegion: "Quintana Roo",
      postalCode: "77533",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    hasMap: MAPS_URL,
    areaServed: {
      "@type": "City",
      name: "Cancún",
    },
    sameAs: [FACEBOOK_URL],
    openingHours: ["Mo-Fr 07:00-19:00", "Sa 08:00-16:00"],
    openingHoursSpecification: HORARIOS.filter((horario) => horario.abre).map(
      (horario) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: horario.dias,
        opens: horario.abre,
        closes: horario.cierra,
      }),
    ),
    amenityFeature: espacios.map((espacio) => ({
      "@type": "LocationFeatureSpecification",
      name: espacio.titulo,
      value: true,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="overflow-x-clip bg-[#F6E4CC]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-16">
          <div>
            <p className="inline-block rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-brand-blue-dark">
              Guardería en Cancún · SM 50
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-blue-dark sm:text-5xl">
              Un lugar cálido para que tu hijo crezca, juegue y se sienta en casa
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
              {HERO_DESCRIPCION}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#contacto"
                className="rounded-full bg-brand-green px-6 py-3 text-center font-extrabold text-[#14240a]"
              >
                Agenda una visita
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#075E54] px-6 py-3 text-center font-extrabold text-white"
              >
                WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm font-bold text-brand-blue-dark">
              Llámanos:{" "}
              {TELEFONOS.map((telefono, indice) => (
                <span key={telefono.tel}>
                  {indice > 0 && " · "}
                  <a href={telefono.tel} className="underline underline-offset-2">
                    {telefono.display}
                  </a>
                </span>
              ))}
            </p>
          </div>
          <div>
            <Image
              src="/personajes/trio-abrazo.png"
              alt="Rosa, Verde y Púrpura abrazados"
              width={966}
              height={782}
              priority
              data-velocidad="0.12"
              className="personaje-flota h-auto w-full"
            />
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {PERSONAJES.map((personaje) => (
                <li
                  key={personaje.id}
                  className={`burbuja burbuja-${personaje.id} text-sm leading-snug`}
                >
                  <p className="font-extrabold text-brand-blue-dark">
                    {personaje.nombre}
                  </p>
                  <p className="mt-1 font-semibold">{personaje.burbuja}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="amigos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-brand-blue-dark">
          Conoce a nuestros amigos
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/80">
          Rosa, Verde y Púrpura acompañan el día a día. {EDAD_ATENCION}
        </p>
        <div className="mt-10">
          <FilaPersonajes />
        </div>
      </section>

      <section id="juego" className="scroll-mt-24 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)]">
          <Image
            src="/personajes/verde-senalando.png"
            alt="Verde señalando el juego y las actividades"
            width={628}
            height={723}
            data-velocidad="0.28"
            className="personaje-flota mx-auto h-auto max-h-48 w-auto sm:max-h-80"
          />
          <div>
            <h2 className="text-3xl font-bold text-brand-blue-dark">
              Juego, jardín y actividades
            </h2>
            <p className="burbuja burbuja-verde mt-4 text-sm">
              <span className="font-extrabold text-brand-blue-dark">Verde. </span>
              En el jardín jugamos, exploramos y aprendemos juntos.
            </p>
            <p className="mt-3 leading-relaxed text-foreground/80">
              Verde presenta el tiempo al aire libre, el juego y la
              estimulación. Hay contacto con la naturaleza y actividades
              según la edad, desde los 3 meses hasta los 4 años.
            </p>
          </div>
        </div>
      </section>

      <div className="asomo-purpura" aria-hidden="true">
        <Image
          src="/personajes/purpura-asomando.png"
          alt=""
          width={553}
          height={455}
          data-velocidad="0.5"
        />
      </div>

      <section id="bebes" className="tapa-purpura scroll-mt-24 pb-16">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-2">
          <Image
            src="/personajes/rosa-purpura.png"
            alt="Rosa junto a Púrpura"
            width={948}
            height={760}
            data-velocidad="0.18"
            className="personaje-flota order-1 mx-auto h-auto w-full max-w-md lg:order-2"
          />
          <div className="relative z-10 order-2 lg:order-1">
            <div className="marco-asomo mb-4 min-h-[4.8rem] md:min-h-[8.5rem]">
              <div className="asomo-lado" aria-hidden="true">
                <Image
                  src="/personajes/verde-asomando.png"
                  alt=""
                  width={512}
                  height={766}
                  data-velocidad="0.4"
                />
              </div>
              <h2 className="con-margen-asomo text-3xl font-bold text-brand-blue-dark">
                Bebés y bienvenida
              </h2>
            </div>
            <p className="burbuja burbuja-purpura text-sm">
              <span className="font-extrabold text-brand-blue-dark">Púrpura. </span>
              Los bebés, desde los 3 meses, tienen cuidado cercano y menús
              según su edad.
            </p>
            <p className="mt-3 leading-relaxed text-foreground/80">
              Rosa da la bienvenida y Púrpura acompaña a los más pequeños.{" "}
              {EDAD_ATENCION} El cuidado y la alimentación se adaptan a cada
              niño.
            </p>
            <a
              href="#contacto"
              className="relative z-10 mt-4 inline-flex font-extrabold text-brand-blue-dark underline underline-offset-2"
            >
              Escríbenos o llámanos
            </a>
          </div>
        </div>
      </section>

      <section
        id="servicios"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <h2 className="text-center text-3xl font-black text-brand-blue-dark">
          Nuestros servicios
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/80">
          Cuidado integral pensado para el desarrollo y bienestar de cada
          niño.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(({ titulo, detalle, Icon }) => (
            <div key={titulo} className="glass rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue-dark">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-extrabold text-brand-blue-dark">
                {titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {detalle}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="horarios" className="w-full scroll-mt-24 bg-white/70 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black text-brand-blue-dark">
            Horarios de atención
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {HORARIOS.map((horario) => (
              <div key={horario.dia} className="glass-strong rounded-2xl p-6">
                <p className="font-extrabold text-brand-green-dark">
                  {horario.dia}
                </p>
                <p className="mt-1 text-lg font-bold text-brand-blue-dark">
                  {horario.horas}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-foreground/80">
            Contamos con horarios flexibles adaptados a las necesidades de
            cada familia. Pregunta por planes de medio tiempo y tiempo
            completo.
          </p>
        </div>
      </section>

      <section
        id="instalaciones"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <h2 className="text-center text-3xl font-black text-brand-blue-dark">
          Nuestras instalaciones
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/80">
          Espacios seguros y diseñados para niños: jardín, sala de juegos,
          cocina, baños adaptados, aire acondicionado y estacionamiento.
        </p>
        {fotos.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((foto) => (
              <li key={foto.src} className="overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {espacios.map(({ titulo, detalle, Icon }) => (
              <li key={titulo} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/25 text-brand-green-dark">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-extrabold text-brand-blue-dark">{titulo}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  {detalle}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="ubicacion" className="w-full scroll-mt-24 bg-white/70 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-brand-blue-dark">
              Ubicación
            </h2>
            <p className="mt-3 text-foreground/80">{DIRECCION_LINEA}</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#5c6f68]/30 bg-white">
              <iframe
                title="Mapa de Biodiversión en Av. Kohunlich 210, Cancún"
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[280px] w-full sm:h-[320px]"
                style={{ border: 0 }}
                src={MAPS_EMBED}
              />
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex font-extrabold text-brand-blue-dark underline-offset-2 hover:underline"
            >
              Cómo llegar en Google Maps
            </a>
          </div>
          <div id="contacto" className="scroll-mt-24">
            <div className="marco-asomo sm:overflow-visible">
              <div className="asomo-lado sm:hidden" aria-hidden="true">
                <Image
                  src="/personajes/rosa-asomando.png"
                  alt=""
                  width={342}
                  height={828}
                  data-velocidad="0.32"
                />
              </div>
              <div className="con-margen-asomo solo-movil min-h-[4.8rem] sm:grid sm:min-h-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-end sm:gap-4">
                <Image
                  src="/personajes/rosa-saludando.png"
                  alt="Rosa saludando"
                  width={679}
                  height={784}
                  data-velocidad="0.22"
                  className="personaje-flota mb-3 hidden h-auto w-auto sm:mb-0 sm:block sm:max-h-52"
                />
                <h2 className="text-3xl font-black text-brand-blue-dark">
                  Contacto
                </h2>
              </div>
            </div>
            <p className="burbuja burbuja-rosa mt-4 text-sm">
              <span className="font-extrabold text-brand-blue-dark">Rosa. </span>
              ¡Hola! Si quieres visitarnos, aquí te orientamos.
            </p>
            <ul className="mt-4 space-y-3 text-foreground/80">
              {TELEFONOS.map((telefono) => (
                <li key={telefono.tel} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-blue-dark" aria-hidden="true" />
                  <a href={telefono.tel} className="font-bold hover:underline">
                    {telefono.display}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="h-4 w-4 text-brand-blue-dark" />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FacebookIcon className="h-4 w-4 text-brand-blue-dark" />
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  facebook.com/biodiversion
                </a>
              </li>
            </ul>
            <FormularioContacto />
          </div>
        </div>
      </section>
    </div>
  );
}
