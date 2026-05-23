"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/public";
import type { Artwork } from "@/lib/types";
import HomeCarousel from "./HomeCarousel";

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    (async () => {
      const { data: featured } = await supabase
        .from("artworks")
        .select("*")
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .order("year", { ascending: false });

      let list = (featured ?? []) as Artwork[];
      if (list.length === 0) {
        const { data: recent } = await supabase
          .from("artworks")
          .select("*")
          .order("year", { ascending: false })
          .order("display_order", { ascending: true })
          .limit(8);
        list = (recent ?? []) as Artwork[];
      }
      setArtworks(list);
    })();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {artworks === null ? (
        <div className="py-32 text-center text-sm text-neutral-400">…</div>
      ) : artworks.length === 0 ? (
        <div className="py-32 text-center text-sm text-neutral-500">
          No works yet.
        </div>
      ) : (
        <HomeCarousel artworks={artworks} />
      )}
    </section>
  );
}
