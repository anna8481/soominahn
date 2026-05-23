"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/public";
import type { CVEntry, CVSection } from "@/lib/types";
import { CV_SECTIONS } from "@/lib/types";
import { useRequireAuth } from "../useRequireAuth";

export default function AdminCVPage() {
  const auth = useRequireAuth();
  const [entries, setEntries] = useState<CVEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await getSupabase()
      .from("cv_entries")
      .select("*")
      .order("year", { ascending: false, nullsFirst: false })
      .order("display_order", { ascending: true });
    if (error) {
      setError(error.message);
      return;
    }
    setEntries((data ?? []) as CVEntry[]);
  }

  useEffect(() => {
    if (auth === "authed") load();
  }, [auth]);

  async function onDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    const { error } = await getSupabase()
      .from("cv_entries")
      .delete()
      .eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  if (auth !== "authed") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-neutral-400">…</p>
      </section>
    );
  }

  const bySection = new Map<CVSection, CVEntry[]>();
  for (const e of entries ?? []) {
    if (!bySection.has(e.section)) bySection.set(e.section, []);
    bySection.get(e.section)!.push(e);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            ← admin
          </Link>
          <h1 className="mt-1 text-xl font-light lowercase">cv entries</h1>
        </div>
        <Link
          href="/admin/cv/new"
          className="bg-neutral-900 text-white px-3 py-1.5 text-sm hover:bg-neutral-700"
        >
          + new
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">Error: {error}</p>
      )}

      {entries === null ? (
        <p className="mt-12 text-sm text-neutral-400">…</p>
      ) : entries.length === 0 ? (
        <p className="mt-12 text-sm text-neutral-500">No entries yet.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {CV_SECTIONS.map(({ key, label }) => {
            const rows = bySection.get(key);
            if (!rows || rows.length === 0) return null;
            return (
              <section key={key}>
                <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
                  {label}
                </h2>
                <ul className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                  {rows.map((e) => (
                    <li
                      key={e.id}
                      className="py-2.5 flex items-center gap-4 text-sm"
                    >
                      <span className="w-12 text-neutral-500 tabular-nums">
                        {e.year ?? ""}
                      </span>
                      <span className="flex-1 min-w-0 truncate">
                        <span className="text-neutral-900">{e.title}</span>
                        {e.link && (
                          <span className="ml-1 text-neutral-400">↗</span>
                        )}
                      </span>
                      <Link
                        href={`/admin/cv/edit?id=${e.id}`}
                        className="text-neutral-700 hover:text-neutral-900 underline"
                      >
                        edit
                      </Link>
                      <button
                        onClick={() => onDelete(e.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        delete
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
