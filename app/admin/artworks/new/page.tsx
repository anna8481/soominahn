"use client";

import Link from "next/link";
import ArtworkForm from "../ArtworkForm";
import { useRequireAuth } from "../../useRequireAuth";

export default function NewArtworkPage() {
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
        href="/admin/artworks"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← artworks
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">new artwork</h1>
      <ArtworkForm submitLabel="create" />
    </section>
  );
}
