"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Artwork } from "@/lib/types";

export default function HomeCarousel({ artworks }: { artworks: Artwork[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(artworks.length - 1, i));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  }, [artworks.length]);

  // Track which slide is in view (based on scroll position)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const children = Array.from(track.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      const center = track.scrollLeft + track.clientWidth / 2;
      for (let i = 0; i < children.length; i++) {
        const c = children[i];
        const mid = c.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      setIndex(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scrollTo(index + 1);
      else if (e.key === "ArrowLeft") scrollTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, scrollTo]);

  const current = artworks[index];

  return (
    <div className="space-y-6">
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {artworks.map((a) => (
            <div
              key={a.id}
              className="snap-center shrink-0 w-full flex items-center justify-center"
            >
              <div className="relative w-full aspect-[4/3] bg-neutral-100">
                {a.image_url && (
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-contain"
                    priority={artworks.indexOf(a) === 0}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {artworks.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollTo(index - 1)}
              disabled={index === 0}
              aria-label="previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/80 backdrop-blur border border-neutral-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollTo(index + 1)}
              disabled={index === artworks.length - 1}
              aria-label="next"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/80 backdrop-blur border border-neutral-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </>
        )}
      </div>

      {current && (
        <div className="text-sm space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-neutral-900">{current.title}</span>
            <span className="text-neutral-500 tabular-nums">{current.year}</span>
          </div>
          {current.dimensions && (
            <div className="text-neutral-500">{current.dimensions}</div>
          )}
          {current.medium && (
            <div className="text-neutral-500">{current.medium}</div>
          )}
          {current.statement && (
            <p className="pt-2 text-neutral-700 leading-relaxed max-w-2xl whitespace-pre-line">
              {current.statement}
            </p>
          )}
        </div>
      )}

      {artworks.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-2">
          {artworks.map((a, i) => (
            <button
              key={a.id}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
