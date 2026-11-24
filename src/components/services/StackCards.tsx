"use client";

import Link from "next/link";
import { useRef } from "react";
import { services } from "@/content/data";
import { slugify } from "@/content/services";
import { ChromeSprite } from "@/components/fx/ChromeSprite";
import { clamp, useScrollProgress } from "@/lib/motion";

/**
 * Sticky stacking cards: each card pins a little lower than the one before,
 * and earlier cards shrink and dim as the next one slides over them.
 */
export function StackCards() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, (_p, el) => {
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (!next) return;
      const r = next.getBoundingClientRect();
      const top = c.getBoundingClientRect().top;
      const t = clamp(1 - (r.top - top) / Math.max(1, c.offsetHeight));
      c.style.setProperty("--k", t.toFixed(3));
    });
  });
  return (
    <div ref={ref} className="flex flex-col gap-[var(--gutter)] pb-[10vh]">
      {services.map((s, i) => (
        <article
          key={s.n}
          id={slugify(s.title)}
          data-card
          className="sticky scroll-mt-32 origin-top [transform:scale(calc(1-var(--k,0)*.05))] [filter:brightness(calc(1-var(--k,0)*.45))]"
          style={{ top: `calc(var(--nav-hs) + 16px + ${i * 16}px)` }}
        >
          <Link
            href={`/services/${slugify(s.title)}`}
            data-cursor="view"
            className="group relative grid min-h-[min(72svh,620px)] grid-cols-4 gap-x-[var(--gutter)] gap-y-6 overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#121212,#0a0a0a)] p-[clamp(24px,3vw,48px)] shadow-[inset_0_0_0_1px_var(--color-line),0_-30px_60px_-30px_#000] md:grid-cols-8 lg:grid-cols-12"
          >
            <span aria-hidden className="font-display col-span-4 text-[clamp(72px,9vw,160px)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/.35)] transition-colors duration-500 group-hover:[-webkit-text-stroke-color:var(--color-accent)] md:col-span-2 lg:col-span-3">{s.n}</span>
            <div className="col-span-4 flex flex-col md:col-span-6 lg:col-span-6">
              <h3 className="font-display text-h2 leading-none tracking-[-0.02em] transition-colors group-hover:text-accent">{s.title}<span className="text-accent">.</span></h3>
              <p className="mt-5 max-w-[48ch] text-lead text-dim">{s.text}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {s.items.map((it) => (
                  <li key={it} className="rounded-full px-3 py-1 text-micro shadow-[inset_0_0_0_1px_var(--color-line)]">{it}</li>
                ))}
              </ul>
              <p className="label mt-5 flex justify-between"><span>{s.time}</span><span className="text-paper transition-transform group-hover:translate-x-1">Details ↗</span></p>
            </div>
            <div className="col-span-4 hidden items-start justify-end lg:col-span-3 lg:flex">
              <ChromeSprite shape={i} speed={0.4} className="size-[clamp(120px,11vw,190px)]" />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
