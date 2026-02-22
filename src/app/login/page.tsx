"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasError = Boolean(errorParam);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7] px-4 py-8">
      <div className="relative w-full max-w-md rounded-[28px] border border-white/60 bg-white/40 p-[1px] shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur-2xl">
        <div className="rounded-[26px] bg-white/80 p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#34C759] via-[#007AFF] to-[#AF52DE] shadow-sm" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Enterplay
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Enterplay Solutions
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Inicia sesión
            </h1>
            <p className="text-sm text-slate-500">
              Usa tu correo y contraseña para acceder a tu panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium tracking-tight text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm tracking-tight text-slate-900 outline-none ring-0 placeholder:text-slate-300 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
                placeholder="tucorreo@empresa.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium tracking-tight text-slate-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm tracking-tight text-slate-900 outline-none ring-0 placeholder:text-slate-300 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
                placeholder="••••••••"
              />
            </div>

            {hasError && (
              <p className="text-xs font-medium text-[#FF3B30]">
                No hemos podido iniciar sesión con esos datos. Revisa tu correo
                y contraseña.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold tracking-tight text-white shadow-[0_14px_30px_rgba(15,23,42,0.35)] transition hover:bg-black disabled:cursor-wait disabled:bg-slate-700"
            >
              {isSubmitting ? "Accediendo..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-[11px] text-slate-400">
            <p>
              En la siguiente fase añadiremos inicio de sesión con Google como
              segundo método.
            </p>
            <p>
              Al continuar aceptas los términos de uso y la política de
              privacidad de Enterplay Solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

