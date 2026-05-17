import { createClient } from "@supabase/supabase-js";

// Service role client — server-only. Bypasses RLS. Never expose to the browser.
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}

export const ARTWORK_BUCKET = "artworks";
