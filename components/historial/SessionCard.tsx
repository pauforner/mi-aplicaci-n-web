import { Session } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface SessionCardProps {
  session: Session;
}

function getScoreBadge(score: number | null): {
  variant: "sage" | "amber" | "red" | "neutral" | "emerald";
  label: string;
} {
  if (score === null) return { variant: "neutral", label: "Sin completar" };
  if (score >= 9) return { variant: "emerald", label: "Muy asertivo/a" };
  if (score >= 7) return { variant: "sage", label: "Asertivo/a" };
  if (score >= 4) return { variant: "amber", label: "En progreso" };
  return { variant: "red", label: "Sumiso/a" };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionCard({ session }: SessionCardProps) {
  const scoreBadge = getScoreBadge(session.avg_score);
  const avgScore = session.avg_score ? Number(session.avg_score).toFixed(1) : null;

  return (
    <Card variant="default" className="card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-warm-400 font-body mb-1">
            {formatDate(session.started_at)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={scoreBadge.variant}>{scoreBadge.label}</Badge>
            {session.total_rounds > 0 && (
              <span className="text-xs text-warm-400 font-body">
                {session.total_rounds} ronda{session.total_rounds !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {avgScore && (
          <div className="flex-shrink-0 text-right">
            <span className="font-display text-2xl text-warm-900">{avgScore}</span>
            <span className="text-xs text-warm-400 font-body">/10</span>
          </div>
        )}
      </div>
    </Card>
  );
}
