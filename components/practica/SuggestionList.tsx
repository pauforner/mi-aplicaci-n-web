interface SuggestionListProps {
  sugerencias: string[];
}

export default function SuggestionList({ sugerencias }: SuggestionListProps) {
  return (
    <div className="flex flex-col gap-3">
      {sugerencias.map((sugerencia, i) => (
        <div
          key={i}
          className="flex gap-3 animate-fade-up"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {/* Número badge */}
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center mt-0.5">
            <span className="text-xs font-bold text-sage-600 font-body">{i + 1}</span>
          </div>

          {/* Texto de sugerencia */}
          <p className="text-sm text-warm-700 font-body leading-relaxed flex-1">
            {sugerencia}
          </p>
        </div>
      ))}
    </div>
  );
}
