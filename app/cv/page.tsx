import { getPublicClient } from "@/lib/supabase/public";
import type { CVEntry, CVSection } from "@/lib/types";
import { CV_SECTIONS } from "@/lib/types";

export const revalidate = 60;

function formatYear(entry: CVEntry): string {
  if (entry.year == null) return "";
  if (entry.year_end && entry.year_end !== entry.year) {
    return `${entry.year}–${entry.year_end}`;
  }
  return String(entry.year);
}

export default async function CVPage() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("cv_entries")
    .select("*")
    .order("year", { ascending: false, nullsFirst: false })
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-light lowercase">cv</h1>
        <p className="mt-6 text-sm text-red-600">
          Failed to load: {error.message}
        </p>
      </section>
    );
  }

  const entries = (data ?? []) as CVEntry[];
  const bySection = new Map<CVSection, CVEntry[]>();
  for (const e of entries) {
    if (!bySection.has(e.section)) bySection.set(e.section, []);
    bySection.get(e.section)!.push(e);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-light lowercase">cv</h1>

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
                      className="grid grid-cols-[64px_1fr] gap-4"
                    >
                      <span className="text-neutral-500 tabular-nums">
                        {formatYear(e)}
                      </span>
                      <span className="text-neutral-900">
                        <span>{e.title}</span>
                        {e.location && (
                          <span className="text-neutral-500">
                            , {e.location}
                          </span>
                        )}
                        {e.detail && (
                          <span className="text-neutral-500">
                            {" "}— {e.detail}
                          </span>
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
