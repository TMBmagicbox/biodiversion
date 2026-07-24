"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cerrarSesion } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Panel", icon: "🏠" },
  { href: "/admin/ninos", label: "Niños", icon: "🧒" },
  { href: "/admin/tutores", label: "Tutores", icon: "👨‍👩‍👧" },
  { href: "/admin/asistencia", label: "Asistencia / Horas", icon: "⏱️" },
  { href: "/admin/pagos", label: "Pagos", icon: "💳" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-black/5 bg-white">
      <div className="flex items-center gap-2 border-b border-black/5 px-5 py-4">
        <Image
          src="/images/logo.png"
          alt="Biodiversión"
          width={160}
          height={64}
          className="h-10 w-auto"
        />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                active
                  ? "bg-brand-blue text-white"
                  : "text-brand-blue-dark hover:bg-brand-blue-light"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={cerrarSesion} className="border-t border-black/5 p-3">
        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"
        >
          🚪 Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
