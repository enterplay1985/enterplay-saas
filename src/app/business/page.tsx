"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface Business {
  ClientID: string;
  Name: string;
  Location: string;
  Status: string;
  GoogleID: string;
}

export default function BusinessPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // URL DE TU WIZARD 0.5
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0wyqhWMyG6zWuaDDnZ8pl3wa2PyUONVf5LhqiTczel8Mz3eMStaMsKp-pnuCDD0gAug/exec";

  // 1. Cargar los negocios que ya están en el Excel
  const fetchBusinesses = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${SCRIPT_URL}?action=get_data&clientId=${session.user.email}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBusinesses(data);
      }
    } catch (e) {
      console.error("Error al cargar locales:", e);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchBusinesses();
    }
  }, [status]);

  // 2. Sincronizar con Google Business Profile
  const handleSync = async () => {
    if (!session?.accessToken) {
      alert("⚠️ Error: No se detectó el token de Google. Por favor, cierra sesión y vuelve a entrar marcando los permisos de empresa.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=sync_locations&token=${session.accessToken}&clientId=${session.user.email}`
      );
      const data = await res.json();

      if (data.success) {
        alert(data.count > 0 ? `✅ ¡Sincronizado! Se agregaron ${data.count} locales.` : "ℹ️ No hay locales nuevos para agregar.");
        fetchBusinesses(); // Refrescar lista
      } else {
        alert("❌ Error de Google: " + data.message);
      }
    } catch (error) {
      alert("❌ Error crítico de conexión con el script.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="p-10 text-center">Cargando sesión...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Negocios</h1>
            <p className="text-slate-500 mt-1">Gestión de locales vinculados a {session?.user?.email}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSync}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
              }`}
            >
              {loading ? "🔄 Sincronizando..." : "🚀 Sincronizar con Google"}
            </button>
            <button 
              onClick={() => signOut()}
              className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Rejilla de Negocios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length > 0 ? (
            businesses.map((biz, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-blue-300 transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  🏪
                </div>
                <h3 className="font-bold text-xl text-slate-800">{biz.Name}</h3>
                <p className="text-xs text-slate-400 mt-2 font-mono bg-slate-50 p-2 rounded-lg">ID: {biz.GoogleID}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{biz.Status}</span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">{biz.Location}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4 opacity-20">🏢</div>
              <p className="text-slate-500 font-bold text-lg">No hay locales registrados todavía.</p>
              <p className="text-slate-400 text-sm mt-1">Pulsa el botón "Sincronizar" para importar tus datos desde Google.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}