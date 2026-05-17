import Link from "next/link";
import type { CVEntry } from "@/lib/types";
import { CV_SECTIONS } from "@/lib/types";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<CVEntry>;
  submitLabel: string;
};

export default function CVForm({ action, initial, submitLabel }: Props) {
  return (
    <form action={action} className="mt-8 space-y-5 text-sm">
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

      <div className="grid grid-cols-3 gap-4">
        <label className="block">
          <div className="text-neutral-600 mb-1">Year</div>
          <input
            name="year"
            type="number"
            defaultValue={initial?.year ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
        <label className="block">
          <div className="text-neutral-600 mb-1">Year end</div>
          <input
            name="year_end"
            type="number"
            defaultValue={initial?.year_end ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
          />
        </label>
        <label className="block">
          <div className="text-neutral-600 mb-1">Order</div>
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

      <label className="block">
        <div className="text-neutral-600 mb-1">Location / Venue</div>
        <input
          name="location"
          type="text"
          defaultValue={initial?.location ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
      </label>

      <label className="block">
        <div className="text-neutral-600 mb-1">Detail</div>
        <textarea
          name="detail"
          rows={3}
          defaultValue={initial?.detail ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900"
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-700"
        >
          {submitLabel}
        </button>
        <Link href="/admin/cv" className="text-neutral-500 hover:text-neutral-900">
          cancel
        </Link>
      </div>
    </form>
  );
}
