"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/public";
import type { CVEntry, CVSection } from "@/lib/types";
import { CV_SECTIONS } from "@/lib/types";

type Props = {
  initial?: CVEntry;
  submitLabel: string;
};

const ALLOWED: CVSection[] = [
  "contact",
  "education",
  "solo",
  "group",
  "interview",
];

export default function CVForm({ initial, submitLabel }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      const section = String(fd.get("section") ?? "") as CVSection;
      if (!ALLOWED.includes(section)) throw new Error("Invalid section");

      const yearRaw = String(fd.get("year") ?? "").trim();
      const year = yearRaw === "" ? null : Number(yearRaw);
      if (year !== null && !Number.isFinite(year)) {
        throw new Error("Year must be a number");
      }
      const yearEndRaw = String(fd.get("year_end") ?? "").trim();
      const yearEnd = yearEndRaw === "" ? null : Number(yearEndRaw);
      if (yearEnd !== null && !Number.isFinite(yearEnd)) {
        throw new Error("Year end must be a number");
      }
      const title = String(fd.get("title") ?? "").trim();
      if (!title) throw new Error("Title is required");

      const fields = {
        section,
        year,
        year_end: yearEnd,
        title,
        link: String(fd.get("link") ?? "").trim() || null,
        display_order: Number(fd.get("display_order") || 0),
      };

      const supabase = getSupabase();
      if (initial) {
        const { error } = await supabase
          .from("cv_entries")
          .update(fields)
          .eq("id", initial.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("cv_entries").insert(fields);
        if (error) throw new Error(error.message);
      }
      router.push("/admin/cv");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5 text-sm">
      <label className="block">
        <div className="text-neutral-600 mb-1">Section *</div>
        <select
          name="section"
          required
          defaultValue={initial?.section ?? "education"}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900 bg-white"
        >
          {CV_SECTIONS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <div className="text-neutral-600 mb-1">Title *</div>
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. Couleurs de Corée, Centre Culturel Coréen, Paris"
          defaultValue={initial?.title ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <div className="text-neutral-600 mb-1">Year</div>
          <input
            name="year"
            type="number"
            placeholder="2025"
            defaultValue={initial?.year ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
        <label className="block">
          <div className="text-neutral-600 mb-1">
            Year end <span className="text-neutral-400">(범위일 때만)</span>
          </div>
          <input
            name="year_end"
            type="number"
            placeholder="2027"
            defaultValue={initial?.year_end ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
      </div>

      <label className="block">
        <div className="text-neutral-600 mb-1">Link (optional)</div>
        <input
          name="link"
          type="url"
          placeholder="https://…  (or mailto:you@example.com)"
          defaultValue={initial?.link ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
      </label>

      <label className="block w-32">
        <div className="text-neutral-600 mb-1">Display order</div>
        <input
          name="display_order"
          type="number"
          defaultValue={initial?.display_order ?? 0}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
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
        <Link href="/admin/cv" className="text-neutral-500 hover:text-neutral-900">
          cancel
        </Link>
      </div>
    </form>
  );
}
