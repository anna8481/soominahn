import Image from "next/image";
import { getPublicClient } from "@/lib/supabase/public";
import type { Artwork } from "@/lib/types";

export const revalidate = 60;

export default async function WorkPage() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("year", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-light lowercase">work</h1>
        <p className="mt-6 text-sm text-red-600">
          Failed to load: {error.message}
        </p>
      </section>
    );
  }

  const artworks = (data ?? []) as Artwork[];
  const byYear = new Map<number, Artwork[]>();
  for (const a of artworks) {
    if (!byYear.has(a.year)) byYear.set(a.year, []);
    byYear.get(a.year)!.push(a);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-light lowercase">work</h1>

      {years.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No works yet.</p>
      ) : (
        <div className="mt-12 space-y-20">
          {years.map((year) => (
            <div
              key={year}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8"
            >
              <h2 className="text-lg font-medium text-neutral-500 tabular-nums">
                {year}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
                {byYear.get(year)!.map((a) => (
                  <li key={a.id} className="space-y-3">
                    {a.image_url ? (
                      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <Image
                          src={a.image_url}
                          alt={a.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-neutral-100" />
                    )}
                    <div className="text-sm space-y-1">
                      <div className="text-neutral-900">{a.title}</div>
                      {a.dimensions && (
                        <div className="text-neutral-500">{a.dimensions}</div>
                      )}
                      {a.medium && (
                        <div className="text-neutral-500">{a.medium}</div>
                      )}
                      {a.statement && (
                        <p className="pt-1 text-neutral-700 leading-relaxed whitespace-pre-line">
                          {a.statement}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
