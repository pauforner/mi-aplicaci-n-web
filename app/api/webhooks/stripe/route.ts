import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Sin firma Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] Firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const supabaseUserId = session.metadata?.supabase_user_id;

  if (!supabaseUserId) {
    console.error("[webhook] checkout.session.completed sin supabase_user_id en metadata");
    return NextResponse.json({ error: "Metadata incompleta" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_tier: "pro",
      subscription_updated_at: new Date().toISOString(),
    })
    .eq("id", supabaseUserId);

  if (error) {
    console.error("[webhook] Error actualizando perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar perfil" },
      { status: 500 }
    );
  }

  console.log(`[webhook] Usuario ${supabaseUserId} actualizado a Pro`);
  return NextResponse.json({ received: true }, { status: 200 });
}
