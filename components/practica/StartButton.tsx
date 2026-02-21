import Button from "@/components/ui/Button";

interface StartButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export default function StartButton({ onClick, loading }: StartButtonProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-fade-up">
      {/* Ilustración decorativa */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-sage-100 border-2 border-sage-200 flex items-center justify-center shadow-sage">
          <span className="text-4xl" role="img" aria-label="planta">🌿</span>
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-sm">
          💬
        </div>
      </div>

      <div className="text-center max-w-sm">
        <h2 className="font-display text-2xl text-warm-900 mb-2">
          ¿Lista para practicar?
        </h2>
        <p className="text-warm-500 font-body text-sm leading-relaxed">
          La IA te mostrará situaciones desafiantes del día a día. Tú respondes, y te damos feedback para crecer.
        </p>
      </div>

      <Button
        onClick={onClick}
        loading={loading}
        size="lg"
        className="px-10 text-base rounded-full shadow-sage"
      >
        {loading ? "Preparando..." : "Empezar a practicar"}
      </Button>

      <p className="text-xs text-warm-400 font-body">
        Sin prisa. Sin juicios. Solo práctica.
      </p>
    </div>
  );
}
