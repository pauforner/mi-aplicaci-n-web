import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: sesionId } = await params;

  let body: {
    tipo: "ronda" | "cerrar";
    frase?: string;
    respuesta?: string;
    puntuacion?: number;
    sugerencias?: string[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (body.tipo === "ronda") {
    const { frase, respuesta, puntuacion, sugerencias } = body;

    if (!frase || !respuesta || puntuacion == null || !sugerencias) {
      return NextResponse.json(
        { error: "Faltan campos para guardar la ronda" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("rounds").insert({
      session_id: sesionId,
      user_id: user.id,
      frase,
      respuesta,
      puntuacion,
      sugerencias,
    });

    if (error) {
      console.error("[/api/sesion/[id] ronda] Error:", error);
      return NextResponse.json(
        { error: "Error al guardar la ronda" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (body.tipo === "cerrar") {
    // Calcular stats de las rondas
    const { data: rounds, error: roundsError } = await supabase
      .from("rounds")
      .select("puntuacion")
      .eq("session_id", sesionId)
      .eq("user_id", user.id);

    if (roundsError) {
      console.error("[/api/sesion/[id] cerrar] Error rounds:", roundsError);
      return NextResponse.json(
        { error: "Error al cerrar la sesión" },
        { status: 500 }
      );
    }

    const totalRounds = rounds?.length ?? 0;
    const avgScore =
      totalRounds > 0
        ? rounds!.reduce((acc, r) => acc + r.puntuacion, 0) / totalRounds
        : null;

    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        ended_at: new Date().toISOString(),
        total_rounds: totalRounds,
        avg_score: avgScore,
      })
      .eq("id", sesionId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[/api/sesion/[id] cerrar] Error update:", updateError);
      return NextResponse.json(
        { error: "Error al cerrar la sesión" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Tipo de operación inválido" }, { status: 400 });
}
