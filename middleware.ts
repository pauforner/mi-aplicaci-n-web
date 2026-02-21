import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirigir usuarios autenticados fuera de las páginas de auth
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/practica", request.url));
  }

  // Proteger rutas de la app — redirigir a login si no está autenticado
  // Nota: /api/webhooks/stripe NO está aquí — Stripe lo llama sin sesión de usuario
  if (
    !user &&
    (pathname.startsWith("/practica") ||
      pathname.startsWith("/historial") ||
      pathname.startsWith("/upgrade") ||
      pathname.startsWith("/success"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
