import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import RegistroRostro from "@/components/admin/RegistroRostro";

export default async function RegistrarRostroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: tutor }, { data: consentimiento }] = await Promise.all([
    supabase.from("tutores").select("nombre, apellido_paterno").eq("id", id).maybeSingle(),
    supabase
      .from("consentimientos_biometricos")
      .select("id")
      .eq("tutor_id", id)
      .is("revocado_at", null)
      .maybeSingle(),
  ]);
  if (!tutor) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/admin/familias/${id}/consentimiento`}
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>
      <h1 className="mt-4 text-2xl font-black text-brand-blue-dark">Registrar rostro</h1>

      <div className="mt-4">
        {consentimiento ? (
          <RegistroRostro tutorId={id} nombre={`${tutor.nombre} ${tutor.apellido_paterno}`} />
        ) : (
          <div className="glass rounded-2xl p-6 text-sm">
            <p className="font-bold text-brand-blue-dark">
              Falta el consentimiento firmado de este tutor.
            </p>
            <p className="mt-1 text-foreground/60">
              Sube la copia firmada antes de registrar el rostro.
            </p>
            <Link
              href={`/admin/familias/${id}/consentimiento`}
              className="mt-3 inline-block font-bold text-brand-blue-dark hover:underline"
            >
              Ir al consentimiento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
