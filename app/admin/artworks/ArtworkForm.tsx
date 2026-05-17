import Link from "next/link";
import type { Artwork } from "@/lib/types";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Artwork>;
  submitLabel: string;
};

export default function ArtworkForm({ action, initial, submitLabel }: Props) {
  return (
    <form action={action} className="mt-8 space-y-5 text-sm">
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

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-700"
        >
          {submitLabel}
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
