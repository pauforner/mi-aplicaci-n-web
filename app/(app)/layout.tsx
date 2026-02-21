import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-texture">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-cream-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-display text-warm-900 font-medium hidden sm:block">
              Practica la Asertividad
            </span>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              href="/practica"
              className="px-3 py-1.5 text-sm font-body font-medium text-warm-700 hover:text-warm-900 hover:bg-cream-100 rounded-xl transition-colors"
            >
              Practicar
            </Link>
            <Link
              href="/historial"
              className="px-3 py-1.5 text-sm font-body font-medium text-warm-700 hover:text-warm-900 hover:bg-cream-100 rounded-xl transition-colors"
            >
              Historial
            </Link>
            <div className="w-px h-4 bg-cream-300 mx-1" />
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
