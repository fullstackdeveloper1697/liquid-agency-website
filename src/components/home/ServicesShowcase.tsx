"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { services } from "@/content/data";
import { ChromeSprite } from "@/components/fx/ChromeSprite";
import { Words } from "@/components/global/Words";
import { Reveal } from "@/components/ui/Reveal";
import { clamp, useScrollProgress } from "@/lib/motion";

const slug = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

/**
 * Pinned services (100svh + 90vh): scrolling steps through the five services.
 * The active row brightens and slides 12px; the card shows its live shape,
 * a big outlined number and a progress bar. Hover or click a row to jump to it.
 */
export function ServicesShowcase() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const hold = useRef(0);

  useScrollProgress(
    section,
    (p) => {
      const n = services.length;
      const pos = clamp(p) * n;
      const i = Math.min(n - 1, Math.floor(pos));
      bars.current.forEach((b, j) => b?.style.setProperty("--fp", String(j < i ? 1 : j === i ? pos - i : 0)));
      if (i !== activeRef.current && performance.now() > hold.current) {
        activeRef.current = i;
        setActive(i);
      }
    },
    { pinned: true },
  );

  const pick = useCallback((i: number) => {
    hold.current = performance.now() + 1200;
    activeRef.current = i;
    setActive(i);
  }, []);
  const s = services[active];

  return (
    <section ref={section} id="services" data-calm="1" className="relative h-[calc(100svh+90vh)] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-[calc(var(--nav-hs)+12px)] pb-6 motion-reduce:relative motion-reduce:h-auto">
        <div className="wrap grid grid-cols-4 items-center gap-x-[var(--gutter)] gap-y-[clamp(18px,3vh,40px)] md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:row-start-1">
            <Reveal>
              <p className="label" data-scramble>Services</p>
              <h2 className="font-display mt-4 text-[clamp(40px,5.2vw,92px)] leading-[0.92] tracking-[-0.04em]">
                <Words>Five ways<br />to work together.</Words>
              </h2>
            </Reveal>
          </div>

          <ul className="col-span-4 border-t border-line md:col-span-8 lg:col-span-7 lg:row-start-2">
            {services.map((x, i) => (
              <li key={x.n} className="border-b border-line">
                <Link
                  href={`/services/${slug(x.title)}`}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  data-on={active === i ? "" : undefined}
                  className="group relative isolate grid cursor-pointer grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-[clamp(10px,1.5vh,20px)] opacity-30 transition-opacity duration-500 ease-out after:absolute after:inset-0 after:-z-10 after:origin-bottom after:scale-y-0 after:bg-[linear-gradient(90deg,rgb(255_0_255/.14),transparent_70%)] after:transition-transform after:duration-600 after:ease-expo after:content-[''] hover:after:scale-y-100 data-[on]:opacity-100 motion-reduce:opacity-100"
                >
                  <span className="text-nano tabular-nums transition-colors duration-400 group-data-[on]:text-accent">{x.n}</span>
                  <span className="font-display text-[clamp(20px,2.1vw,34px)] leading-[1.1] tracking-[-0.01em] transition-[transform,color] duration-700 ease-expo group-data-[on]:translate-x-3">
                    {x.title}
                  </span>
                  <span aria-hidden className="grid size-12 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background-color,box-shadow,transform,color] duration-500 ease-expo group-hover:rotate-45 group-hover:bg-accent group-hover:text-ink group-hover:shadow-none">
                    <svg viewBox="0 0 10 10" className="size-2.5"><path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative col-span-4 hidden aspect-[4/5] max-h-[72svh] w-full overflow-hidden rounded-[22px] shadow-[inset_0_0_0_1px_var(--color-line),0_60px_140px_-60px_#ff00ff80] [background:radial-gradient(ellipse_85%_60%_at_55%_38%,#f0f3,#f0f0_72%),#050505] md:col-span-8 md:block lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:ml-auto">
            <span
              key={`n${active}`}
              className="font-display absolute top-6 left-8 animate-[fx-in_.9s_var(--ease-expo)_both] text-[clamp(60px,7vw,128px)] leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/.3)]"
            >
              {s.n}
            </span>
            <ChromeSprite shape={active} speed={0.5} draggable className="absolute top-[42%] left-1/2 aspect-square w-[54%] -translate-x-1/2 -translate-y-1/2" />
            <div key={`p${active}`} className="absolute inset-x-8 bottom-8 flex animate-[fx-in_.9s_var(--ease-expo)_both] flex-col gap-3">
              <p className="font-display text-h4 leading-[1.15] tracking-[-0.01em]">{s.title}</p>
              <p className="max-w-[30em] text-[clamp(14px,1.05vw,16px)] text-dim">{s.text}</p>
            </div>
          </div>

          <div className="col-span-4 flex items-center justify-between gap-6 md:col-span-8 lg:col-span-12">
            <div className="flex gap-2">
              {services.map((x, i) => (
                <i
                  key={x.n}
                  ref={(el) => { bars.current[i] = el; }}
                  className={`relative block h-px overflow-hidden rounded-sm bg-white/20 transition-[width] duration-600 ease-expo after:absolute after:inset-0 after:origin-left after:bg-accent after:[transform:scaleX(var(--fp,0))] after:content-[''] ${active === i ? "w-14" : "w-9"}`}
                />
              ))}
            </div>
            <Link href="/services" className="link text-sm">All services and packages ↗</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
