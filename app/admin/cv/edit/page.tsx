"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase/public";
import type { CVEntry } from "@/lib/types";
import CVForm from "../CVForm";
import { useRequireAuth } from "../../useRequireAuth";

function EditCV() {
  const auth = useRequireAuth();
  const params = useSearchParams();
  const id = params.get("id");

  const [entry, setEntry] = useState<CVEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth !== "authed" || !id) return;
    (async () => {
      const { data, error } = await getSupabase()
        .from("cv_entries")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError(error.message);
        return;
      }
      setEntry(data as CVEntry);
    })();
  }, [auth, id]);

  if (auth !== "authed") {
    return <p className="text-sm text-neutral-400">…</p>;
  }
  if (!id) {
    return <p className="text-sm text-red-600">Missing ?id</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  if (!entry) {
    return <p className="text-sm text-neutral-400">…</p>;
  }

  return <CVForm initial={entry} submitLabel="save" />;
}

export default function EditCVEntryPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/cv"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← cv entries
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">edit cv entry</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-neutral-400">…</p>}>
        <EditCV />
      </Suspense>
    </section>
  );
}
