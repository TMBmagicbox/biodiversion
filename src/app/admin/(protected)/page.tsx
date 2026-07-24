import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: totalNinos }, { count: presentesHoy }, { count: pagosPendientes }] =
    await Promise.all([
      supabase.from("ninos").select("*", { count: "exact", head: true }).eq("activo", true),
      supabase
        .from("asistencia")
        .select("*", { count: "exact", head: true })
        .eq("fecha", new Date().toISOString().slice(0, 10))
        .is("hora_salida", null),
      supabase
        .from("pagos")
        .select("*", { count: "exact", head: true })
        .eq("estatus", "pendiente"),
    ]);

  const tarjetas = [
    { label: "Niños activos", value: totalNinos ?? 0, icon: "🧒" },
    { label: "Presentes hoy", value: presentesHoy ?? 0, icon: "⏱️" },
    { label: "Pagos pendientes", value: pagosPendientes ?? 0, icon: "💳" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Panel administrativo
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Resumen general de Biodiversión.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <div
            key={t.label}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="text-3xl">{t.icon}</div>
            <p className="mt-2 text-3xl font-black text-brand-blue-dark">
              {t.value}
            </p>
            <p className="text-sm text-foreground/60">{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
