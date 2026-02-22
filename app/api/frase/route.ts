import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI, MODEL } from "@/lib/openai/client";
import {
  SYSTEM_PROMPT_FRASE,
  USER_PROMPT_FRASE,
} from "@/lib/prompts/generarFrase";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT_FRASE },
        { role: "user", content: USER_PROMPT_FRASE },
      ],
      max_completion_tokens: 2000,
    });

    const frase = completion.choices[0]?.message?.content?.trim();

    if (!frase) {
      throw new Error("La IA no devolvió ninguna frase");
    }

    return NextResponse.json({ frase });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/frase] Error:", msg);
    return NextResponse.json(
      { error: `Error al generar la frase: ${msg}` },
      { status: 500 }
    );
  }
}
