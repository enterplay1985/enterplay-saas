"use client";

import React, { useEffect, useState } from 'react';
import { fetchTableData } from '@/lib/googleSheets';

interface Review {
  Name: string;
  Business: string;
  Review: string;
  Stars: number;
  Proccesed: string;
  Date: string;
  Avatar: string;
  ClientID: string;
}

export default function ReviewsList({ clientId }: { clientId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchTableData('Review');
      
      // Log para nosotros los devs (ISO completa)
      console.log("Dev Log - Raw Data:", data);

      if (Array.isArray(data)) {
        const filtered = clientId 
          ? data.filter((r: any) => String(r.ClientID).trim() === String(clientId).trim()) 
          : data;
        setReviews(filtered);
      }
      setLoading(false);
    };
    loadData();
  }, [clientId]);

  // Función para formatear la fecha a algo amigable
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Reciente";
    try {
      const date = new Date(dateStr);
      // Formato: 10 de mayo de 2024
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr; // Si falla, devuelve el original
    }
  };

  const getTrafficLightColor = (stars: number) => {
    if (stars >= 4) return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
    if (stars === 3) return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]";
    return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse";
  };

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse font-mono uppercase tracking-widest">Loading_Google_Reviews...</div>;

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((rev, i) => (
          <div key={i} className="flex items-start p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="relative">
              <img 
                src={rev.Avatar || `https://ui-avatars.com/api/?name=${rev.Name}&background=4285F4&color=fff`} 
                className="w-14 h-14 rounded-full mr-4 border-2 border-slate-50 object-cover shadow-sm"
                alt="avatar"
              />
              <div className={`absolute -bottom-1 right-3 w-4 h-4 rounded-full border-2 border-white ${getTrafficLightColor(Number(rev.Stars))}`}></div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{rev.Name}</h4>
                  <p className="text-[10px] font-black text-[#4285F4] uppercase tracking-widest">{rev.Business}</p>
                </div>

                <div className="flex items-center gap-0.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  {[...Array(5)].map((_, index) => (
                    <span 
                      key={index} 
                      className={`text-2xl ${index < Number(rev.Stars) ? "text-[#FBBC04]" : "text-slate-200"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 font-black text-slate-700 text-lg">{rev.Stars}</span>
                </div>
              </div>

              <div className="mt-3 relative">
                <span className="absolute -left-2 -top-1 text-4xl text-slate-100 font-serif">“</span>
                <p className="text-sm text-slate-600 leading-relaxed font-medium pl-2 italic">
                  {rev.Review}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.1em]">
                <div className="flex items-center gap-2 text-slate-400">
                  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-3 opacity-70" alt="google" />
                  {/* FECHA AMIGABLE AQUÍ */}
                  <span>• {formatDate(rev.Date)}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className={rev.Proccesed === 'checked' ? "text-green-600" : "text-amber-500"}>
                    {rev.Proccesed === 'checked' ? "✓ RESPUESTA VERIFICADA" : "● REQUIERE ACCIÓN"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
          <div className="text-4xl mb-4">📍</div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Zero_Reviews_Found_For_ID: {clientId}</p>
        </div>
      )}
    </div>
  );
}