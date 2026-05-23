"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase/public";

type AuthState = "loading" | "authed" | "anon";

export function useRequireAuth(): AuthState {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setState("authed");
      } else {
        setState("anon");
        const params = new URLSearchParams({ next: pathname ?? "/admin" });
        router.replace(`/admin/login?${params.toString()}`);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) {
        setState("authed");
      } else {
        setState("anon");
        router.replace("/admin/login");
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router, pathname]);

  return state;
}
