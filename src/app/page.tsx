import { ReviewsList } from "@/components/ReviewsList";
import { SidebarProfileNav } from "@/components/SidebarProfileNav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { incrementCredits } from "@/app/actions/updateCredits";

// Forzamos datos dinámicos para evitar caché
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.clientId) {
    redirect("/login");
  }

  const clientId = session.user.clientId;
  const businessName = session.user.businessName;
  const userName = session.user.name ?? "cliente";
  const credits = Number(session.user.credits ?? 0);
  const creditsColor =
    credits < 5 ? "text-[#FF3B30]" : credits > 10 ? "text-[#007AFF]" : "text-slate-900";

  const isAdmin = session.user.role === "Admin";
  return (
    <div className="min-h-screen bg-[#F2F2F7] px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-6xl gap-5 lg:gap-6">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 rounded-3xl bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:flex md:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#34C759] via-[#007AFF] to-[#AF52DE] shadow-sm" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Enterplay
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Enterplay Solutions
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-[#F2F2F7] px-3 py-2.5 text-slate-900 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[15px]">
                ⌂
              </span>
              <span className="tracking-tight">Dashboard</span>
            </button>
            <SidebarProfileNav />
            <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#F2F2F7]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-[15px]">
                🏪
              </span>
              <span className="tracking-tight">Mis Negocios</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#F2F2F7]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-[15px]">
                💬
              </span>
              <span className="tracking-tight">Reseñas</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#F2F2F7]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-[15px]">
                ⚙︎
              </span>
              <span className="tracking-tight">Configuración</span>
            </button>
          </nav>

          <div className="mt-auto pt-8 text-xs text-slate-400">
            <p className="tracking-tight">Actividad en tiempo real</p>
            <p className="mt-1 text-[11px] leading-snug">
              Gestiona reseñas y rendimiento de tus negocios desde un solo lugar.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-6">
          {/* Header */}
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium tracking-tight text-slate-800">
                ¡Hola, {userName}! 👋
              </p>
              {businessName && (
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  {businessName}
                </p>
              )}
              <p className="mt-3 text-sm text-slate-500">
                Vista general de reseñas, créditos y rendimiento de tus negocios.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-xs text-slate-500 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#34C759]" />
              <span className="tracking-tight">
                Sincronización de reseñas actualizada hace 3 min
              </span>
            </div>
          </header>

          {/* Stat cards */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Créditos
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <p
                      className={`text-2xl font-semibold tracking-tight ${creditsColor}`}
                    >
                      {credits.toLocaleString("es-ES")}
                    </p>
                    {isAdmin && (
                      <form
                        action={async () => {
                          "use server";
                          await incrementCredits(clientId, 10);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-full px-2 py-1 text-[10px] font-medium tracking-tight text-slate-500 hover:bg-[#F2F2F7]"
                        >
                          Cargar +10
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#007AFF]/10 px-2 py-1 text-[11px] font-medium text-[#007AFF]">
                  +250 hoy
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Créditos disponibles para responder reseñas y activar campañas.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Reseñas
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    342
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#34C759]/10 px-2 py-1 text-[11px] font-medium text-[#34C759]">
                  +18 esta semana
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Nuevas reseñas recibidas en todos tus puntos de venta.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Rating
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    4.8
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#AF52DE]/10 px-2 py-1 text-[11px] font-medium text-[#AF52DE]">
                  92% reseñas positivas
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Promedio ponderado en Google, Facebook y otros canales.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Crecimiento
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    +23%
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#FF3B30]/10 px-2 py-1 text-[11px] font-medium text-[#FF3B30]">
                  vs. mes anterior
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Tendencia de reseñas y participación de clientes en 30 días.
              </p>
            </article>
          </section>

          {/* Middle: Activity graph + usage stats */}
          <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Activity graph */}
            <article className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <header className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    Gráfica de Actividad
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Volumen de reseñas y respuestas automatizadas.
                  </p>
                </div>
                <button className="rounded-full bg-[#F2F2F7] px-3 py-1 text-[11px] font-medium tracking-tight text-slate-600">
                  Últimos 30 días
                </button>
              </header>

              <div className="rounded-2xl bg-[#F2F2F7] px-4 py-3">
                <div className="flex items-end gap-1.5 pt-4">
                  {[
                    24, 40, 32, 52, 46, 64, 58, 72, 68, 80, 62, 70,
                  ].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-[#34C759] via-[#007AFF] to-[#AF52DE]"
                      style={{ height: `${h}px`, opacity: 0.7 }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mié</span>
                  <span>Jue</span>
                  <span>Vie</span>
                  <span>Sáb</span>
                  <span>Dom</span>
                </div>
              </div>
            </article>

            {/* Usage statistics */}
            <article className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <header className="mb-4">
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Estadísticas de Uso
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Distribución de actividad por canal y equipo.
                </p>
              </header>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tracking-tight text-slate-600">
                      Respuestas automáticas
                    </span>
                    <span className="font-medium text-slate-900">68%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-2/3 rounded-full bg-[#34C759]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tracking-tight text-slate-600">
                      Reseñas desde Google
                    </span>
                    <span className="font-medium text-slate-900">52%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-1/2 rounded-full bg-[#007AFF]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tracking-tight text-slate-600">
                      Reseñas desde QR en local
                    </span>
                    <span className="font-medium text-slate-900">31%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-1/3 rounded-full bg-[#AF52DE]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tracking-tight text-slate-600">
                      Alertas críticas
                    </span>
                    <span className="font-medium text-slate-900">6</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-1/5 rounded-full bg-[#FF3B30]" />
                  </div>
                </div>
              </div>
            </article>
          </section>

          {/* Recent reviews */}
          <section className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Reseñas Recientes
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Últimos comentarios recibidos en tus negocios.
                </p>
              </div>
              <button className="text-xs font-medium tracking-tight text-[#007AFF] hover:text-[#005AD6]">
                Ver todas
              </button>
            </header>

            <ReviewsList clientId={clientId} />
          </section>
        </main>
      </div>
    </div>
  );
}
