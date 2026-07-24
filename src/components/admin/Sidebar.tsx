"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cerrarSesion } from "@/app/admin/actions";
import {
  LayoutDashboard,
  Baby,
  Users,
  Clock3,
  CreditCard,
  UserCog,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Panel", Icon: LayoutDashboard },
  { href: "/admin/ninos", label: "Niños", Icon: Baby },
  { href: "/admin/tutores", label: "Tutores", Icon: Users },
  { href: "/admin/asistencia", label: "Asistencia / Horas", Icon: Clock3 },
  { href: "/admin/pagos", label: "Pagos", Icon: CreditCard },
  { href: "/admin/usuarios", label: "Usuarios del personal", Icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-strong sticky top-3 m-3 flex h-[calc(100vh-1.5rem)] w-64 flex-col rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/40 px-5 py-4">
        <Image
          src="/images/logo.png"
          alt="Biodiversión"
          width={160}
          height={64}
          className="h-10 w-auto"
        />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                active
                  ? "bg-brand-blue text-white"
                  : "text-brand-blue-dark hover:bg-white/60"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
              {label}
            </Link>
          );
        })}
      </nav>
      <form action={cerrarSesion} className="border-t border-white/40 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50/60"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.25} />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
