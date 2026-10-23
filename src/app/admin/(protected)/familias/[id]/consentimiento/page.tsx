import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Circle, FileText, Printer, ScanFace } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { revocarConsentimiento, subirConsentimiento } from "@/app/admin/facial-actions";
import ArchivoConsentimiento from "@/components/admin/ArchivoConsentimiento";
import BotonConfirmar from "@/components/admin/BotonConfirmar";

function fecha(iso: string) {
  return new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString("es-MX", {
    timeZone: "America/Cancun",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Paso({ hecho, titulo, children }: { hecho: boolean; titulo: string; children?: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          hecho ? "bg-brand-green text-white" : "bg-black/10 text-foreground/40"
        }`}
      >
        {hecho ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Circle className="h-2.5 w-2.5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold text-brand-blue-dark">{titulo}</p>
        {children}
      </div>
    </div>
  );
}

export default async function ConsentimientoFamiliaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { id } = await params;
  const { error, ok } = await searchParams;
  const supabase = await createClient();

  const [{ data: tutor }, { data: consentimientos }, { data: rostro }] = await Promise.all([
    supabase.from("tutores").select("nombre, apellido_paterno").eq("id", id).maybeSingle(),
    supabase
      .from("consentimientos_biometricos")
      .select("id, fecha_firma, archivo_path, version_texto, revocado_at, created_at")
      .eq("tutor_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("rostros_tutores").select("created_at, descriptores").eq("tutor_id", id).maybeSingle(),
  ]);
  if (!tutor) notFound();

  const lista = consentimientos ?? [];
  const vigente = lista.find((c) => !c.revocado_at) ?? null;
  const historial = lista.filter((c) => c.revocado_at);

  // Enlaces temporales (10 min) a las copias firmadas: el bucket es privado.
  const rutas = lista.map((c) => c.archivo_path as string);
  const urls = new Map<string, string>();
  if (rutas.length) {
    const { data: firmadas } = await supabase.storage.from("consentimientos").createSignedUrls(rutas, 600);
    for (const f of firmadas ?? []) if (f.path && f.signedUrl) urls.set(f.path, f.signedUrl);
  }

  const nombre = `${tutor.nombre} ${tutor.apellido_paterno}`;
  const capturas = Array.isArray(rostro?.descriptores) ? rostro.descriptores.length : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/admin/familias/${id}`}
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la familia
      </Link>

      <h1 className="mt-4 flex items-center gap-2 text-2xl font-black text-brand-blue-dark">
        <ScanFace className="h-6 w-6" />
        Reconocimiento facial · {nombre}
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        El rostro solo se registra después de tener el consentimiento firmado por el tutor.
      </p>

      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      {ok && (
        <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-800">
          {ok === "consentimiento" && "Consentimiento guardado. Ya puedes registrar el rostro."}
          {ok === "rostro" && "Rostro registrado. Ya puede usar la tableta."}
          {ok === "revocado" && "Consentimiento revocado y rostro eliminado."}
        </p>
      )}

      <div className="glass mt-5 space-y-6 rounded-2xl p-6">
        <Paso hecho={!!vigente} titulo="1. Consentimiento firmado">
          {vigente ? (
            <div className="mt-1 text-sm text-foreground/70">
              <p>
                Firmado el {fecha(vigente.fecha_firma)} · texto {vigente.version_texto}
              </p>
              {urls.get(vigente.archivo_path) && (
                <a
                  href={urls.get(vigente.archivo_path)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-bold text-brand-blue-dark hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Ver copia firmada
                </a>
              )}
            </div>
          ) : (
            <div className="mt-2 space-y-4">
              <Link
                href={`/admin/consentimiento/${id}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-blue-dark"
              >
                <Printer className="h-4 w-4" />
                Imprimir formato para firma
              </Link>
              <form action={subirConsentimiento} className="space-y-3 rounded-xl bg-white/60 p-4">
                <input type="hidden" name="tutor_id" value={id} />
                <p className="text-sm font-bold text-brand-blue-dark">
                  Subir la copia firmada (foto o PDF)
                </p>
                <label className="block text-sm">
                  <span className="font-bold">Fecha en que firmó</span>
                  <input
                    type="date"
                    name="fecha_firma"
                    required
                    defaultValue={new Date().toLocaleDateString("en-CA", { timeZone: "America/Cancun" })}
                    max={new Date().toLocaleDateString("en-CA", { timeZone: "America/Cancun" })}
                    className="mt-1 block rounded-lg border border-black/10 bg-white px-3 py-2"
                  />
                </label>
                <ArchivoConsentimiento name="archivo" />
                <button
                  type="submit"
                  className="rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white"
                >
                  Guardar consentimiento
                </button>
              </form>
            </div>
          )}
        </Paso>

        <Paso hecho={!!rostro} titulo="2. Rostro registrado">
          {rostro ? (
            <p className="mt-1 text-sm text-foreground/70">
              Registrado el {fecha(rostro.created_at)} · {capturas} capturas (solo huella numérica)
            </p>
          ) : (
            <p className="mt-1 text-sm text-foreground/60">
              {vigente ? "Pendiente." : "Disponible cuando haya consentimiento firmado."}
            </p>
          )}
          {vigente && (
            <Link
              href={`/admin/familias/${id}/rostro`}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-blue-dark"
            >
              <ScanFace className="h-4 w-4" />
              {rostro ? "Volver a registrar el rostro" : "Registrar rostro"}
            </Link>
          )}
        </Paso>

        <Paso hecho={!!vigente && !!rostro} titulo="3. Listo para la tableta">
          <p className="mt-1 text-sm text-foreground/60">
            {vigente && rostro
              ? "Este tutor ya es reconocido en el kiosco de entrada."
              : "Se activa al completar los pasos anteriores."}
          </p>
        </Paso>
      </div>

      {vigente && (
        <form action={revocarConsentimiento} className="mt-4">
          <input type="hidden" name="tutor_id" value={id} />
          <BotonConfirmar
            mensaje={`¿Revocar el consentimiento de ${nombre}? Se borrará su rostro del sistema. La copia firmada se conserva.`}
            className="text-sm font-bold text-red-600 hover:underline"
          >
            Revocar consentimiento y borrar rostro
          </BotonConfirmar>
        </form>
      )}

      {historial.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-extrabold text-brand-blue-dark">Consentimientos revocados</h2>
          <ul className="mt-2 space-y-1 text-sm text-foreground/60">
            {historial.map((c) => (
              <li key={c.id}>
                Firmado {fecha(c.fecha_firma)} · revocado {fecha(c.revocado_at as string)}
                {urls.get(c.archivo_path) && (
                  <>
                    {" · "}
                    <a href={urls.get(c.archivo_path)} target="_blank" rel="noreferrer" className="font-bold text-brand-blue-dark hover:underline">
                      ver copia
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
