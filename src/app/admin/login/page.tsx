"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong w-full max-w-sm rounded-3xl p-8">
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Biodiversión"
            width={200}
            height={80}
            className="h-14 w-auto"
          />
        </div>
        <h1 className="mt-6 text-center text-xl font-extrabold text-brand-blue-dark">
          Panel administrativo
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-correo" className="text-sm font-bold text-brand-blue-dark">
              Correo
            </label>
            <input
              id="admin-correo"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#5c6f68] bg-white px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="admin-clave" className="text-sm font-bold text-brand-blue-dark">
              Contraseña
            </label>
            <input
              id="admin-clave"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#5c6f68] bg-white px-3 py-2"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-bold text-red-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-blue-dark py-2.5 font-extrabold text-white disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-foreground/80">
          Acceso solo para el personal de Biodiversión.
        </p>
      </div>
    </div>
  );
}
