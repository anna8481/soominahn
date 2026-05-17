"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "../actions";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />
      <input
        type="password"
        name="password"
        placeholder="password"
        required
        autoFocus
        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
      />
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
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
