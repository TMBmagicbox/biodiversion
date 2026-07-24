import NuevaFamiliaForm from "@/components/admin/NuevaFamiliaForm";

export default function NuevaFamiliaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Nueva familia
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Registra al tutor y sus hijos en un mismo formulario.
      </p>
      <NuevaFamiliaForm />
    </div>
  );
}
