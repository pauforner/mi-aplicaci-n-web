import Button from "@/components/ui/Button";

interface NextButtonProps {
  onClick: () => void;
  onTerminar: () => void;
  rondaActual: number;
  loading?: boolean;
}

export default function NextButton({
  onClick,
  onTerminar,
  rondaActual,
  loading,
}: NextButtonProps) {
  return (
    <div className="flex flex-col gap-3 animate-fade-up animate-delay-300">
      <div className="flex items-center justify-between">
        <span className="text-xs text-warm-400 font-body">
          Ronda {rondaActual} completada
        </span>
      </div>
      <Button onClick={onClick} loading={loading} size="lg" className="w-full">
        {loading ? "Cargando..." : "Siguiente frase →"}
      </Button>
      <Button
        onClick={onTerminar}
        variant="ghost"
        size="md"
        className="w-full text-warm-500"
      >
        Terminar sesión
      </Button>
    </div>
  );
}
