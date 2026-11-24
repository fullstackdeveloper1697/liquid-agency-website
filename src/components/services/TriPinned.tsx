"use client";

import { useRef } from "react";
import { Art } from "@/components/page/Art";
import { clamp, useScrollProgress } from "@/lib/motion";

const lines = [
  { t: "One lead.", d: "One creative lead from the first call to the last file. No hand-offs, no account managers." },
  { t: "One quote.", d: "A fixed, written quote before anything starts. Changes are priced before they are made." },
  { t: "One date.", d: "A delivery date we commit to in writing, with check-ins you can plan around." },
];

/** Pinned section: three lines light up in turn, a magenta bar follows, a framed picture changes. */
export function TriPinned() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(
    ref,
    (p, el) => {
      const a = Math.min(lines.length - 1, Math.floor(clamp(p * lines.length, 0, lines.length - 0.001)));
      if (el.dataset.a !== String(a)) el.dataset.a = String(a);
      el.style.setProperty("--p", p.toFixed(4));
    },
    { pinned: true },
  );
  return (
    <section ref={ref} data-calm="1" data-a="0" className="group/tri relative h-[300svh]">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="wrap grid w-full items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label mb-10" data-scramble>How we work</p>
            <ol className="relative flex flex-col gap-8 pl-8">
              <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-line" />
              <span aria-hidden className="absolute top-0 left-0 w-0.5 origin-top bg-accent shadow-[0_0_14px_#f0fc]" style={{ height: "100%", transform: "scaleY(var(--p,0))" }} />
              {lines.map((l, i) => (
                <li key={l.t} data-i={i} className="text-faint transition-[color,transform] duration-500 ease-expo">
                  <p className="font-display text-[clamp(40px,5.6vw,96px)] leading-[0.95] tracking-[-0.03em]">{l.t}</p>
                  <p className="mt-2 max-w-[44ch] text-sm opacity-0 transition-opacity duration-500">{l.d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[22px] ring-1 ring-line lg:col-span-4 lg:col-start-9 lg:block">
            {lines.map((l, i) => (
              <div key={l.t} data-f={i} className="absolute inset-0 opacity-0 transition-[opacity,transform] duration-700 ease-expo">
                <Art slot={`services-tri-0${i + 1}`} variant={i + 2} label={l.t} className="absolute inset-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
