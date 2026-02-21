import { Session } from "@/types";
import SessionCard from "./SessionCard";

interface SessionListProps {
  sessions: Session[];
}

export default function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-4">
        <span className="text-5xl">🌱</span>
        <div>
          <p className="font-display text-xl text-warm-700">Aún no hay sesiones</p>
          <p className="text-sm text-warm-400 font-body mt-1">
            Completa tu primera sesión de práctica para verla aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session, i) => (
        <div
          key={session.id}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <SessionCard session={session} />
        </div>
      ))}
    </div>
  );
}
