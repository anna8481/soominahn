"use client";

import Link from "next/link";
import CVForm from "../CVForm";
import { useRequireAuth } from "../../useRequireAuth";

export default function NewCVEntryPage() {
  const auth = useRequireAuth();
  if (auth !== "authed") {
    return (
      <section className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-neutral-400">…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/cv"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← cv entries
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">new cv entry</h1>
      <CVForm submitLabel="create" />
    </section>
  );
}
