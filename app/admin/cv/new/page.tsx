import Link from "next/link";
import { createCVEntryAction } from "../../actions";
import CVForm from "../CVForm";

export default function NewCVEntryPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/cv"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← cv entries
      </Link>
      <h1 className="mt-1 text-xl font-light lowercase">new cv entry</h1>
      <CVForm action={createCVEntryAction} submitLabel="create" />
    </section>
  );
}
