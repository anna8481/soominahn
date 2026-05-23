"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/public";
import type { CVEntry, CVSection } from "@/lib/types";
import { CV_SECTIONS, formatYearRange } from "@/lib/types";

export default function CVPage() {
  const [entries, setEntries] = useState<CVEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    (async () => {
      const { data, error } = await supabase
        .from("cv_entries")
        .select("*")
        .order("year", { ascending: false, nullsFirst: false })
        .order("display_order", { ascending: true });
      if (error) {
        setError(error.message);
        return;
      }
      setEntries((data ?? []) as CVEntry[]);
    })();
  }, []);

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-2xl font-light">CV</h1>
        <p className="mt-6 text-sm text-red-600">Failed to load: {error}</p>
      </section>
    );
  }

  if (entries === null) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-2xl font-light">CV</h1>
        <p className="mt-8 text-sm text-neutral-400">…</p>
      </section>
    );
  }

  const bySection = new Map<CVSection, CVEntry[]>();
  for (const e of entries) {
    if (!bySection.has(e.section)) bySection.set(e.section, []);
    bySection.get(e.section)!.push(e);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-2xl font-light">CV</h1>

      {entries.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No CV entries yet.</p>
      ) : (
        <div className="mt-12 space-y-12">
          {CV_SECTIONS.map(({ key, label }) => {
            const rows = bySection.get(key);
            if (!rows || rows.length === 0) return null;
            return (
              <section key={key}>
                <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
                  {label}
                </h2>
                <ul className="space-y-2 text-sm">
                  {rows.map((e) => (
                    <li
                      key={e.id}
                      className="grid grid-cols-[96px_1fr] gap-4"
                    >
                      <span className="text-neutral-500 tabular-nums whitespace-nowrap">
                        {formatYearRange(e.year, e.year_end)}
                      </span>
                      <span className="text-neutral-900">
                        {e.link ? (
                          <a
                            href={e.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-60"
                          >
                            {e.title}
                            <span className="ml-1 text-neutral-400">↗</span>
                          </a>
                        ) : (
                          e.title
                        )}
                      </span>
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
