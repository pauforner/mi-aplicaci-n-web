import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¡Ya eres Pro! — Practica la Asertividad",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { session_id } = await searchParams;

  // Verificar que el session_id pertenece a este usuario
  let sessionValid = false;
  if (session_id) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
      sessionValid =
        stripeSession.metadata?.supabase_user_id === user.id &&
        stripeSession.status === "complete";
    } catch {
      // session_id inválido — sessionValid queda false
    }
  }

  if (!sessionValid) redirect("/upgrade");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const isPro = profile?.subscription_tier === "pro";

  return (
    <div className="flex flex-col items-center gap-8 py-8 animate-fade-up">
      <div className="w-20 h-20 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center shadow-sage animate-scale-in">
        <span className="text-4xl" aria-hidden>🌿</span>
      </div>

      <div className="text-center">
        <h1 className="font-display text-3xl text-warm-900">
          {isPro ? "¡Ya eres Pro!" : "Procesando tu acceso…"}
        </h1>
        <p className="text-warm-500 font-body text-sm mt-2 leading-relaxed max-w-sm">
          {isPro
            ? "Tu plan Pro está activo. Disfruta de acceso completo a todas las funciones."
            : "Tu pago se está procesando. En unos segundos tendrás acceso completo."}
        </p>
      </div>

      {isPro && <Badge variant="emerald">Plan Pro Activo</Badge>}

      <Card variant="sage" padding="md" className="w-full max-w-sm text-center">
        <p className="text-sm font-body text-sage-700 leading-relaxed">
          Tu cuenta ha sido actualizada. Ahora puedes practicar sin límites y
          revisar tu historial completo.
        </p>
      </Card>

      <Link href="/practica">
        <Button variant="primary" size="lg">
          Empezar a practicar
        </Button>
      </Link>
    </div>
  );
}
