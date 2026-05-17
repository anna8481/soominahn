import Image from "next/image";
import Link from "next/link";
import { getAdminClient } from "@/lib/supabase/admin";
import type { Artwork } from "@/lib/types";
import { deleteArtworkAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminArtworksPage() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("year", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const artworks = (data ?? []) as Artwork[];

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
        <p className="mt-6 text-sm text-red-600">Error: {error.message}</p>
      )}

      {artworks.length === 0 ? (
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
                  href={`/admin/artworks/${a.id}`}
                  className="text-neutral-700 hover:text-neutral-900 underline"
                >
                  edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteArtworkAction(a.id);
                  }}
                >
                  <button className="text-red-600 hover:text-red-800">
                    delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
