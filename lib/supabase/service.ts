import { createClient } from "@supabase/supabase-js";

// Cliente con service_role — bypasa RLS.
// SOLO usar en API routes server-side (webhook, jobs). Nunca en cliente ni middleware.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
