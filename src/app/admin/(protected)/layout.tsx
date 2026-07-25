import Sidebar from "@/components/admin/Sidebar";
import { asegurarPerfilPropio } from "@/app/admin/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garantiza que cualquier persona del personal que inicie sesión tenga su
  // fila en perfiles_admin, sin importar por qué página del panel entre
  // primero (antes solo se creaba al visitar /admin/usuarios).
  await asegurarPerfilPropio();

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 sm:pl-0">
        <div className="glass-strong rounded-2xl p-4 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
