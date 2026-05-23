"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ARTWORK_BUCKET, getSupabase } from "@/lib/supabase/public";
import type { Artwork } from "@/lib/types";

type Props = {
  initial?: Artwork;
  submitLabel: string;
};

export default function ArtworkForm({ initial, submitLabel }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadImageIfAny(file: File | null): Promise<string | null> {
    if (!file || file.size === 0) return null;
    const supabase = getSupabase();
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from(ARTWORK_BUCKET)
      .upload(key, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    const { data } = supabase.storage.from(ARTWORK_BUCKET).getPublicUrl(key);
    return data.publicUrl;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      const year = Number(fd.get("year"));
      const title = String(fd.get("title") ?? "").trim();
      if (!Number.isFinite(year) || year < 1900 || year > 2100) {
        throw new Error("Year must be a valid number");
      }
      if (!title) throw new Error("Title is required");

      const fields = {
        year,
        title,
        statement: String(fd.get("statement") ?? "").trim() || null,
        medium: String(fd.get("medium") ?? "").trim() || null,
        dimensions: String(fd.get("dimensions") ?? "").trim() || null,
        featured: fd.get("featured") === "on",
        display_order: Number(fd.get("display_order") || 0),
      };
      const file = fd.get("image") as File | null;
      const newUrl = await uploadImageIfAny(file);

      const supabase = getSupabase();
      if (initial) {
        const patch: Record<string, unknown> = { ...fields };
        if (newUrl) patch.image_url = newUrl;
        const { error } = await supabase
          .from("artworks")
          .update(patch)
          .eq("id", initial.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("artworks")
          .insert({ ...fields, image_url: newUrl });
        if (error) throw new Error(error.message);
      }
      router.push("/admin/artworks");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <div className="text-neutral-600 mb-1">Year *</div>
          <input
            name="year"
            type="number"
            required
            defaultValue={initial?.year ?? new Date().getFullYear()}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
        <label className="block">
          <div className="text-neutral-600 mb-1">Display order</div>
          <input
            name="display_order"
            type="number"
            defaultValue={initial?.display_order ?? 0}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
      </div>

      <label className="block">
        <div className="text-neutral-600 mb-1">Title *</div>
        <input
          name="title"
          type="text"
          required
          defaultValue={initial?.title ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <div className="text-neutral-600 mb-1">Medium</div>
          <input
            name="medium"
            type="text"
            placeholder="oil on canvas"
            defaultValue={initial?.medium ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
        <label className="block">
          <div className="text-neutral-600 mb-1">Dimensions</div>
          <input
            name="dimensions"
            type="text"
            placeholder="120 x 90 cm"
            defaultValue={initial?.dimensions ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
      </div>

      <label className="block">
        <div className="text-neutral-600 mb-1">Statement</div>
        <textarea
          name="statement"
          rows={5}
          defaultValue={initial?.statement ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial?.featured ?? false}
        />
        <span>Show in home carousel</span>
      </label>

      <label className="block">
        <div className="text-neutral-600 mb-1">
          Image {initial?.image_url ? "(leave empty to keep current)" : ""}
        </div>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full text-sm"
        />
        {initial?.image_url && (
          <div className="mt-2 text-xs text-neutral-500 truncate">
            current: {initial.image_url}
          </div>
        )}
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-700 disabled:opacity-50"
        >
          {pending ? "..." : submitLabel}
        </button>
        <Link
          href="/admin/artworks"
          className="text-neutral-500 hover:text-neutral-900"
        >
          cancel
        </Link>
      </div>
    </form>
  );
}
