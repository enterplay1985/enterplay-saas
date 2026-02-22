"use client";

import { signOut } from "next-auth/react";

export function SidebarProfileNav() {
  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#F2F2F7]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-[15px]">
          👤
        </span>
        <span className="tracking-tight">Perfil</span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full px-2 py-1 text-[11px] font-medium tracking-tight text-slate-500 hover:bg-white/80 hover:text-slate-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

