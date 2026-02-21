"use client";

import { usePractica } from "@/hooks/usePractica";
import StartButton from "./StartButton";
import FraseCard from "./FraseCard";
import ResponseInput from "./ResponseInput";
import AnalisisCard from "./AnalisisCard";
import NextButton from "./NextButton";

export default function ChatContainer() {
  const {
    estado,
    fraseActual,
    respuestaUsuario,
    analisis,
    rondaActual,
    error,
    empezar,
    analizarRespuesta,
    siguienteFrase,
    terminar,
  } = usePractica();

  const isLoadingFrase =
    estado === "loading_frase";
  const isAnalizando = estado === "analizando";

  return (
    <div className="flex flex-col gap-5">
      {/* Error global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 font-body animate-fade-in">
          {error}
        </div>
      )}

      {/* Estado: idle */}
      {estado === "idle" && (
        <StartButton onClick={empezar} />
      )}

      {/* Frase (visible en todos los estados activos) */}
      {(isLoadingFrase || estado === "esperando_respuesta" || isAnalizando || estado === "mostrando_resultado") && (
        <FraseCard frase={fraseActual} isLoading={isLoadingFrase} />
      )}

      {/* Estado: esperando respuesta */}
      {estado === "esperando_respuesta" && (
        <ResponseInput
          onSubmit={analizarRespuesta}
          isLoading={false}
          disabled={false}
        />
      )}

      {/* Estado: analizando */}
      {isAnalizando && (
        <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
          <div className="w-8 h-8 rounded-full border-2 border-sage-300 border-t-sage-600 animate-spin" />
          <p className="text-sm text-warm-500 font-body">
            Analizando tu respuesta...
          </p>
        </div>
      )}

      {/* Estado: mostrando resultado */}
      {estado === "mostrando_resultado" && analisis && (
        <>
          <AnalisisCard analisis={analisis} respuesta={respuestaUsuario} />
          <NextButton
            onClick={siguienteFrase}
            onTerminar={terminar}
            rondaActual={rondaActual}
            loading={false}
          />
        </>
      )}
    </div>
  );
}
