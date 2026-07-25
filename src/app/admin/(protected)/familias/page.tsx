import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, User } from "lucide-react";

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

export default async function FamiliasPage() {
  const supabase = await createClient();
  const { data: tutores } = await supabase
    .from("tutores")
    .select("*, tutores_ninos(parentesco, nino:ninos(id, nombre, apellido_paterno, fecha_nacimiento, foto_url))")
    .order("created_at", { ascending: false });

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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tutores?.map((t) => (
          <Link
            key={t.id}
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
                <p className="font-extrabold text-brand-blue-dark">
                  {t.nombre} {t.apellido_paterno}
                </p>
                <p className="text-xs text-foreground/60">{t.telefono}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {t.tutores_ninos?.length ? (
                t.tutores_ninos.map(
                  (tn: {
                    nino: {
                      id: string;
                      nombre: string;
                      apellido_paterno: string;
                      fecha_nacimiento: string | null;
                      foto_url: string | null;
                    } | null;
                  }) =>
                    tn.nino && (
                      <span
                        key={tn.nino.id}
                        className="flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold text-brand-green-dark"
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
        ))}
        {!tutores?.length && (
          <p className="text-center text-foreground/50">
            Aún no hay familias registradas.
          </p>
        )}
      </div>
    </div>
  );
}
