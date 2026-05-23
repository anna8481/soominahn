"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the fullscreen mobile menu is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg tracking-wide font-medium"
          onClick={() => setOpen(false)}
        >
          Soomin Ahn
        </Link>

        <nav className="hidden sm:flex gap-6 text-sm text-neutral-600">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-neutral-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="sm:hidden relative w-6 h-6 -mr-1"
        >
          <span className="absolute left-0.5 right-0.5 top-1/2 h-px bg-neutral-900 -translate-y-[3px]" />
          <span className="absolute left-0.5 right-0.5 top-1/2 h-px bg-neutral-900 translate-y-[3px]" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-white sm:hidden">
          <div className="mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg tracking-wide font-medium"
              onClick={() => setOpen(false)}
            >
              Soomin Ahn
            </Link>
            <button
              type="button"
              aria-label="close menu"
              onClick={() => setOpen(false)}
              className="relative w-6 h-6 -mr-1"
            >
              <span className="absolute left-0.5 right-0.5 top-1/2 h-px bg-neutral-900 rotate-45" />
              <span className="absolute left-0.5 right-0.5 top-1/2 h-px bg-neutral-900 -rotate-45" />
            </button>
          </div>

          <nav className="mx-auto w-full max-w-7xl px-6 mt-8">
            <ul className="flex flex-col gap-6 text-3xl font-light">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="hover:opacity-60"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
