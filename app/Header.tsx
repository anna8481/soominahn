import Link from "next/link";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-lg tracking-wide font-medium">
          Soomin Ahn
        </Link>

        <nav className="flex gap-4 sm:gap-6 text-sm text-neutral-600">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-neutral-900">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
