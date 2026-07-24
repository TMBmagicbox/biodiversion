import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function TutoresPage() {
  const supabase = await createClient();
  const { data: tutores } = await supabase
    .from("tutores")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-brand-blue-dark">Tutores</h1>
        <Link
          href="/admin/tutores/nuevo"
          className="rounded-full bg-brand-green px-4 py-2 text-sm font-extrabold text-white"
        >
          + Nuevo tutor
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-blue-light text-brand-blue-dark">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Dirección</th>
            </tr>
          </thead>
          <tbody>
            {tutores?.map((t) => (
              <tr key={t.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold">
                  {t.nombre} {t.apellido_paterno} {t.apellido_materno}
                </td>
                <td className="px-4 py-3">{t.telefono}</td>
                <td className="px-4 py-3">{t.email || "—"}</td>
                <td className="px-4 py-3">{t.direccion || "—"}</td>
              </tr>
            ))}
            {!tutores?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-foreground/50">
                  Aún no hay tutores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
