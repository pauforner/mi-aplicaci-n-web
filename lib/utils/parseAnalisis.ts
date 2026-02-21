import { AnalisisResult } from "@/types";

export function parseAnalisis(raw: string): AnalisisResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("La respuesta de la IA no es JSON válido");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Formato de respuesta inválido");
  }

  const obj = parsed as Record<string, unknown>;

  const puntuacion = Number(obj.puntuacion);
  if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 10) {
    throw new Error(`Puntuación inválida: ${obj.puntuacion}`);
  }

  if (!Array.isArray(obj.sugerencias) || obj.sugerencias.length === 0) {
    throw new Error("Sugerencias inválidas o vacías");
  }

  const sugerencias: string[] = obj.sugerencias
    .slice(0, 3)
    .map((s: unknown) => String(s).trim())
    .filter(Boolean);

  if (sugerencias.length === 0) {
    throw new Error("No se obtuvieron sugerencias válidas");
  }

  return { puntuacion, sugerencias };
}
