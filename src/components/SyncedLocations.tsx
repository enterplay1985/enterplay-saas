'use client';

import React from 'react';
import { Store } from 'lucide-react';
import Link from 'next/link'; // Importación verificada

export default function SyncedLocations() {
  return (
    <Link
      href="/Business" // <--- CAMBIADO: Sin el prefijo /dashboard/
      className="flex w-full items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-[#F2F2F7] rounded-xl transition-all group"
    >
      <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
        <Store size={18} className="text-slate-500" />
      </div>
      <span className="text-sm font-medium tracking-tight">Mis Negocios</span>
    </Link>
  );
}