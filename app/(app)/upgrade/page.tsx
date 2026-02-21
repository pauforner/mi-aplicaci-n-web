import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UpgradeButton from "@/components/upgrade/UpgradeButton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Pro — Practica la Asertividad",
};

const FEATURES = [
  "Sesiones de práctica ilimitadas",
  "Historial completo de sesiones",
  "Análisis detallado con IA",
  "Sugerencias personalizadas",
];

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const isPro = profile?.subscription_tier === "pro";

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl text-warm-900">
          Desbloquea el plan Pro
        </h1>
        <p className="text-warm-500 font-body text-sm mt-1 leading-relaxed">
          Accede a todas las funciones y lleva tu asertividad al siguiente nivel.
        </p>
      </div>

      <Card variant="sage" padding="lg" className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10 text-8xl select-none pointer-events-none"
          aria-hidden
        >
          🌿
        </div>

        <div className="flex flex-col gap-6 relative">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl text-sage-700">€0</span>
            <span className="text-warm-500 font-body text-sm">acceso completo</span>
          </div>

          <ul className="flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm font-body text-warm-700"
              >
                <span className="w-5 h-5 rounded-full bg-sage-200 flex items-center justify-center text-sage-700 text-xs flex-shrink-0">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {isPro ? (
            <div className="flex items-center gap-3 bg-sage-100 border border-sage-200 rounded-2xl px-4 py-3">
              <Badge variant="emerald">Activo</Badge>
              <span className="text-sm font-body text-sage-700">
                Ya tienes el plan Pro. ¡Gracias!
              </span>
            </div>
          ) : (
            <UpgradeButton />
          )}
        </div>
      </Card>

      {!isPro && (
        <p className="text-center text-xs text-warm-400 font-body">
          Pago seguro gestionado por Stripe. En modo test, usa la tarjeta{" "}
          <code className="font-mono bg-cream-100 px-1 rounded">
            4242 4242 4242 4242
          </code>
          .
        </p>
      )}
    </div>
  );
}
