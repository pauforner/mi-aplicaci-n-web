import { AnalisisResult } from "@/types";
import Card from "@/components/ui/Card";
import ScoreDisplay from "./ScoreDisplay";
import SuggestionList from "./SuggestionList";

interface AnalisisCardProps {
  analisis: AnalisisResult;
  respuesta: string;
}

export default function AnalisisCard({ analisis, respuesta }: AnalisisCardProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Respuesta del usuario */}
      <Card variant="sage" padding="sm">
        <p className="text-xs font-medium text-sage-600 uppercase tracking-wider font-body mb-1.5">
          Tu respuesta
        </p>
        <p className="text-sm text-warm-700 font-body italic leading-relaxed">
          &ldquo;{respuesta}&rdquo;
        </p>
      </Card>

      {/* Puntuación */}
      <Card variant="default" className="flex flex-col items-center gap-2">
        <p className="text-xs font-medium text-warm-400 uppercase tracking-wider font-body self-start">
          Puntuación de asertividad
        </p>
        <ScoreDisplay puntuacion={analisis.puntuacion} />
      </Card>

      {/* Sugerencias */}
      <Card variant="default">
        <p className="text-xs font-medium text-warm-400 uppercase tracking-wider font-body mb-4">
          Cómo mejorar
        </p>
        <SuggestionList sugerencias={analisis.sugerencias} />
      </Card>
    </div>
  );
}
