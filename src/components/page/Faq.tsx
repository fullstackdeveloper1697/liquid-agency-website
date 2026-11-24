"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/global/Words";

type Item = { q: string; a: string };

/** The question list, styled like the reference (.faq): numbered, plus-button turns into ×, magenta underline. */
function FaqList({ items }: { items: readonly Item[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 50}>
          <details>
            <summary>
              {f.q}
              <span className="pm" aria-hidden />
            </summary>
            <div className="a">{f.a}</div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

/** Accordion built on <details>, so it works without JavaScript. Used inside a <Section>. */
export function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid grid-cols-4 gap-x-[var(--gutter)] md:grid-cols-8 lg:grid-cols-12">
      <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
        <FaqList items={items} />
      </div>
    </div>
  );
}

/**
 * Full FAQ section as on the reference home page: a sticky left column with the
 * heading and a big outlined counter (01 / 05) that follows the question in the
 * middle of the screen, the current question's text and a progress bar.
 */
export function FaqSection({ items, label = "Questions", title }: { items: readonly Item[]; label?: string; title: ReactNode }) {
  const list = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const t = list.current;
    if (!t) return;
    const rows = [...t.querySelectorAll("details")];
    let cur = -1;
    let raf = 0;
    const tick = () => {
      raf = 0;
      if (innerWidth < 1024) return;
      const r = t.getBoundingClientRect();
      const k = innerHeight;
      if (r.bottom < -k * 0.2 || r.top > k) return;
      const m = k * 0.5;
      let y = 0;
      rows.forEach((u, v) => { if (u.getBoundingClientRect().top < m) y = v; });
      const g = Math.min(1, Math.max(0, (m - r.top) / Math.max(1, r.height)));
      if (bar.current) bar.current.style.transform = `scaleX(${g.toFixed(3)})`;
      if (y !== cur && num.current && text.current) {
        cur = y;
        num.current.innerHTML = `<b class="sk-in">${pad(y + 1)}</b>`;
        text.current.textContent = rows[y].querySelector("summary")?.textContent?.trim() ?? "";
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on, { passive: true });
    tick();
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section data-calm="1" className="relative py-[clamp(88px,10vw,152px)]">
      <div className="wrap grid grid-cols-4 gap-x-[var(--gutter)] gap-y-12 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:sticky lg:top-[calc(var(--nav-hs)+32px)] lg:col-span-4 lg:self-start">
          <Reveal>
            <p className="label mb-6" data-scramble>{label}</p>
            <h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]"><Words>{title}</Words></h2>
          </Reveal>
          <div className="sk" aria-hidden>
            <span ref={num} className="sk__n"><b>01</b></span>
            <span className="sk__of text-nano tabular-nums">/ {pad(items.length)}</span>
            <span ref={text} className="sk__t text-micro" />
            <i className="sk__bar"><i ref={bar} /></i>
          </div>
        </div>
        <div ref={list} className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
