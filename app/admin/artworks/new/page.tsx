import Link from "next/link";
import { createArtworkAction } from "../../actions";
import ArtworkForm from "../ArtworkForm";

export default function NewArtworkPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/artworks"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← artworks
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">new artwork</h1>
      <ArtworkForm action={createArtworkAction} submitLabel="create" />
    </section>
  );
}
