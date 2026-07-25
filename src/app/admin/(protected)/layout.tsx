import Sidebar from "@/components/admin/Sidebar";
import CarruselDeudores from "@/components/admin/CarruselDeudores";
import { asegurarPerfilPropio } from "@/app/admin/actions";
import { obtenerNinosPorVencerOVencidos, aDeudorCarrusel } from "@/lib/deudores";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garantiza que cualquier persona del personal que inicie sesión tenga su
  // fila en perfiles_admin, sin importar por qué página del panel entre
  // primero (antes solo se creaba al visitar /admin/usuarios).
  await asegurarPerfilPropio();

  // Alerta de deudores: se calcula aquí (en el layout compartido) para que
  // aparezca en TODAS las páginas del panel (asistencia, familias, pagos,
  // etc.), no solo en Pagos.
  const hoy = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Cancun",
  });
  const porVencerOVencidos = await obtenerNinosPorVencerOVencidos(hoy);
  const deudores = porVencerOVencidos.map(aDeudorCarrusel);

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Sidebar />
      <CarruselDeudores deudores={deudores} hoyISO={hoy} />
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 sm:pl-0">
        <div className="glass-strong rounded-2xl p-4 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
