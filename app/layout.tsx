import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soomin Ahn",
  description: "Soomin Ahn — artist portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <header className="border-b border-neutral-200">
          <div className="mx-auto max-w-5xl px-6 py-6 flex items-baseline justify-between">
            <Link href="/" className="text-lg tracking-wide font-medium lowercase">
              soomin ahn
            </Link>
            <nav className="flex gap-6 text-sm text-neutral-600">
              <Link href="/" className="hover:text-neutral-900">home</Link>
              <Link href="/work" className="hover:text-neutral-900">work</Link>
              <Link href="/cv" className="hover:text-neutral-900">cv</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-neutral-200 mt-16">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-neutral-500 flex justify-between">
            <span>© {new Date().getFullYear()} Soomin Ahn</span>
            <Link href="/admin" className="hover:text-neutral-800">admin</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
