import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 sm:pl-0">
        <div className="glass-strong rounded-2xl p-4 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
