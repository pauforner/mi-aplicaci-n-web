import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, MODEL } from "@/lib/openai/client";
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
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT_FRASE },
        { role: "user", content: USER_PROMPT_FRASE },
      ],
      temperature: 1.0,
      max_tokens: 100,
      presence_penalty: 0.8,
    });

    const frase = completion.choices[0]?.message?.content?.trim();

    if (!frase) {
      throw new Error("La IA no devolvió ninguna frase");
    }

    return NextResponse.json({ frase });
  } catch (error) {
    console.error("[/api/frase] Error:", error);
    return NextResponse.json(
      { error: "Error al generar la frase" },
      { status: 500 }
    );
  }
}
