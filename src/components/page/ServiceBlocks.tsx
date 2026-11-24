"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { caseDetails } from "@/content/cases";
import type { ServiceDetail } from "@/content/services";
import { Art } from "@/components/page/Art";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/global/Words";

const pad2 = (n: number) => String(n).padStart(2, "0");
const two = (t: [string, string]) => (<>{t[0]}<br />{t[1].replace(/\.$/, "")}<span className="text-accent">.</span></>);

/** Three cards with a magenta top rule that stretches on hover, a pointer glow and a large faint number. */
export function Trio({ items, label = "Who it is for" }: { items: readonly { t: string; q: string; h?: string }[]; label?: string }) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <p className="label mb-8" data-scramble>{label}</p>
        <div className="grid gap-[var(--gutter)] md:grid-cols-3">
          {items.map((x, i) => (
            <Reveal key={x.q} delay={i * 120}>
              <article
                onMouseMove={onMove}
                className="group relative isolate min-h-[220px] overflow-hidden rounded-[22px] px-6 pt-6 pb-8 shadow-[inset_0_0_0_1px_#ffffff12] transition-shadow duration-500 [background:radial-gradient(420px_circle_at_var(--mx,30%)_var(--my,-30%),rgb(255_0_255/.09),transparent_62%),linear-gradient(180deg,#0b020b,#050005)] before:absolute before:top-0 before:left-6 before:h-0.5 before:w-14 before:rounded-b-sm before:bg-accent before:shadow-[0_0_14px_#f0fc] before:transition-[width] before:duration-700 before:ease-expo before:content-[''] hover:shadow-[inset_0_0_0_1px_#ff00ff52] hover:before:w-[calc(100%-48px)]"
              >
                <span className="label text-faint!">{pad2(i + 1)}</span>
                {x.h && <h3 className="font-display mt-6 text-h3 leading-[1.08]">{x.h}<span className="text-accent">.</span></h3>}
                <p className={`${x.h ? "mt-3 text-dim" : "mt-6 text-lead"} max-w-[28ch] leading-[1.36]`}>{x.t}</p>
                <span aria-hidden className="font-display pointer-events-none absolute right-6 -bottom-[.32em] -z-10 text-[clamp(120px,11vw,180px)] leading-none text-[#ff00ff17] transition-[color,transform] duration-700 ease-expo group-hover:-translate-y-1.5 group-hover:text-[#ff00ff2e]">{x.q}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Numbered steps. */
export function Steps({ steps }: { steps: ServiceDetail["steps"] }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <Reveal className="mb-12"><p className="label mb-6" data-scramble>Process</p><h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]"><Words>Step by<br />step<span className="text-accent">.</span></Words></h2></Reveal>
        <ol className="grid gap-[var(--gutter)] md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 90} className="border-t border-line pt-5">
              <p className="label"><span className="text-accent">{pad2(i + 1)}</span> / Step</p>
              <h3 className="font-display mt-4 text-h4 leading-[1.15] tracking-[-0.01em]">{s.t}</h3>
              <p className="mt-2 text-sm text-dim">{s.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Three case cards that show the service in use. */
export function Practice({ d }: { d: ServiceDetail }) {
  const list = d.practice.cases.map((slug) => caseDetails.find((c) => c.slug === slug)!).filter(Boolean);
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div><p className="label mb-6" data-scramble>Examples</p><h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]"><Words>{two(d.practice.title)}</Words></h2></div>
          <Link href="/work" className="link">All work ↗</Link>
        </Reveal>
        <div className="grid gap-[var(--gutter)] md:grid-cols-3">
          {list.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <Link href={`/work/${c.slug}`} data-cursor="view" className="group block">
                <Art slot={`case-${c.slug}-hero`} variant={i * 2} label={c.client} className="aspect-[4/5] rounded-[22px] ring-1 ring-line" />
                <p className="label mt-4">{c.facts[1][1]} · {c.facts[3][1]}</p>
                <p className="font-display mt-2 text-h4 leading-[1.15] transition-colors group-hover:text-accent">{c.client}</p>
                <p className="mt-1 text-sm text-dim">{c.title.join(" ")}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A labelled bar chart inside a framed panel with dotted rules. */
export function Metric({ d }: { d: ServiceDetail }) {
  const max = Math.max(...d.metric.rows.map((r) => r.v));
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4 lg:pt-8">
          <p className="label mb-6" data-scramble>In numbers</p>
          <h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]"><Words>{two(d.metric.title)}</Words></h2>
          <p className="mt-6 text-dim">{d.metric.lead}</p>
        </Reveal>
        <Reveal className="overflow-hidden rounded-[22px] bg-[#070707] shadow-[inset_0_0_0_1px_var(--color-line)] lg:col-span-7 lg:col-start-6">
          <div className="flex justify-between bg-[radial-gradient(circle,rgb(255_255_255/.3)_0_.75px,transparent_1.1px)_0_100%/5px_3px_repeat-x] px-[clamp(22px,3vw,44px)] py-[18px] text-nano tracking-[0.14em] uppercase">
            <span>{d.name}</span><span className="text-dim">Example</span>
          </div>
          <div ref={ref} className="flex flex-col gap-5 px-[clamp(22px,3vw,44px)] py-[clamp(26px,3vw,44px)]">
            {d.metric.rows.map((r, i) => (
              <div key={r.k} className="grid grid-cols-[9rem_1fr_4rem] items-center gap-4 text-sm">
                <span className="text-dim">{r.k}</span>
                <span className="relative h-3 overflow-hidden rounded-full bg-ghost">
                  <i className="absolute inset-y-0 left-0 block origin-left rounded-full bg-accent shadow-[0_0_14px_#ff00ff73] transition-transform duration-1000 ease-expo [.rv:not(.in)_&]:scale-x-0" style={{ width: `${(r.v / max) * 100}%`, transitionDelay: `${300 + i * 120}ms` }} />
                </span>
                <span className="font-display text-right text-h4 tabular-nums">{r.v}{r.u}</span>
              </div>
            ))}
          </div>
          <div className="bg-[radial-gradient(circle,rgb(255_255_255/.3)_0_.75px,transparent_1.1px)_0_0/5px_3px_repeat-x] px-[clamp(22px,3vw,44px)] py-[22px] text-micro text-dim">
            Placeholder figures. Replace with your own results.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ServiceArt({ slot, label }: { slot: string; label: string }) {
  return <Art slot={slot} variant={1} label={label} className="aspect-[16/9] rounded-[28px]" />;
}
