import { getPublicClient } from "@/lib/supabase/public";
import type { Artwork } from "@/lib/types";
import HomeCarousel from "./HomeCarousel";

export const revalidate = 60;

export default async function Home() {
  const supabase = getPublicClient();
  // Prefer featured artworks for the carousel; fall back to most recent if
  // nothing is flagged featured.
  const { data: featured } = await supabase
    .from("artworks")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .order("year", { ascending: false });

  let artworks = (featured ?? []) as Artwork[];
  if (artworks.length === 0) {
    const { data: recent } = await supabase
      .from("artworks")
      .select("*")
      .order("year", { ascending: false })
      .order("display_order", { ascending: true })
      .limit(8);
    artworks = (recent ?? []) as Artwork[];
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {artworks.length === 0 ? (
        <div className="py-32 text-center text-sm text-neutral-500">
          No works yet.
        </div>
      ) : (
        <HomeCarousel artworks={artworks} />
      )}
    </section>
  );
}
