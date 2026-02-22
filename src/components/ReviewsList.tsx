"use client";

import { useEffect, useState, useTransition } from "react";
import type { Review } from "@/app/actions/getReviews";
import { getReviews } from "@/app/actions/getReviews";

type Status = "idle" | "loading" | "loaded" | "error";

function getInitials(nombre: string): string {
  if (!nombre) return "EP";
  const parts = nombre.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
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
    if (!clientId) {
      return;
    }

    setStatus("loading");
    startTransition(async () => {
      try {
        const data = await getReviews(clientId);
        setReviews(data);
        setStatus("loaded");
      } catch (error) {
        console.error("[Enterplay] Error al cargar reseñas", error);
        setStatus("error");
      }
    });
  }, [clientId]);

  const showSkeleton = status === "loading" || isPending;

  if (showSkeleton) {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse gap-3 py-3.5 first:pt-0 last:pb-0"
          >
            <div className="mt-0.5 h-9 w-9 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 w-32 rounded-full bg-slate-100" />
                <div className="h-3 w-10 rounded-full bg-slate-100" />
              </div>
              <div className="h-3 w-40 rounded-full bg-slate-100" />
              <div className="h-3 w-full rounded-full bg-slate-100" />
              <div className="h-2 w-20 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-xs text-slate-500">
        No se han podido cargar las reseñas. Inténtalo de nuevo en unos
        minutos.
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Aún no hay reseñas registradas en tu cuenta.
      </p>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {reviews.map((review, index) => (
        <article
          key={review.id}
          className="flex gap-3 py-3.5 first:pt-0 last:pb-0"
        >
          <div
            className={`mt-0.5 flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl text-[11px] font-semibold tracking-tight ${getColor(
              index
            )}`}
          >
            {review.avatar ? (
              // Avatar URL de Airtable (si está presente)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.avatar}
                alt={review.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(review.nombre)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-tight text-slate-900">
                  {review.nombre}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {review.negocio}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold tracking-tight text-slate-900">
                  {review.estrellas.toFixed(1)}
                </span>
                <span className="text-[9px] text-amber-400">★★★★★</span>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
              {review.comentario}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">{review.fecha}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

