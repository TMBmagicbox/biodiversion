import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, User, Baby, UserPlus, Clock, Users } from "lucide-react";

function edad(fechaNacimiento: string | null) {
  if (!fechaNacimiento) return "s/f";
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses -= 1;
  if (meses < 24) return `${meses} m`;
  return `${Math.floor(meses / 12)} a`;
}

type Nino = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  fecha_nacimiento: string | null;
  foto_url: string | null;
  plan?: { nombre: string; tipo: string }[] | null;
};

type Tutor = {
  id: string;
  nombre: string;
  telefono: string | null;
  foto_url: string | null;
  tutores_ninos: { parentesco: string; nino: Nino | null }[];
};

/** Un tutor cae en "por horas" solo si TODOS sus hijos con plan asignado
 * tienen tarjeta de horas. Si tiene algún hijo de mensualidad, o ninguno
 * tiene plan asignado todavía, se muestra en "tiempo completo". */
function esFamiliaPorHoras(t: Tutor) {
  const tipos = (t.tutores_ninos ?? [])
    .map((tn) => tn.nino?.plan?.[0]?.tipo)
    .filter(Boolean);
  return tipos.length > 0 && tipos.every((tipo) => tipo === "tarjeta_horas");
}

function TutorCard({ t }: { t: Tutor }) {
  return (
    <Link
      href={`/admin/familias/${t.id}`}
      className="glass block rounded-2xl p-5 transition-transform hover:-translate-y-1"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue/10 text-brand-blue-dark">
          {t.foto_url ? (
            <Image
              src={t.foto_url}
              alt={t.nombre}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-6 w-6" strokeWidth={2} />
          )}
        </div>
        <div>
          <p className="font-extrabold text-brand-blue-dark">{t.nombre}</p>
          <p className="text-xs text-foreground/60">{t.telefono}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {t.tutores_ninos?.length ? (
          t.tutores_ninos.map(
            (tn) =>
              tn.nino && (
                <span
                  key={tn.nino.id}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                    tn.nino.plan?.[0]?.tipo === "tarjeta_horas"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-white/70 text-brand-green-dark"
                  }`}
                >
                  {tn.nino.foto_url ? (
                    <Image
                      src={tn.nino.foto_url}
                      alt={tn.nino.nombre}
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] rounded-full object-cover"
                    />
                  ) : null}
                  {tn.nino.nombre} ({edad(tn.nino.fecha_nacimiento)})
                </span>
              ),
          )
        ) : (
          <span className="text-xs text-foreground/40">
            Sin hijos registrados
          </span>
        )}
      </div>
    </Link>
  );
}

export default async function FamiliasPage() {
  const supabase = await createClient();
  const [{ data: tutores }, { data: ninos }] = await Promise.all([
    supabase
      .from("tutores")
      .select(
        "*, tutores_ninos(parentesco, nino:ninos(id, nombre, apellido_paterno, fecha_nacimiento, foto_url, plan:planes(nombre, tipo)))",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("ninos")
      .select(
        "id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, foto_url, salon, plan:planes(nombre, tipo), tutores_ninos(tutor_id)",
      )
      .eq("activo", true)
      .order("nombre"),
  ]);

  const ninosSinTutor = (ninos ?? []).filter(
    (n) => !n.tutores_ninos || n.tutores_ninos.length === 0,
  );

  const tutoresList = (tutores ?? []) as unknown as Tutor[];
  const tutoresPorHoras = tutoresList.filter(esFamiliaPorHoras);
  const tutoresTiempoCompleto = tutoresList.filter(
    (t) => !esFamiliaPorHoras(t),
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-blue-dark">
            Familias
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Tutores y los niños que tienen a su cargo.
          </p>
        </div>
        <Link
          href="/admin/familias/nuevo"
          className="flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nueva familia
        </Link>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-extrabold text-brand-blue-dark">
        <Users className="h-5 w-5" />
        Tiempo completo ({tutoresTiempoCompleto.length})
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Familias con plan de mensualidad (o sin plan asignado todavía).
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {tutoresTiempoCompleto.map((t) => (
          <TutorCard key={t.id} t={t} />
        ))}
        {!tutoresTiempoCompleto.length && (
          <p className="text-center text-foreground/50">
            No hay familias de tiempo completo todavía.
          </p>
        )}
      </div>

      <h2 className="mt-10 flex items-center gap-2 text-lg font-extrabold text-brand-blue-dark">
        <Clock className="h-5 w-5" />
        Por horas ({tutoresPorHoras.length})
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Familias con tarjeta de horas.
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {tutoresPorHoras.map((t) => (
          <TutorCard key={t.id} t={t} />
        ))}
        {!tutoresPorHoras.length && (
          <p className="text-center text-foreground/50">
            No hay familias por horas todavía.
          </p>
        )}
      </div>

      {!tutoresList.length && (
        <p className="mt-6 text-center text-foreground/50">
          Aún no hay familias registradas.
        </p>
      )}

      {ninosSinTutor.length > 0 && (
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-blue-dark">
            <Baby className="h-5 w-5" />
            Niños sin tutor asignado ({ninosSinTutor.length})
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Importados desde el Excel — agrégales el tutor para completar la
            familia.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ninosSinTutor.map((n) => (
              <div
                key={n.id}
                className={`glass flex items-center gap-3 rounded-2xl border-l-4 p-4 ${
                  n.plan?.[0]?.tipo === "tarjeta_horas"
                    ? "border-amber-400"
                    : "border-brand-blue"
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-green/10 text-brand-green-dark">
                  {n.foto_url ? (
                    <Image
                      src={n.foto_url}
                      alt={n.nombre}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Baby className="h-6 w-6" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-brand-blue-dark">
                    {n.nombre} {n.apellido_paterno}
                  </p>
                  <p className="truncate text-xs text-foreground/60">
                    {edad(n.fecha_nacimiento)}
                    {n.salon ? ` · ${n.salon}` : ""}
                    {n.plan?.[0]?.nombre ? ` · ${n.plan[0].nombre}` : ""}
                  </p>
                </div>
                <Link
                  href={`/admin/familias/ninos/${n.id}/agregar-tutor`}
                  aria-label={`Agregar tutor de ${n.nombre}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-blue px-3 py-1.5 text-xs font-extrabold text-white transition-transform hover:scale-105"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Tutor
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
