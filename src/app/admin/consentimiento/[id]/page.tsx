import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BotonImprimir from "@/components/admin/BotonImprimir";
import {
  DECLARACION_CONSENTIMIENTO,
  PARRAFOS_CONSENTIMIENTO,
  TITULO_CONSENTIMIENTO,
  VERSION_CONSENTIMIENTO,
} from "@/lib/consentimiento";
import { DIRECCION_LINEA, TELEFONO_DISPLAY } from "@/lib/site";

type Nino = { nombre: string; apellido_paterno: string; activo: boolean };

/** Formato del consentimiento listo para imprimir y firmar. Está fuera del
 * layout del panel para que se imprima limpio (sin menú lateral). */
export default async function ConsentimientoImprimiblePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: tutor } = await supabase
    .from("tutores")
    .select(
      "nombre, apellido_paterno, apellido_materno, tutores_ninos(nino:ninos(nombre, apellido_paterno, activo))",
    )
    .eq("id", id)
    .maybeSingle();
  if (!tutor) notFound();

  const nombreTutor = [tutor.nombre, tutor.apellido_paterno, tutor.apellido_materno]
    .filter(Boolean)
    .join(" ");
  const hijos = ((tutor.tutores_ninos ?? []) as unknown as { nino: Nino | Nino[] | null }[])
    .map((tn) => (Array.isArray(tn.nino) ? tn.nino[0] : tn.nino))
    .filter((n): n is Nino => !!n && n.activo)
    .map((n) => `${n.nombre} ${n.apellido_paterno}`);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="print:hidden border-b bg-amber-50 px-4 py-3">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/familias/${id}/consentimiento`}
            className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <p className="text-xs font-bold text-amber-800">
            Borrador: revisa el texto con tu abogado antes de usarlo con las familias.
          </p>
          <BotonImprimir />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-8 py-10 text-[13px] leading-relaxed">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest">Biodiversión · Guardería</p>
          <h1 className="mt-2 text-xl font-black">{TITULO_CONSENTIMIENTO}</h1>
          <p className="mt-1 text-xs text-black/60">
            {DIRECCION_LINEA} · Tel. {TELEFONO_DISPLAY}
          </p>
        </header>

        <section className="mt-6 rounded-lg border border-black/20 p-4">
          <p>
            <strong>Persona que otorga el consentimiento:</strong> {nombreTutor}
          </p>
          {hijos.length > 0 && (
            <p className="mt-1">
              <strong>Niña(s) / niño(s) a su cargo:</strong> {hijos.join(", ")}
            </p>
          )}
        </section>

        <div className="mt-5 space-y-3">
          {PARRAFOS_CONSENTIMIENTO.map((p) => (
            <p key={p.titulo}>
              <strong>{p.titulo}. </strong>
              {p.texto}
            </p>
          ))}
        </div>

        <p className="mt-5 font-bold">{DECLARACION_CONSENTIMIENTO}</p>

        <div className="mt-16 grid grid-cols-2 gap-10">
          <div>
            <div className="border-t border-black pt-1 text-center text-xs">
              Firma de {nombreTutor}
            </div>
          </div>
          <div>
            <div className="border-t border-black pt-1 text-center text-xs">
              Fecha (día / mes / año)
            </div>
          </div>
        </div>

        <footer className="mt-12 text-[10px] text-black/50">
          Versión del texto: {VERSION_CONSENTIMIENTO}
        </footer>
      </article>
    </div>
  );
}
