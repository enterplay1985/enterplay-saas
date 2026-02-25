// src/components/RefreshData.tsx completo
"use client";

import React, { useState } from 'react';

export const RefreshData = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setIsSyncing(true);
    setMessage("");

    const SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

    try {
      // Mandamos la señal al doPost de Apps Script
      await fetch(SCRIPT_URL || "", {
        method: "POST",
        mode: "no-cors", // Requerido por Apps Script para evitar bloqueos de CORS
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sync_reviews",
          timestamp: new Date().toISOString()
        }),
      });

      setMessage("¡Sincronización solicitada!");
      
      // Recargamos la página después de 2 segundos para ver los nuevos datos
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Error al sincronizar:", error);
      setMessage("Error al conectar con Google.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-500 mb-2 leading-relaxed">
        Presiona el botón para buscar nuevas reseñas en Google Maps y actualizar tu base de datos.
      </p>
      
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${
          isSyncing 
          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
          : "bg-[#0066FF] text-white hover:bg-blue-700 shadow-blue-200"
        }`}
      >
        {isSyncing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            PROCESANDO...
          </div>
        ) : "ACTUALIZAR RESEÑAS"}
      </button>

      {message && (
        <p className={`text-[10px] text-center font-bold uppercase tracking-widest ${
          message.includes("Error") ? "text-red-500" : "text-green-500"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};