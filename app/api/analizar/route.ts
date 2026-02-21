import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, MODEL } from "@/lib/openai/client";
import {
  SYSTEM_PROMPT_ANALISIS,
  buildUserPromptAnalisis,
} from "@/lib/prompts/analizarRespuesta";
import { parseAnalisis } from "@/lib/utils/parseAnalisis";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { frase?: string; respuesta?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { frase, respuesta } = body;

  if (!frase?.trim() || !respuesta?.trim()) {
    return NextResponse.json(
      { error: "Faltan los campos frase y respuesta" },
      { status: 400 }
    );
  }

  if (respuesta.trim().length < 3) {
    return NextResponse.json(
      { error: "La respuesta es demasiado corta" },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT_ANALISIS },
        {
          role: "user",
          content: buildUserPromptAnalisis(frase.trim(), respuesta.trim()),
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
    const analisis = parseAnalisis(rawContent);

    return NextResponse.json(analisis);
  } catch (error) {
    console.error("[/api/analizar] Error:", error);
    return NextResponse.json(
      { error: "Error al analizar la respuesta" },
      { status: 500 }
    );
  }
}
