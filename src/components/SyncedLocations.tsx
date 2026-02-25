"use client";

import React, { useEffect, useState } from 'react';
import { fetchTableData } from '@/lib/googleSheets';

export default function SyncedLocations({ 
  clientId, 
  userRole = "FREE" 
}: { 
  clientId?: string, 
  userRole?: string 
}) {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const limits: Record<string, number> = {
    "FREE": 1, "BASIC": 1, "BUSINESS": 3, "PRO": 10, "SUPERADMIN": 999
  };
  const currentLimit = limits[userRole.toUpperCase()] || 1;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchTableData('Business');
      if (Array.isArray(data)) {
        const filtered = data.filter((loc: any) => 
          String(loc.ClientID).trim() === String(clientId).trim()
        );
        setLocations(filtered.slice(0, currentLimit));
      }
      setLoading(false);
    };
    loadData();
  }, [clientId, currentLimit]);

  const selectBusiness = (placeId: string) => {
    // Aquí es donde sucede la magia: guardamos en el navegador qué negocio estamos viendo
    localStorage.setItem('activePlaceID', placeId);
    window.dispatchEvent(new Event('storage')); // Avisamos al resto de la app
    alert("Cargando datos del local...");
  };

  if (loading) return <div className="animate-pulse h-20 bg-slate-100 rounded-3xl"></div>;

  return (
    <div className="grid gap-3">
      {locations.map((loc, i) => (
        <button 
          key={i}
          onClick={() => selectBusiness(loc.PlaceID)}
          className="flex items-center justify-between p-5 bg-white rounded-[28px] border border-slate-100 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group text-left w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:bg-[#4285F4]">
              {i + 1}
            </div>
            <div>
              <h4 className="font-black text-[11px] text-slate-800 uppercase tracking-tighter">{loc.Name}</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase italic">{loc.Status}</p>
            </div>
          </div>
          <span className="text-blue-500 font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">GESTIONAR →</span>
        </button>
      ))}
      
      {locations.length === 0 && (
        <p className="text-center text-[10px] font-black text-slate-400 uppercase py-4">No hay negocios vinculados</p>
      )}
    </div>
  );
}