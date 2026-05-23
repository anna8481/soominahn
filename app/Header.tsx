"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
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
          aria-label={open ? "close menu" : "open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden relative w-6 h-6 -mr-1"
        >
          <span
            className={`absolute left-0.5 right-0.5 top-1/2 h-px bg-neutral-900 transition-transform duration-200 ${
              open ? "rotate-45" : "-translate-y-[3px]"
            }`}
          />
          <span
            className={`absolute left-0.5 right-0.5 top-1/2 h-px bg-neutral-900 transition-transform duration-200 ${
              open ? "-rotate-45" : "translate-y-[3px]"
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-neutral-200">
          <ul className="mx-auto max-w-5xl px-6 py-2 flex flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-neutral-700 hover:text-neutral-900"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
