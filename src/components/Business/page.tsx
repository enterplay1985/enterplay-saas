"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function MisNegociosPage() {
  const { data: session, status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error" | "quota">("idle");

  if (status === "loading") return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Verificando sesión...</div>;
  if (!session) return <div className="p-20 text-center">Inicia sesión para continuar.</div>;

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus("idle");
    try {
      const response = await fetch("https://auto-n8n.nvidjj.easypanel.host/webhook/sync-google-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: session.user?.clientId || "USR-746",
          action: 'get_businesses'
        })
      });

      if (response.ok) setSyncStatus("success");
      else if (response.status === 429 || response.status === 500) setSyncStatus("quota");
      else setSyncStatus("error");
    } catch (e) {
      setSyncStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Certeza visual de conexión */}
        <div className="bg-white rounded-[2.5rem] p-8 mb-8 shadow-sm flex items-center gap-6 border border-slate-200/60">
          <div className="relative">
            <img 
              src={session.user?.image || ""} 
              className="w-20 h-20 rounded-full border-4 border-blue-50" 
              alt="Google" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">G</div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none mb-2">Mis Negocios</h1>
            <p className="text-slate-400 font-medium text-sm">Gestionando cuenta: <span className="text-slate-600">{session.user?.email}</span></p>
          </div>
        </div>

        {/* Módulo de Sincronización */}
        <div className="bg-white rounded-[3rem] p-12 text-center shadow-sm border border-slate-200/60">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sincroniza tus datos</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Tu cuenta está vinculada. Presiona el botón para importar tus ubicaciones y reseñas desde Google Business Profile.
            </p>
            
            <button 
              disabled={isSyncing}
              onClick={handleSync}
              className={`w-full py-4 font-black rounded-2xl shadow-lg transition-all active:scale-95 text-white
                ${isSyncing ? 'bg-slate-300' : 'bg-[#0066FF] hover:bg-[#0052CC]'}`}
            >
              {isSyncing ? "Conectando con Google..." : "Sincronizar Negocios Ahora"}
            </button>

            {syncStatus === "success" && <p className="mt-4 text-green-500 font-bold text-xs uppercase animate-bounce">✅ ¡Sincronización iniciada!</p>}
            {syncStatus === "quota" && <p className="mt-4 text-amber-500 font-bold text-[10px] uppercase">⚠️ Google saturado. Reintenta en 15 min.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}