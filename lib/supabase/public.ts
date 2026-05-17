import { createClient } from "@supabase/supabase-js";

// Public (anon) client — safe for read-only access from server components.
// All writes go through lib/supabase/admin.ts (service role) inside server actions.
export function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}
