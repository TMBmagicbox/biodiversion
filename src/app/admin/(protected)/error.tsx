"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="glass-strong mx-auto mt-10 max-w-lg rounded-2xl p-6 text-center">
      <h1 className="text-xl font-black text-brand-blue-dark">
        Algo salió mal
      </h1>
      <p className="mt-3 text-sm text-foreground/70">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-brand-green px-6 py-2 font-extrabold text-white transition-transform hover:scale-105"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
