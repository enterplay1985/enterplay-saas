"use client";

import { useEffect, useState, useTransition } from "react";
import type { Review } from "@/app/actions/getReviews";
import { getReviews } from "@/app/actions/getReviews";

type Status = "idle" | "loading" | "loaded" | "error";

function getInitials(nombre: string): string {
  if (!nombre) return "EP";
  const parts = nombre.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const colors = [
  "bg-[#34C759]/10 text-[#1B8F3F]",
  "bg-[#007AFF]/10 text-[#005AD6]",
  "bg-[#AF52DE]/10 text-[#7C3BB3]",
  "bg-[#FF3B30]/10 text-[#B6221A]",
];

function getColor(index: number): string {
  return colors[index % colors.length];
}

type ReviewsListProps = {
  clientId: string;
};

export function ReviewsList({ clientId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!clientId) return;
    async function fetchReviews() {
      setStatus("loading");
      try {
        const data = await getReviews(clientId);
        setReviews(data);
        setStatus("loaded");
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setStatus("error");
      }
    }
    fetchReviews();
  }, [clientId]);

  // Lógica de Métricas (Opción B: Filtrado dinámico)
  const total = reviews.length;
  const contestadas = reviews.filter(
    (r) => r.estado === "Contestada" || r.respondida === true
  ).length;
  const pendientes = total - contestadas;

  if (status === "loading") {
    return <div className="animate-pulse text-sm text-slate-400">Cargando datos de Airtable...</div>;
  }

  return (
    <div className="space-y-6">
      {/* --- BLOQUE DE MÉTRICAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reseñas</p>
          <p className="mt-1 text-4xl font-bold tracking-tighter text-slate-900">{total}</p>
          <div className="mt-2 h-1 w-8 rounded-full bg-slate-100" />
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contestadas</p>
          <p className="mt-1 text-4xl font-bold tracking-tighter text-[#34C759]">{contestadas}</p>
          <div className="mt-2 h-1 w-8 rounded-full bg-[#34C759]/20" />
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pendientes</p>
          <p className="mt-1 text-4xl font-bold tracking-tighter text-[#FF9500]">{pendientes}</p>
          <div className="mt-2 h-1 w-8 rounded-full bg-[#FF9500]/20" />
        </div>
      </div>

      {/* --- LISTA DE RESEÑAS --- */}
      <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Actividad Reciente</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">
            ID: {clientId}
          </span>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No hay reseñas para este cliente.</p>
          ) : (
            reviews.map((review, index) => (
              <div
                key={review.id}
                className="flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50/50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getColor(index)}`}>
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.nombre} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    getInitials(review.nombre)
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{review.nombre}</p>
                      <p className="text-[10px] text-slate-500">{review.negocio}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <span className="text-xs font-bold text-slate-900 mr-1">{review.estrellas}</span>
                        {"★".repeat(Math.floor(review.estrellas))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                    {review.comentario}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}