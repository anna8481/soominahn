import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import type { Artwork } from "@/lib/types";
import { updateArtworkAction } from "../../actions";
import ArtworkForm from "../ArtworkForm";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) notFound();
  const artwork = data as Artwork;

  const action = async (formData: FormData) => {
    "use server";
    await updateArtworkAction(id, formData);
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/artworks"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← artworks
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">edit artwork</h1>
      <ArtworkForm
        action={action}
        initial={artwork}
        submitLabel="save"
      />
    </section>
  );
}
