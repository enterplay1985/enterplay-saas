import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Componentes
import { SidebarProfileNav } from "@/components/SidebarProfileNav";
import ReviewsList from "@/components/ReviewsList";
import { RefreshData } from "@/components/RefreshData";
import SyncedLocations from "@/components/SyncedLocations";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const clientId = session.user?.clientId || "USR-DEFAULT";
  const credits = session.user?.credits || 0;
  const userRole = (session.user?.role || "FREE").toUpperCase(); 
  const isSuperAdmin = userRole === "SUPERADMIN";

  const roleStyles: Record<string, string> = {
    FREE: "bg-slate-100 text-slate-500 border-slate-200",
    BASIC: "bg-blue-50 text-blue-600 border-blue-100",
    BUSINESS: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PRO: "bg-amber-50 text-amber-600 border-amber-200 shadow-sm shadow-amber-50",
    SUPERADMIN: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-xl shadow-purple-200"
  };

  const currentRoleStyle = roleStyles[userRole] || roleStyles.FREE;

  return (
    <div className="min-h-screen bg-[#F2F2F7] px-4 py-6 md:px-6 font-sans text-slate-900">
      <div className="mx-auto flex max-w-6xl gap-6">
        
        {/* SIDEBAR - EL REINO DEL MAGO */}
        <aside className="hidden w-64 flex-shrink-0 flex-col gap-4 lg:flex">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200">
            {/* LOGO GOOGLE WIZARD DEFINITIVO */}
            <div className="flex flex-col mb-10 select-none">
               <span className="font-black text-xl tracking-tighter flex items-center gap-0.5">
                  <span className="text-[#4285f4]">G</span>
                  <span className="text-[#ea4335]">o</span>
                  <span className="text-[#fbbc05]">o</span>
                  <span className="text-[#4285f4]">g</span>
                  <span className="text-[#34a853]">l</span>
                  <span className="text-[#ea4335]">e</span>
               </span>
               <span className="font-black text-[32px] tracking-tighter italic text-slate-900 leading-none -mt-1">
                  WIZARD
               </span>
            </div>

            <nav className="space-y-2 mb-8">
              <Link href="/" className="flex items-center gap-3 px-5 py-4 bg-blue-50 text-[#4285F4] rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                DASHBOARD
              </Link>
              <Link href="/business" className="flex items-center gap-3 px-5 py-4 text-slate-400 hover:bg-slate-50 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                MIS NEGOCIOS
              </Link>
            </nav>
            <div className="h-[1px] bg-slate-100 mx-2 mb-8 opacity-50"></div>
            <SidebarProfileNav />
          </div>

          {/* PANEL DE SUPERADMIN (SIEMPRE LISTO) */}
          {isSuperAdmin && (
            <div className="bg-[#1C1C1E] rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-600/20 blur-2xl rounded-full"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-purple-400">Master Level</p>
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border border-purple-400/30 flex items-center justify-center gap-2">
                <span>⚡</span> INYECTAR PUNTOS
              </button>
            </div>
          )}
        </aside>

        {/* CAMPO DE BATALLA (MAIN CONTENT) */}
        <main className="flex-1 min-w-0">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm ${currentRoleStyle}`}>
                  {userRole} ACCOUNT
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">UID: {clientId}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 leading-none tracking-tighter flex items-center gap-3">
                Hola, {session.user?.name?.split(' ')[0]} <span className="text-3xl">👋</span>
              </h1>
            </div>
            
            <div className="bg-white px-10 py-6 rounded-[35px] border border-slate-200 shadow-sm text-right relative overflow-hidden min-w-[200px]">
              <div className="absolute left-0 top-0 w-1.5 h-full bg-[#4285F4]"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Power Tokens</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-4xl font-black text-[#4285F4] leading-none tracking-tighter">
                  {isSuperAdmin ? "∞" : credits}
                </span>
                <span className="text-xs font-black text-slate-300 uppercase">PTS</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-[45px] p-10 shadow-sm border border-slate-200">
               <div className="flex items-center justify-between mb-8 px-2">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Google Maps Activity</h2>
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Live Feed
                  </div>
               </div>
               <ReviewsList clientId={clientId} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-[45px] p-10 shadow-sm border border-slate-200">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-8 text-center">Engine Status</h2>
                  <RefreshData />
               </div>
               <div className="bg-white rounded-[45px] p-10 shadow-sm border border-slate-200">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-8 text-center">Synced Locations</h2>
                  <SyncedLocations clientId={clientId} userRole={userRole} />
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}