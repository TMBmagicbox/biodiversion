import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, Baby, UserPlus, Clock, Users } from "lucide-react";
import FichaIdentificacion from "@/components/admin/FichaIdentificacion";
import InsigniaEstatusPago from "@/components/admin/InsigniaEstatusPago";

function edad(fechaNacimiento: string | null) {
  if (!fechaNacimiento) return "Fecha pendiente";
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses -= 1;
  if (meses < 24) return `${meses} meses`;
  return `${Math.floor(meses / 12)} años`;
}

function insigniaPlan(plan: { nombre: string; tipo: string } | null) {
  if (!plan) {
    return (
      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-foreground/50">
        Sin plan asignado
      </span>
    );
  }
  const esPorHoras = plan.tipo === "tarjeta_horas";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        esPorHoras
          ? "bg-amber-100 text-amber-800"
          : "bg-brand-blue/10 text-brand-blue-dark"
      }`}
    >
      {esPorHoras
        ? `${plan.nombre} · por horas`
        : `${plan.nombre} · tiempo completo`}
    </span>
  );
}

type Nino = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  fecha_nacimiento: string | null;
  foto_url: string | null;
  salon: string | null;
  plan: { nombre: string; tipo: string } | null;
  proxima_fecha_pago: string | null;
  tutores_ninos: {
    parentesco: string;
    tutor: {
      id: string;
      nombre: string;
      apellido_paterno: string;
      telefono: string | null;
    } | null;
  }[];
  personas_autorizadas: {
    nombre: string;
    parentesco: string | null;
    telefono: string | null;
  }[];
};

function NinoCard({ n, hoy }: { n: Nino; hoy: string }) {
  const tutores = (n.tutores_ninos ?? []).filter((tn) => tn.tutor);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <FichaIdentificacion
          fotoUrl={n.foto_url}
          nombreCompleto={`${n.nombre} ${n.apellido_paterno}`}
          salon={n.salon}
          plan={n.plan}
          proximaFechaPago={n.proxima_fecha_pago}
          hoyISO={hoy}
          tutores={tutores.map((tn) => ({
            nombre: `${tn.tutor!.nombre} ${tn.tutor!.apellido_paterno}`,
            parentesco: tn.parentesco,
            telefono: tn.tutor!.telefono,
          }))}
          personasAutorizadas={n.personas_autorizadas ?? []}
          className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-green/10 text-brand-green-dark"
        >
          {n.foto_url ? (
            <Image
              src={n.foto_url}
              alt={n.nombre}
              width={48}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <Baby className="h-7 w-7" strokeWidth={2} />
          )}
        </FichaIdentificacion>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold text-brand-blue-dark">
            {n.nombre} {n.apellido_paterno}
          </p>
          <p className="truncate text-xs text-foreground/60">
            {edad(n.fecha_nacimiento)}
            {n.salon ? ` · ${n.salon}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {insigniaPlan(n.plan ?? null)}
        {n.proxima_fecha_pago && (
          <InsigniaEstatusPago
            proximaFechaPago={n.proxima_fecha_pago}
            hoyISO={hoy}
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tutores.length ? (
          tutores.map((tn) => (
            <Link
              key={tn.tutor!.id}
              href={`/admin/familias/${tn.tutor!.id}`}
              className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold text-brand-blue-dark hover:bg-white"
            >
              {tn.tutor!.nombre} {tn.tutor!.apellido_paterno}
              {tn.parentesco ? ` · ${tn.parentesco}` : ""}
            </Link>
          ))
        ) : (
          <Link
            href={`/admin/familias/ninos/${n.id}/agregar-tutor`}
            className="flex items-center gap-1 rounded-full bg-brand-blue px-2.5 py-1 text-xs font-extrabold text-white hover:bg-brand-blue-dark"
          >
            <UserPlus className="h-3 w-3" />
            Agregar tutor
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function FamiliasPage() {
  const supabase = await createClient();
  const hoy = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Cancun",
  });
  const { data: ninos } = await supabase
    .from("ninos")
    .select(
      "id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, foto_url, salon, plan:planes(nombre, tipo), proxima_fecha_pago, tutores_ninos(parentesco, tutor:tutores(id, nombre, apellido_paterno, telefono)), personas_autorizadas(nombre, parentesco, telefono)",
    )
    .eq("activo", true)
    .order("nombre");

  const ninosList = (ninos ?? []) as unknown as Nino[];
  const tiempoCompleto = ninosList.filter(
    (n) => n.plan?.tipo !== "tarjeta_horas",
  );
  const porHoras = ninosList.filter(
    (n) => n.plan?.tipo === "tarjeta_horas",
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-blue-dark">Niños</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Cada niño/a con su plan y su tutor. Toca el nombre del tutor para
            ver o editar la familia completa.
          </p>
        </div>
        <Link
          href="/admin/familias/nuevo"
          className="flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Registrar niño/a
        </Link>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-extrabold text-brand-blue-dark">
        <Users className="h-5 w-5" />
        Tiempo completo ({tiempoCompleto.length})
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Niños con plan de mensualidad (o sin plan asignado todavía).
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiempoCompleto.map((n) => (
          <NinoCard key={n.id} n={n} hoy={hoy} />
        ))}
        {!tiempoCompleto.length && (
          <p className="text-center text-foreground/50">
            No hay niños de tiempo completo todavía.
          </p>
        )}
      </div>

      <h2 className="mt-10 flex items-center gap-2 text-lg font-extrabold text-brand-blue-dark">
        <Clock className="h-5 w-5" />
        Por horas ({porHoras.length})
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Niños con tarjeta de horas.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {porHoras.map((n) => (
          <NinoCard key={n.id} n={n} hoy={hoy} />
        ))}
        {!porHoras.length && (
          <p className="text-center text-foreground/50">
            No hay niños por horas todavía.
          </p>
        )}
      </div>

      {!ninosList.length && (
        <p className="mt-6 text-center text-foreground/50">
          Aún no hay niños registrados.
        </p>
      )}
    </div>
  );
}
