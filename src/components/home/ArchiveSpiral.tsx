"use client";

import Link from "next/link";
import { useRef } from "react";
import { Art } from "@/components/page/Art";
import { useScrollProgress } from "@/lib/motion";

const ITEMS = [
  "Watch study", "Beauty identity", "Event poster", "Card kit", "Magazine covers", "Light installation",
  "Gift packaging", "Payment site", "Chocolate box", "Vinyl sleeve", "Chip visual", "Brochure",
  "Club poster", "Jar label", "Transit poster", "Print set", "Livery study", "Bottle caps",
];
const GAP = 520;

/** Pinned tunnel: archive pieces fly toward you along a spiral as you scroll. */
export function ArchiveSpiral() {
  const section = useRef<HTMLElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const title = useRef<HTMLDivElement>(null);

  useScrollProgress(
    section,
    (p) => {
      const travel = p * (ITEMS.length * GAP + 1200);
      tiles.current.forEach((t, i) => {
        if (!t) return;
        const z = -3600 - i * GAP + travel;
        const a = i * 0.95 + p * 2;
        const r = 30 + Math.min(1, (z + 3600) / 3600) * 8;
        const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.62;
        const o = z > 600 ? 0 : Math.max(0, Math.min(1, (z + 3600) / 1400)) * (z > 200 ? 1 - (z - 200) / 400 : 1);
        t.style.transform = `translate3d(calc(${x}vw - 50%), calc(${y}vh - 50%), ${z}px)`;
        t.style.opacity = String(o);
        t.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      if (title.current) title.current.style.transform = `scale(${1 + p * 0.25})`;
    },
    { pinned: true },
  );

  return (
    <section ref={section} className="relative h-[250svh]">
      <div className="sticky top-0 h-svh overflow-hidden [perspective:900px]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff00ff24,transparent_45%)]" />
        <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
          {ITEMS.map((label, i) => (
            <div key={label} ref={(el) => { tiles.current[i] = el; }} className="absolute top-0 left-0 w-[clamp(120px,13vw,220px)] will-change-transform" style={{ opacity: 0 }}>
              <Art variant={i} label={label} slot={`archive-${String(i + 1).padStart(2, "0")}`} sizes="260px" className="aspect-[4/5] rounded-[14px] ring-1 ring-line shadow-[0_30px_60px_-20px_#000]" />
              <p className="label mt-2 text-paper!">{label}</p>
            </div>
          ))}
        </div>
        <div ref={title} className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <h2 className="font-display text-display leading-[0.88] tracking-[-0.035em] [text-shadow:0_20px_80px_#000]">
            Every idea,
            <br />
            in orbit<span className="text-accent">.</span>
          </h2>
        </div>
        <div className="wrap absolute inset-x-0 top-[calc(var(--nav-h)+8px)] flex justify-between">
          <p className="label">From the archive</p>
          <p className="label">{ITEMS.length} pieces · identity, packaging, editorial, digital</p>
        </div>
        <div className="wrap absolute inset-x-0 bottom-8 flex justify-between">
          <p className="label">Selected studies from the studio archive.</p>
          <Link href="/work#gallery" className="link text-sm">See selected projects ↗</Link>
        </div>
      </div>
    </section>
  );
}
