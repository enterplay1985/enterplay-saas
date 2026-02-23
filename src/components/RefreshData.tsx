'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export function RefreshData() {
  return (
    <button 
      onClick={() => window.location.reload()}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-[#F2F2F7] rounded-xl transition-all"
    >
      <RefreshCw size={18} />
      <span className="text-sm font-medium tracking-tight">Actualizar Datos</span>
    </button>
  );
}