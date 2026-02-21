export type EstadoPractica =
  | "idle"
  | "loading_frase"
  | "esperando_respuesta"
  | "analizando"
  | "mostrando_resultado";

export interface AnalisisResult {
  puntuacion: number;
  sugerencias: string[];
}

export interface Round {
  id: string;
  frase: string;
  respuesta: string;
  puntuacion: number;
  sugerencias: string[];
  created_at: string;
}

export interface Session {
  id: string;
  started_at: string;
  ended_at: string | null;
  total_rounds: number;
  avg_score: number | null;
  rounds?: Round[];
}

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface PracticaState {
  estado: EstadoPractica;
  sesionId: string | null;
  fraseActual: string | null;
  respuestaUsuario: string;
  analisis: AnalisisResult | null;
  rondaActual: number;
  error: string | null;
}
