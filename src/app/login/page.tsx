"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir automáticamente si ya hay una sesión activa para evitar el login
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const hasError = Boolean(errorParam);

  async function handleGoogleLogin() {
    setIsSubmitting(true);
    try {
      // Usamos 'google' para activar el flujo de Airtable configurado en auth.ts
      await signIn("google", { 
        callbackUrl: "/",
        redirect: true 
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7] px-4 py-8">
      <div className="relative w-full max-w-md rounded-[28px] border border-white/60 bg-white/40 p-[1px] shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur-2xl">
        <div className="rounded-[26px] bg-white/80 p-8 text-center">
          
          {/* Logo Section */}
          <div className="mb-8 flex items-center justify-center gap-3 text-left">
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

          <div className="space-y-2 mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Bienvenido a Enterplay
            </h1>
            <p className="text-sm text-slate-500">
              Gestiona tus reseñas de Google Business de forma inteligente.
            </p>
          </div>

          {/* Google Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting || status === "loading"}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-white border border-slate-200 px-4 py-3 text-sm font-semibold tracking-tight text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-50"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5"
              />
              {isSubmitting ? "Accediendo..." : "Entrar con Google"}
            </button>

            {hasError && (
              <p className="text-xs font-medium text-[#FF3B30]">
                No hemos podido iniciar sesión. Por favor, intenta de nuevo.
              </p>
            )}
          </div>

          {/* Footer Text */}
          <div className="mt-8 space-y-3 text-[11px] text-slate-400 text-left">
            <div className="rounded-2xl bg-[#007AFF]/5 p-4 border border-[#007AFF]/10">
               <p className="text-[#007AFF] font-medium mb-1">🎁 Acceso Directo</p>
               <p>Al entrar con Google, tus créditos de Airtable se sincronizarán automáticamente.</p>
            </div>
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