import Image from "next/image";

const servicios = [
  {
    titulo: "Estancia infantil",
    detalle:
      "Guarda, custodia, aseo y cuidado diario para bebés desde 45 días de nacidos hasta niños de 8 años.",
    icono: "🧸",
  },
  {
    titulo: "Alimentación",
    detalle:
      "Menús balanceados y horarios de comida personalizados según la edad y necesidades de cada niño.",
    icono: "🍎",
  },
  {
    titulo: "Estimulación y desarrollo",
    detalle:
      "Actividades de estimulación temprana, motricidad y autonomía con seguimiento individual.",
    icono: "🌱",
  },
  {
    titulo: "Contacto con la naturaleza",
    detalle:
      "Juegos al aire libre y actividades ecológicas que fomentan el amor por la biodiversidad.",
    icono: "🌿",
  },
  {
    titulo: "Valores",
    detalle:
      "Respeto, responsabilidad y compañerismo como base de la convivencia diaria.",
    icono: "🤝",
  },
  {
    titulo: "Seguridad",
    detalle:
      "Cámaras de vigilancia, chapas eléctricas, salidas de emergencia y personal capacitado.",
    icono: "🔒",
  },
];

const horarios = [
  { dia: "Lunes a viernes", horas: "7:00 am – 7:00 pm" },
  { dia: "Sábado", horas: "7:00 am – 4:00 pm" },
  { dia: "Domingo", horas: "Cerrado" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue-light">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-block rounded-full bg-brand-green/15 px-4 py-1 text-sm font-bold text-brand-green-dark">
              Guardería en Cancún · SM 50
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-brand-blue-dark sm:text-5xl">
              Un lugar seguro para que tu hijo crezca, aprenda y{" "}
              <span className="text-brand-green-dark">se divierta</span>
            </h1>
            <p className="mt-5 text-lg text-foreground/80">
              Atendemos bebés desde 45 días de nacidos hasta niños de 8 años,
              con horarios flexibles, alimentación cuidada y un enfoque
              educativo conectado con la naturaleza.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contacto"
                className="rounded-full bg-brand-blue px-6 py-3 font-extrabold text-white shadow-md transition-transform hover:scale-105"
              >
                Agenda una visita
              </a>
              <a
                href="#servicios"
                className="rounded-full border-2 border-brand-green px-6 py-3 font-extrabold text-brand-green-dark transition-transform hover:scale-105"
              >
                Ver servicios
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Biodiversión"
              width={520}
              height={220}
              className="h-auto w-full max-w-md drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-black text-brand-blue-dark">
          Nuestros servicios
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
          Cuidado integral pensado para el desarrollo y bienestar de cada
          niño.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((s) => (
            <div
              key={s.titulo}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-4xl">{s.icono}</div>
              <h3 className="mt-3 font-extrabold text-brand-blue-dark">
                {s.titulo}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">{s.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Horarios */}
      <section id="horarios" className="bg-brand-green-light py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black text-brand-blue-dark">
            Horarios de atención
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {horarios.map((h) => (
              <div
                key={h.dia}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
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
      <section id="instalaciones" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
              className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue-light to-brand-green-light text-sm font-bold text-brand-blue-dark/50"
            >
              Foto próximamente
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-foreground/50">
          * Reemplaza estas tarjetas con fotos reales del local en{" "}
          <code>public/images/instalaciones</code>.
        </p>
      </section>

      {/* Ubicación + Contacto */}
      <section id="ubicacion" className="bg-brand-blue-light py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-brand-blue-dark">
              Ubicación
            </h2>
            <p className="mt-3 text-foreground/70">
              Av. Kohunlich 210, SM 50, C.P. 77533, Cancún, Quintana Roo.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl shadow-md">
              <iframe
                title="Ubicación Biodiversión"
                width="100%"
                height="300"
                loading="lazy"
                style={{ border: 0 }}
                src="https://www.google.com/maps?q=Av.+Kohunlich+210,+SM+50,+77533+Canc%C3%BAn,+Q.R.&output=embed"
              />
            </div>
          </div>
          <div id="contacto">
            <h2 className="text-3xl font-black text-brand-blue-dark">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-foreground/80">
              <li>
                📞{" "}
                <a href="tel:+529983724752" className="font-bold hover:underline">
                  998 372 4752
                </a>
              </li>
              <li>
                📘{" "}
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
            <form className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
              <div>
                <label className="text-sm font-bold text-brand-blue-dark">
                  Nombre
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-blue-dark">
                  Teléfono o correo
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
                  placeholder="¿Cómo te contactamos?"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-blue-dark">
                  Mensaje
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
                  placeholder="Cuéntanos sobre tu hijo/a y qué información necesitas"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-brand-green py-3 font-extrabold text-white transition-transform hover:scale-105"
              >
                Enviar
              </button>
              <p className="text-center text-xs text-foreground/50">
                * Este formulario es una plantilla: conéctalo a tu correo o
                WhatsApp (ver README).
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
