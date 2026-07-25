"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cerrarSesion } from "@/app/admin/actions";
import {
  LayoutDashboard,
  Users,
  Clock3,
  CreditCard,
  UserCog,
  ImageIcon,
  Newspaper,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Panel", Icon: LayoutDashboard },
  { href: "/admin/familias", label: "Familias", Icon: Users },
  { href: "/admin/asistencia", label: "Asistencia / Horas", Icon: Clock3 },
  { href: "/admin/pagos", label: "Pagos", Icon: CreditCard },
  { href: "/admin/blog", label: "Blog / Redes sociales", Icon: Newspaper },
  { href: "/admin/inicio", label: "Banner de inicio", Icon: ImageIcon },
  { href: "/admin/usuarios", label: "Usuarios del personal", Icon: UserCog },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {items.map(({ href, label, Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
  );
}

export default function Sidebar() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();
  const [rutaPrevia, setRutaPrevia] = useState(pathname);

  // Cierra el menú móvil cada vez que cambias de página
  if (pathname !== rutaPrevia) {
    setRutaPrevia(pathname);
    setAbierto(false);
  }

  return (
    <>
      {/* Barra superior solo en móvil */}
      <div className="glass-strong sticky top-0 z-40 m-3 flex items-center justify-between rounded-2xl px-4 py-3 sm:hidden">
        <Image
          src="/images/logo.png"
          alt="Biodiversión"
          width={140}
          height={56}
          className="h-9 w-auto"
        />
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-brand-blue-dark hover:bg-white/60"
        >
          <Menu className="h-6 w-6" strokeWidth={2.25} />
        </button>
      </div>

      {/* Overlay al abrir el menú en móvil */}
      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setAbierto(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: fija en escritorio, drawer deslizable en móvil */}
      <aside
        className={`glass-strong fixed top-0 z-50 flex h-screen w-72 flex-col rounded-none transition-transform duration-200 sm:sticky sm:top-3 sm:z-auto sm:m-3 sm:h-[calc(100vh-1.5rem)] sm:w-64 sm:translate-x-0 sm:rounded-2xl ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/40 px-5 py-4">
          <Image
            src="/images/logo.png"
            alt="Biodiversión"
            width={160}
            height={64}
            className="h-10 w-auto"
          />
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 text-brand-blue-dark hover:bg-white/60 sm:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks onNavigate={() => setAbierto(false)} />
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
    </>
  );
}
