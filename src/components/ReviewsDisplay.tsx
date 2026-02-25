// src/components/ReviewsDisplay.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { fetchTableData } from '@/lib/googleSheets';

// Definimos la interfaz basándonos exactamente en las columnas de tu Google Sheet
interface Review {
  Nombre: string;
  Negocio: string;
  Reseña: string;
  Estrellas: number | string;
  Procesado: string;
  Fecha: string;
  Avatar: string;
  ClientID: string | number;
}

export default function ReviewsDisplay() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Llamamos a la función que creamos en lib/googleSheets.ts
      const data = await fetchTableData('Review'); 
      
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        throw new Error("El formato de datos recibido no es un array");
      }
    } catch (err) {
      setError("No se pudieron cargar las reseñas. Verifica la URL de Apps Script.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3">Cargando datos desde Google Sheets...</span>
    </div>
  );

  if (error) return (
    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
      {error}
      <button onClick={loadData} className="ml-4 underline font-bold">Reintentar</button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Reseñas Recientes</h2>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
          {reviews.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Comentario</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.length > 0 ? (
              reviews.map((rev, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                    {rev.Avatar && (
                      <img src={rev.Avatar} alt="" className="w-8 h-8 rounded-full mr-3 border" />
                    )}
                    {rev.Nombre}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-yellow-400">
                      {"★".repeat(Number(rev.Estrellas))}
                      <span className="text-gray-300">{"★".repeat(5 - Number(rev.Estrellas))}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={rev.Reseña}>
                    {rev.Reseña}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(rev.Fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rev.Procesado === 'Si' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rev.Procesado === 'Si' ? 'Respondida' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                  La hoja de cálculo está vacía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}