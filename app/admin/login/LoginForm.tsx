"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase/public";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(next.startsWith("/admin") ? next : "/admin");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <input
        type="email"
        name="email"
        placeholder="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-neutral-900 text-white py-2 text-sm hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? "..." : "sign in"}
      </button>
    </form>
  );
}
