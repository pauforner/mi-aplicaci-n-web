import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({ user_id: user.id })
    .select("id")
    .single();

  if (error) {
    console.error("[/api/sesion POST] Error:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión" },
      { status: 500 }
    );
  }

  return NextResponse.json({ sesionId: data.id }, { status: 201 });
}
