import ChatContainer from "@/components/practica/ChatContainer";

export const metadata = {
  title: "Practicar — Practica la Asertividad",
};

export default function PracticaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-warm-900">
          Tu espacio de práctica
        </h1>
        <p className="text-warm-500 font-body text-sm mt-1 leading-relaxed">
          Responde con calma y honestidad. No hay respuestas perfectas, solo aprendizaje.
        </p>
      </div>

      <ChatContainer />
    </div>
  );
}
