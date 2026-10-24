"use client";

import { Printer } from "lucide-react";

export default function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-blue-dark"
    >
      <Printer className="h-4 w-4" />
      Imprimir
    </button>
  );
}
