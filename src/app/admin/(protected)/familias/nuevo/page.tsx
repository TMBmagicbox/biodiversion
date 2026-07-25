import { createClient } from "@/lib/supabase/server";
import NuevaFamiliaForm from "@/components/admin/NuevaFamiliaForm";

export default async function NuevaFamiliaPage() {
  const supabase = await createClient();
  const { data: planes } = await supabase
    .from("planes")
    .select("id, nombre, tipo, monto, horas_incluidas")
    .eq("activo", true)
    .order("monto");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Nueva familia
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Registra al tutor y sus hijos en un mismo formulario.
      </p>
      <NuevaFamiliaForm planes={planes ?? []} />
    </div>
  );
}
