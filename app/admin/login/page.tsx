import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-xl font-light lowercase">admin</h1>
      <Suspense fallback={<div className="mt-8 text-sm text-neutral-500">…</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
