import Card from "@/components/ui/Card";

interface FraseCardProps {
  frase: string | null;
  isLoading?: boolean;
}

export default function FraseCard({ frase, isLoading }: FraseCardProps) {
  if (isLoading) {
    return (
      <Card variant="amber" className="animate-pulse-soft">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-xl flex-shrink-0 mt-0.5">💬</span>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-amber-200 rounded-full w-3/4" />
            <div className="h-4 bg-amber-200 rounded-full w-full" />
            <div className="h-4 bg-amber-200 rounded-full w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  if (!frase) return null;

  return (
    <Card variant="amber" className="animate-fade-up">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 text-xl flex-shrink-0 mt-0.5" role="img" aria-label="comentario">
          💬
        </span>
        <div>
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider font-body mb-2">
            La situación
          </p>
          <p className="font-display text-lg text-warm-900 italic leading-relaxed">
            &ldquo;{frase}&rdquo;
          </p>
        </div>
      </div>
    </Card>
  );
}
