import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Componentes del Sidebar
import { SidebarProfileNav } from "@/components/SidebarProfileNav";
import { RefreshData } from "@/components/RefreshData";
import SyncedLocations from "@/components/SyncedLocations";

// Componentes de Contenido
import { ReviewsList } from "@/components/ReviewsList";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Mirando el panorama: Validamos sesión antes de renderizar nada
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // ID de Airtable para las reviews
  const clientId = session.user?.clientId || "USR-746";

  return (
    <div className="min-h-screen bg-[#F2F2F7] px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-6xl gap-6">
        
        {/* ASIDE / SIDEBAR: La estructura que organiza las herramientas */}
        <aside className="hidden w-64 flex-shrink-0 flex-col gap-4 lg:flex">
          
          {/* Bloque de Perfil */}
          <div className="bg-white rounded-[24px] p-2 shadow-sm border border-slate-200">
            <SidebarProfileNav />
          </div>

          {/* Bloque de Herramientas */}
          <div className="flex flex-col gap-1 rounded-[24px] bg-white p-2 shadow-sm border border-slate-200">
            <p className="px-4 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Herramientas
            </p>
            
            {/* Este es el componente que acabamos de arreglar con el Link e import */}
            <SyncedLocations />
            
            <RefreshData />
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL: Donde ocurre la magia */}
        <main className="flex-1 min-w-0">
          <header className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-[#0066FF] mb-1 tracking-widest">Dashboard</p>
              <h1 className="text-3xl font-black text-slate-900 leading-none">
                Hola, {session.user?.name?.split(" ")[0] || "Usuario"}
              </h1>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">Reseñas Recientes</h2>
              </div>
              
              {/* Listado de reviews traídas de Airtable */}
              <ReviewsList clientId={clientId} />
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}