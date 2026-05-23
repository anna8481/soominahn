"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/public";
import type { Artwork } from "@/lib/types";
import { useRequireAuth } from "../useRequireAuth";

export default function AdminArtworksPage() {
  const auth = useRequireAuth();
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("year", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      return;
    }
    setArtworks((data ?? []) as Artwork[]);
  }

  useEffect(() => {
    if (auth === "authed") load();
  }, [auth]);

  async function onDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
    const { error } = await getSupabase().from("artworks").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  if (auth !== "authed") {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-neutral-400">…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            ← admin
          </Link>
          <h1 className="mt-1 text-xl font-light lowercase">artworks</h1>
        </div>
        <Link
          href="/admin/artworks/new"
          className="bg-neutral-900 text-white px-3 py-1.5 text-sm hover:bg-neutral-700"
        >
          + new
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">Error: {error}</p>
      )}

      {artworks === null ? (
        <p className="mt-12 text-sm text-neutral-400">…</p>
      ) : artworks.length === 0 ? (
        <p className="mt-12 text-sm text-neutral-500">No artworks yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {artworks.map((a) => (
            <li key={a.id} className="py-3 flex items-center gap-4">
              <div className="w-16 h-16 bg-neutral-100 relative shrink-0 overflow-hidden">
                {a.image_url && (
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-neutral-500 tabular-nums">
                    {a.year}
                  </span>
                  <span className="text-sm truncate">{a.title}</span>
                  {a.featured && (
                    <span className="text-[10px] uppercase tracking-wider text-neutral-900 border border-neutral-900 px-1">
                      featured
                    </span>
                  )}
                </div>
                {a.medium && (
                  <div className="text-xs text-neutral-500 truncate">
                    {a.medium}
                    {a.dimensions ? ` · ${a.dimensions}` : ""}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link
                  href={`/admin/artworks/edit?id=${a.id}`}
                  className="text-neutral-700 hover:text-neutral-900 underline"
                >
                  edit
                </Link>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
