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
            <label className="text-sm font-bold text-brand-blue-dark">
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-blue-dark">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-blue py-2.5 font-extrabold text-white transition-transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-foreground/50">
          Los usuarios del personal se crean desde Supabase Auth. Ver{" "}
          <code>README.md</code>.
        </p>
      </div>
    </div>
  );
}
