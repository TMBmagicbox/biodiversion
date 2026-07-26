import {
  Baby,
  Apple,
  Sprout,
  Leaf,
  HeartHandshake,
  ShieldCheck,
  Phone,
  ImageIcon,
} from "lucide-react";
import FacebookIcon from "@/components/icons/FacebookIcon";
import HeroSlider from "@/components/HeroSlider";
import { createClient } from "@/lib/supabase/server";
import { enviarMensajeContacto } from "@/app/(site)/actions";

const servicios = [
  {
    titulo: "Estancia infantil",
    detalle:
      "Guarda, custodia, aseo y cuidado diario para bebés desde 45 días de nacidos hasta niños de 4 años.",
    Icon: Baby,
  },
  {
    titulo: "Alimentación",
    detalle:
      "Menús balanceados y horarios de comida personalizados según la edad y necesidades de cada niño.",
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

const horarios = [
  { dia: "Lunes a viernes", horas: "7:00 am – 7:00 pm" },
  { dia: "Sábado", horas: "7:00 am – 4:00 pm" },
  { dia: "Domingo", horas: "Cerrado" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ChildCare",
  name: "Biodiversión",
  description:
    "Guardería y estancia infantil en Cancún para bebés desde 45 días hasta niños de 4 años.",
  url: "https://biodiversion.vercel.app",
  telephone: "+52-998-129-0100",
  image: "https://biodiversion.vercel.app/images/logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Kohunlich 210, SM 50",
    addressLocality: "Cancún",
    addressRegion: "Quintana Roo",
    postalCode: "77533",
    addressCountry: "MX",
  },
  sameAs: ["https://www.facebook.com/biodiversion"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "07:00",
      closes: "16:00",
    },
  ],
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ contacto?: string }>;
}) {
  const { contacto } = await searchParams;
  const supabase = await createClient();
  const { data: slides } = await supabase
    .from("hero_slides")
    .select(
      "id, titulo, descripcion, imagen_fondo_url, imagen_decorativa_url, logo_url, texto_boton, url_boton",
    )
    .eq("activo", true)
    .order("orden", { ascending: true });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Banner de inicio: 100% de ancho, slider con parallax */}
      <HeroSlider slides={slides ?? []} />

      {/* Servicios */}
      <section
        id="servicios"
        className="mx-auto max-w-6xl scroll-mt-24 px-3 py-16 sm:px-6"
      >
        <h2 className="text-center text-3xl font-black text-brand-blue-dark">
          Nuestros servicios
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
          Cuidado integral pensado para el desarrollo y bienestar de cada
          niño.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(({ titulo, detalle, Icon }) => (
            <div
              key={titulo}
              className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue-dark">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-4 font-extrabold text-brand-blue-dark">
                {titulo}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">{detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Horarios: 100% de ancho */}
      <section id="horarios" className="glass w-full scroll-mt-24 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black text-brand-blue-dark">
            Horarios de atención
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {horarios.map((h) => (
              <div key={h.dia} className="glass-strong rounded-2xl p-6">
                <p className="font-extrabold text-brand-green-dark">
                  {h.dia}
                </p>
                <p className="mt-1 text-lg font-bold text-brand-blue-dark">
                  {h.horas}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-foreground/60">
            Contamos con horarios flexibles adaptados a las necesidades de
            cada familia. Pregunta por planes de medio tiempo y tiempo
            completo.
          </p>
        </div>
      </section>

      {/* Instalaciones / fotos */}
      <section
        id="instalaciones"
        className="mx-auto max-w-6xl scroll-mt-24 px-3 py-16 sm:px-6"
      >
        <h2 className="text-center text-3xl font-black text-brand-blue-dark">
          Nuestras instalaciones
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
          Espacios seguros y diseñados para niños: jardín, sala de juegos,
          cocina, baños adaptados, aire acondicionado y estacionamiento.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl text-brand-blue-dark/50"
            >
              <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-sm font-bold">Foto próximamente</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-foreground/50">
          * Reemplaza estas tarjetas con fotos reales del local en{" "}
          <code>public/images/instalaciones</code>.
        </p>
      </section>

      {/* Ubicación + Contacto: 100% de ancho */}
      <section id="ubicacion" className="glass w-full scroll-mt-24 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-brand-blue-dark">
              Ubicación
            </h2>
            <p className="mt-3 text-foreground/70">
              Av. Kohunlich 210, SM 50, C.P. 77533, Cancún, Quintana Roo.
            </p>
            <div className="glass-strong mt-6 overflow-hidden rounded-2xl p-2">
              <iframe
                title="Ubicación Biodiversión"
                width="100%"
                height="300"
                loading="lazy"
                className="rounded-xl"
                style={{ border: 0 }}
                src="https://www.google.com/maps?q=Av.+Kohunlich+210,+SM+50,+77533+Canc%C3%BAn,+Q.R.&output=embed"
              />
            </div>
          </div>
          <div id="contacto" className="scroll-mt-24">
            <h2 className="text-3xl font-black text-brand-blue-dark">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-foreground/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-blue-dark" />
                <a href="tel:+529981290100" className="font-bold hover:underline">
                  998 129 0100
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FacebookIcon className="h-4 w-4 text-brand-blue-dark" />
                <a
                  href="https://www.facebook.com/biodiversion"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold hover:underline"
                >
                  facebook.com/biodiversion
                </a>
              </li>
            </ul>
            {contacto === "enviado" && (
              <p className="mt-6 rounded-2xl bg-brand-green/15 px-4 py-3 text-center text-sm font-bold text-brand-green-dark">
                ¡Gracias! Recibimos tu mensaje y te contactaremos pronto.
              </p>
            )}
            {contacto === "error" && (
              <p className="mt-6 rounded-2xl bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-700">
                No se pudo enviar tu mensaje. Intenta de nuevo o escríbenos
                por WhatsApp/teléfono.
              </p>
            )}
            <form
              action={enviarMensajeContacto}
              className="glass-strong mt-6 space-y-4 rounded-2xl p-6"
            >
              <div>
                <label className="text-sm font-bold text-brand-blue-dark">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-blue-dark">
                  Teléfono o correo
                </label>
                <input
                  type="text"
                  name="contacto"
                  required
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
                  placeholder="¿Cómo te contactamos?"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-blue-dark">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  rows={3}
                  required
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
                  placeholder="Cuéntanos sobre tu hijo/a y qué información necesitas"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-brand-green py-3 font-extrabold text-white transition-transform hover:scale-105"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
