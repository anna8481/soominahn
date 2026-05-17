import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import type { CVEntry } from "@/lib/types";
import { updateCVEntryAction } from "../../actions";
import CVForm from "../CVForm";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditCVEntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("cv_entries")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) notFound();
  const entry = data as CVEntry;

  const action = async (formData: FormData) => {
    "use server";
    await updateCVEntryAction(id, formData);
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/cv"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← cv entries
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">edit cv entry</h1>
      <CVForm action={action} initial={entry} submitLabel="save" />
    </section>
  );
}
