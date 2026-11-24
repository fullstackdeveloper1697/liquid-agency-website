"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { Words } from "@/components/global/Words";
import { clamp, reducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

/** Placeholder client names. Swap for real logos (with permission) when you have them. */
const CLIENTS = [
  { n: "NORTHWIND", c: "Payments", s: "font-display tracking-[-0.04em]" },
  { n: "halo", c: "Events", s: "font-sans font-light text-[1.3em] tracking-[0.2em]" },
  { n: "Kilnworks", c: "Retail", s: "font-serif italic" },
  { n: "ORBIT/LABS", c: "Hardware", s: "font-mono text-[0.8em]" },
  { n: "Saltline", c: "Hospitality", s: "font-display italic" },
  { n: "MERIDIAN", c: "Travel", s: "font-sans tracking-[0.35em] text-[0.75em]" },
  { n: "vela.", c: "Fintech", s: "font-display lowercase" },
  { n: "Quarry & Co", c: "Architecture", s: "font-serif" },
  { n: "PULSE", c: "Media", s: "font-display italic tracking-[0.1em]" },
  { n: "ferro", c: "Automotive", s: "font-mono font-bold" },
  { n: "Nimbus", c: "Software", s: "font-sans font-semibold" },
  { n: "ATLAS RUN", c: "Sport", s: "font-display tracking-[0.05em] text-[0.8em]" },
  { n: "lumen", c: "Lighting", s: "font-sans font-light text-[1.2em] tracking-[0.12em]" },
  { n: "KORA", c: "Fashion", s: "font-display tracking-[0.3em] text-[0.8em]" },
  { n: "Brightside", c: "Energy", s: "font-serif italic" },
  { n: "NORD/AXIS", c: "Logistics", s: "font-mono text-[0.8em]" },
  { n: "tidal.", c: "Beverage", s: "font-display lowercase" },
  { n: "Paragon", c: "Real estate", s: "font-serif tracking-[0.06em]" },
  { n: "OPAL", c: "Beauty", s: "font-sans tracking-[0.4em] text-[0.75em]" },
  { n: "Copperline", c: "Telecom", s: "font-display italic" },
  { n: "sprout", c: "Food", s: "font-sans font-semibold lowercase" },
  { n: "VANTA", c: "Gaming", s: "font-display tracking-[0.12em]" },
  { n: "Hearth & Co", c: "Interiors", s: "font-serif" },
  { n: "ion", c: "Mobility", s: "font-mono font-bold text-[1.2em]" },
];

/** Logo wall: cells fly in, tilt toward the pointer, a magenta spotlight follows it. */
export function Clients() {
  const grid = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const g = grid.current!;
    const r = g.getBoundingClientRect();
    g.style.setProperty("--mx", `${e.clientX - r.left}px`);
    g.style.setProperty("--my", `${e.clientY - r.top}px`);
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-cell]");
    if (cell) {
      const c = cell.getBoundingClientRect();
      cell.style.setProperty("--tx", `${((e.clientY - c.top) / c.height - 0.5) * -14}deg`);
      cell.style.setProperty("--ty", `${((e.clientX - c.left) / c.width - 0.5) * 14}deg`);
    }
  };
  // Cells flip up in 3D in a diagonal order as the grid scrolls in (reference: .logos.is-js)
  useEffect(() => {
    const g = grid.current;
    if (!g) return;
    const cells = [...g.querySelectorAll<HTMLElement>("[data-cell]")];
    if (reducedMotion()) { cells.forEach((c) => c.classList.add("in")); return; }
    g.classList.add("is-js");
    const cols = () => getComputedStyle(g).gridTemplateColumns.split(" ").length || 6;
    let order: HTMLElement[] | null = null;
    let shown = 0;
    let raf = 0;
    const tick = () => {
      raf = 0;
      if (shown >= cells.length) return;
      const r = g.getBoundingClientRect();
      const k = innerHeight;
      if (r.top > k) return;
      if (!order) {
        const d = cols();
        order = cells.map((c, l) => ({ c, k: (l % d) + Math.floor(l / d) * 1.6 + (l % 2) * 0.3 })).sort((a, b) => a.k - b.k).map((x) => x.c);
      }
      const p = clamp((k * 0.95 - r.top) / (k * 0.45 + r.height * 0.55));
      const want = Math.ceil(p * cells.length);
      while (shown < want) {
        const c = order[shown];
        c.style.transitionDelay = `${(shown % 3) * 40}ms`;
        c.classList.add("in");
        setTimeout(() => { c.style.transitionDelay = ""; }, 1400);
        shown++;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { order = null; }, { passive: true });
    tick();
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const reset = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--tx", "0deg");
    e.currentTarget.style.setProperty("--ty", "0deg");
  };

  return (
    <section data-calm="1" className="relative z-[2] pt-12 pb-16">
      <div className="wrap">
        <div className="mb-16 grid grid-cols-4 items-end gap-x-[var(--gutter)] gap-y-6 md:grid-cols-8 lg:grid-cols-12">
          <Reveal className="col-span-4 md:col-span-6 lg:col-span-7">
            <p className="label mb-6" data-scramble>Clients</p>
            <h2 className="font-display text-display leading-[0.88] tracking-[-0.035em]">
              <Words>In good<br />hands.</Words>
            </h2>
          </Reveal>
          <Reveal className="col-span-4 md:col-span-2 lg:col-span-5">
            <p className="text-nano tracking-[0.14em] text-dim uppercase">Directly or alongside their agencies</p>
          </Reveal>
        </div>
        <div
          ref={grid}
          onMouseMove={onMove}
          className="logos grid grid-cols-3 border-t border-l border-line [perspective:1600px] md:grid-cols-4 lg:grid-cols-6"
          style={{ background: "radial-gradient(420px circle at var(--mx,-999px) var(--my,-999px), rgb(255 0 255 / .16), transparent 70%)" }}
        >
          {CLIENTS.map((c) => (
              <div
                key={c.n}
                data-cell
                onMouseLeave={reset}
                className="group relative grid aspect-[3/2] place-items-center border-r border-b border-line logo-cell [transform-style:preserve-3d] hover:z-[2] hover:bg-accent/5 hover:shadow-[inset_0_0_0_1px_#f0f9,0_30px_60px_-30px_#f0f9]"
              >
                <span className={`text-[clamp(14px,1.6vw,22px)] text-paper/70 transition-[transform,color] duration-500 ease-expo group-hover:text-paper group-hover:[transform:translateZ(48px)_scale(1.06)] ${c.s}`}>{c.n}</span>
                <span className="label absolute bottom-3 left-4 opacity-0 transition-opacity group-hover:text-accent group-hover:opacity-100 max-md:hidden">{c.c}</span>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
