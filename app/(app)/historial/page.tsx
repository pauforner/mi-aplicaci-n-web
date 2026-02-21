import { createClient } from "@/lib/supabase/server";
import SessionList from "@/components/historial/SessionList";
import { Session } from "@/types";

export const metadata = {
  title: "Historial — Practica la Asertividad",
};

export default async function HistorialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let sessions: Session[] = [];

  if (user) {
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(50);

    sessions = (data as Session[]) ?? [];
  }

  // Stats generales
  const completadas = sessions.filter((s) => s.ended_at !== null);
  const avgGlobal =
    completadas.length > 0
      ? completadas.reduce((acc, s) => acc + (Number(s.avg_score) || 0), 0) /
        completadas.length
      : null;
  const totalRondas = completadas.reduce((acc, s) => acc + s.total_rounds, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-warm-900">Tu progreso</h1>
        <p className="text-warm-500 font-body text-sm mt-1">
          Cada sesión es un paso hacia una comunicación más plena.
        </p>
      </div>

      {/* Stats */}
      {completadas.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center shadow-soft">
            <p className="font-display text-2xl text-warm-900">{completadas.length}</p>
            <p className="text-xs text-warm-400 font-body mt-0.5">Sesiones</p>
          </div>
          <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center shadow-soft">
            <p className="font-display text-2xl text-warm-900">{totalRondas}</p>
            <p className="text-xs text-warm-400 font-body mt-0.5">Rondas</p>
          </div>
          <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 text-center shadow-soft">
            <p className="font-display text-2xl text-sage-700">
              {avgGlobal ? avgGlobal.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-sage-500 font-body mt-0.5">Promedio</p>
          </div>
        </div>
      )}

      <SessionList sessions={sessions} />
    </div>
  );
}
