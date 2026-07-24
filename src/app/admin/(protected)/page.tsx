import { createClient } from "@/lib/supabase/server";
import { Baby, Clock3, CreditCard } from "lucide-react";

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
    { label: "Niños activos", value: totalNinos ?? 0, Icon: Baby },
    { label: "Presentes hoy", value: presentesHoy ?? 0, Icon: Clock3 },
    { label: "Pagos pendientes", value: pagosPendientes ?? 0, Icon: CreditCard },
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
        {tarjetas.map(({ label, value, Icon }) => (
          <div key={label} className="glass rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue-dark">
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <p className="mt-3 text-3xl font-black text-brand-blue-dark">
              {value}
            </p>
            <p className="text-sm text-foreground/60">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
