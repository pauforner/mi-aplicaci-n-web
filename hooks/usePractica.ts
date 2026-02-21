"use client";

import { useState, useCallback } from "react";
import { EstadoPractica, AnalisisResult, PracticaState } from "@/types";

const ESTADO_INICIAL: PracticaState = {
  estado: "idle",
  sesionId: null,
  fraseActual: null,
  respuestaUsuario: "",
  analisis: null,
  rondaActual: 0,
  error: null,
};

export function usePractica() {
  const [state, setState] = useState<PracticaState>(ESTADO_INICIAL);

  function setEstado(estado: EstadoPractica) {
    setState((s) => ({ ...s, estado, error: null }));
  }

  function setError(error: string) {
    setState((s) => ({ ...s, error, estado: s.estado }));
  }

  const empezar = useCallback(async () => {
    setState((s) => ({ ...s, estado: "loading_frase", error: null, rondaActual: 0 }));

    // Crear sesión
    let sesionId: string;
    try {
      const res = await fetch("/api/sesion", { method: "POST" });
      if (!res.ok) throw new Error("Error al crear sesión");
      const data = await res.json();
      sesionId = data.sesionId;
    } catch {
      setError("No se pudo iniciar la sesión. Inténtalo de nuevo.");
      setEstado("idle");
      return;
    }

    // Obtener primera frase
    try {
      const res = await fetch("/api/frase");
      if (!res.ok) throw new Error("Error al obtener frase");
      const data = await res.json();

      setState((s) => ({
        ...s,
        estado: "esperando_respuesta",
        sesionId,
        fraseActual: data.frase,
        respuestaUsuario: "",
        analisis: null,
        rondaActual: 1,
        error: null,
      }));
    } catch {
      setError("No se pudo cargar la frase. Inténtalo de nuevo.");
      setEstado("idle");
    }
  }, []);

  const analizarRespuesta = useCallback(async (respuesta: string) => {
    if (!state.fraseActual || !state.sesionId) return;

    setState((s) => ({
      ...s,
      estado: "analizando",
      respuestaUsuario: respuesta,
      error: null,
    }));

    try {
      const res = await fetch("/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frase: state.fraseActual,
          respuesta,
        }),
      });

      if (!res.ok) throw new Error("Error al analizar");
      const analisis: AnalisisResult = await res.json();

      // Guardar la ronda en background
      fetch(`/api/sesion/${state.sesionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "ronda",
          frase: state.fraseActual,
          respuesta,
          puntuacion: analisis.puntuacion,
          sugerencias: analisis.sugerencias,
        }),
      }).catch(console.error);

      setState((s) => ({
        ...s,
        estado: "mostrando_resultado",
        analisis,
        error: null,
      }));
    } catch {
      setError("No se pudo analizar tu respuesta. Inténtalo de nuevo.");
      setEstado("esperando_respuesta");
    }
  }, [state.fraseActual, state.sesionId]);

  const siguienteFrase = useCallback(async () => {
    if (!state.sesionId) return;

    setEstado("loading_frase");

    try {
      const res = await fetch("/api/frase");
      if (!res.ok) throw new Error("Error al obtener frase");
      const data = await res.json();

      setState((s) => ({
        ...s,
        estado: "esperando_respuesta",
        fraseActual: data.frase,
        respuestaUsuario: "",
        analisis: null,
        rondaActual: s.rondaActual + 1,
        error: null,
      }));
    } catch {
      setError("No se pudo cargar la siguiente frase.");
      setEstado("mostrando_resultado");
    }
  }, [state.sesionId]);

  const terminar = useCallback(async () => {
    if (state.sesionId) {
      fetch(`/api/sesion/${state.sesionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "cerrar" }),
      }).catch(console.error);
    }
    setState(ESTADO_INICIAL);
  }, [state.sesionId]);

  return {
    ...state,
    empezar,
    analizarRespuesta,
    siguienteFrase,
    terminar,
  };
}
