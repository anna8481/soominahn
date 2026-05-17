import Link from "next/link";
import { logoutAction } from "./actions";

export default function AdminHome() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light lowercase">admin</h1>
        <form action={logoutAction}>
          <button className="text-sm text-neutral-500 hover:text-neutral-900">
            logout
          </button>
        </form>
      </div>

      <ul className="mt-10 space-y-3">
        <li>
          <Link
            href="/admin/artworks"
            className="block border border-neutral-200 hover:border-neutral-900 px-5 py-4 text-sm"
          >
            <div className="font-medium">Artworks</div>
            <div className="text-neutral-500 mt-0.5">
              Manage the home carousel + /work yearly grid
            </div>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/cv"
            className="block border border-neutral-200 hover:border-neutral-900 px-5 py-4 text-sm"
          >
            <div className="font-medium">CV entries</div>
            <div className="text-neutral-500 mt-0.5">
              Education, exhibitions, awards, info
            </div>
          </Link>
        </li>
      </ul>
    </section>
  );
}
