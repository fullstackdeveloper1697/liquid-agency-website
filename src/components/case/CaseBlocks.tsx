import Link from "next/link";
import type { CaseDetail } from "@/content/cases";
import { caseDetails } from "@/content/cases";
import { Art } from "@/components/page/Art";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/global/Words";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Small uppercase key with a magenta dot, used across case pages. */
export function Key({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-nano leading-[1.2] tracking-[0.14em] text-dim uppercase">
      <i className="size-1.5 flex-none rounded-full bg-accent shadow-[0_0_10px_#ff00ffb3]" />
      <span data-scramble>{children}</span>
    </p>
  );
}

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-display text-h1 leading-[0.94] tracking-[-0.03em] ${className}`}><Words>{children}</Words></h2>;
}
const two = (t: [string, string]) => (<>{t[0]}<br />{t[1].replace(/\.$/, "")}<span className="text-accent">.</span></>);

/** Case header: breadcrumb, big title, intro and a facts table. */
export function CaseHero({ c, index }: { c: CaseDetail; index: number }) {
  return (
    <section data-calm="0.5" className="phero relative overflow-hidden pt-[calc(var(--nav-h)+128px)] pb-[clamp(48px,6vw,96px)]">
      <div aria-hidden className="pointer-events-none absolute top-0 left-[88%] -mt-[35vmax] -ml-[35vmax] size-[70vmax]">
        <i className="absolute inset-0 block animate-drift rounded-full" style={{ background: "radial-gradient(closest-side, #ff00ff6b, #ff00ff29 42%, #ff00ff0d 70%, #f0f0)" }} />
      </div>
      <div className="wrap relative z-[1]">
        <nav aria-label="Breadcrumb" className="fx label flex flex-wrap gap-2" style={{ "--fx-d": "0ms" } as React.CSSProperties}>
          <Link href="/" className="hover:text-paper">Home</Link> /
          <Link href="/work" className="hover:text-paper">Work</Link> /
          <span className="text-paper" data-scramble>Case {pad2(index + 1)} · {c.client}</span>
        </nav>
        <h1 className="font-display mt-8 text-[clamp(44px,calc(10px+8.6vw),148px)] leading-[0.88] tracking-[-0.035em]">
          {c.title.map((line, li) => (
            <span key={li} className="block">
              <span className="wd"><span className="wi" style={{ "--i": li } as React.CSSProperties}>
                {li === c.title.length - 1 ? <>{line.replace(/\.$/, "")}<span className="text-accent">.</span></> : line}
              </span></span>
            </span>
          ))}
        </h1>
        <div className="mt-16 grid grid-cols-4 gap-x-[var(--gutter)] gap-y-10 md:grid-cols-8 lg:grid-cols-12">
          <p className="fx col-span-4 text-lead leading-[1.36] text-dim md:col-span-8 lg:col-span-6" style={{ "--fx-d": "420ms" } as React.CSSProperties}>{c.intro}</p>
          <dl className="fx col-span-4 text-micro md:col-span-8 lg:col-span-5 lg:col-start-8" style={{ "--fx-d": "520ms" } as React.CSSProperties}>
            {c.facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-t border-line py-3 last:border-b">
                <dt className="text-nano tracking-[0.14em] text-faint uppercase">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Full-bleed hero figure under the case header. */
export function CaseFigure({ c }: { c: CaseDetail }) {
  return (
    <Reveal className="wrap">
      <Art slot={`case-${c.slug}-hero`} variant={0} label={`${c.client} hero`} priority sizes="100vw" className="aspect-[16/9] rounded-[28px] ring-1 ring-line" />
    </Reveal>
  );
}

/** Big numbers. */
export function CaseStats({ c }: { c: CaseDetail }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap grid gap-[var(--gutter)] md:grid-cols-3">
        {c.stats.map((s, i) => (
          <Reveal key={s.t} delay={i * 90} className="border-t border-line pt-6">
            <p className="font-display text-[clamp(56px,6.5vw,112px)] leading-[0.88] tracking-[-0.035em]">
              {s.v}{s.u && <span className="ml-2 font-sans text-h4 text-accent">{s.u}</span>}
            </p>
            <p className="mt-4 text-sm text-dim">{s.t}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** "The brief, in three lines." */
export function CaseBrief({ c }: { c: CaseDetail }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <Reveal className="mb-12"><p className="label mb-6" data-scramble>Overview</p><H2>The brief,<br />in three lines.</H2></Reveal>
        <div className="grid gap-[var(--gutter)] md:grid-cols-3">
          {c.brief.map((b, i) => (
            <Reveal key={b.k} delay={i * 90} className="relative overflow-hidden rounded-[22px] p-6 pt-8 shadow-[inset_0_0_0_1px_#ffffff12] [background:linear-gradient(180deg,#0b020b,#050005)] before:absolute before:top-0 before:left-6 before:h-0.5 before:w-14 before:bg-accent before:shadow-[0_0_14px_#f0fc] before:content-['']">
              <Key>{pad2(i + 1)} · {b.k}</Key>
              <p className="mt-6 text-lead leading-[1.36]">{b.t}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "How it came together": a week-by-week timeline. */
export function CaseGantt({ c }: { c: CaseDetail }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <Reveal className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><p className="label mb-6" data-scramble>Timeline</p><H2>How it came<br />together.</H2></div>
          <p className="text-dim lg:col-span-4 lg:col-start-9">{c.weeks} weeks from the first call to the last file.</p>
        </Reveal>
        <Reveal className="rounded-[22px] p-6 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-8">
          <div className="mb-4 grid grid-cols-[8rem_1fr] gap-4 text-nano tracking-[0.14em] text-faint uppercase">
            <span>Phase</span>
            <span className="grid" style={{ gridTemplateColumns: `repeat(${c.weeks}, 1fr)` }}>
              {Array.from({ length: c.weeks }).map((_, w) => <span key={w}>W{w + 1}</span>)}
            </span>
          </div>
          {c.phases.map((p, i) => (
            <div key={p.name} className="grid grid-cols-[8rem_1fr] items-center gap-4 border-t border-line py-3 text-sm">
              <span><span className="mr-2 text-nano text-accent">{pad2(i + 1)}</span>{p.name}</span>
              <span className="relative h-2.5">
                <i
                  className="absolute inset-y-0 block origin-left rounded-full bg-accent shadow-[0_0_14px_#ff00ff73] transition-transform duration-1000 ease-expo [.rv:not(.in)_&]:scale-x-0"
                  style={{ left: `${(p.start / c.weeks) * 100}%`, width: `${(p.len / c.weeks) * 100}%`, transitionDelay: `${300 + i * 120}ms` }}
                />
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Image rows: one full-width, two-up or three-up, with a caption. */
export function CaseRow({ c, row, index }: { c: CaseDetail; row: CaseDetail["rows"][number]; index: number }) {
  const n = row.layout === "full" ? 1 : row.layout === "two" ? 2 : 3;
  return (
    <section className="py-[clamp(12px,1.5vw,24px)]">
      <div className={`wrap grid gap-[var(--gutter)] ${n === 2 ? "md:grid-cols-2" : n === 3 ? "md:grid-cols-3" : ""}`}>
        {Array.from({ length: n }).map((_, k) => (
          <Reveal key={k} delay={k * 90} className="group" >
            <div data-cursor="view">
              <Art slot={`case-${c.slug}-${index + 1}${n > 1 ? String.fromCharCode(97 + k) : ""}`} variant={index + k} label={row.caption} sizes={n === 1 ? "100vw" : n === 2 ? "50vw" : "33vw"} className={`rounded-[22px] ring-1 ring-line ${n === 1 ? "aspect-[16/9]" : n === 2 ? "aspect-[4/5]" : "aspect-square"}`} />
            </div>
          </Reveal>
        ))}
        <p className="label md:col-span-full">{pad2(index + 1)} · {row.caption}</p>
      </div>
    </section>
  );
}

/** Process diagram: numbered steps joined by a running magenta line. */
export function CaseProcess({ c }: { c: CaseDetail }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <Reveal className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><p className="label mb-6" data-scramble>Process</p><H2>{two(c.process.title)}</H2></div>
          <p className="text-lead leading-[1.36] text-dim lg:col-span-4 lg:col-start-9">{c.process.lead}</p>
        </Reveal>
        <Reveal className="relative grid gap-4 md:grid-cols-5">
          <span aria-hidden className="absolute top-6 right-[10%] left-[10%] hidden h-px overflow-hidden bg-line md:block">
            <i className="absolute inset-y-0 left-0 block w-24 animate-[flow-wide_3s_linear_infinite] bg-[linear-gradient(90deg,transparent,#f0f,transparent)]" />
          </span>
          {c.process.steps.map((s, i) => (
            <div key={s} className="relative flex flex-col items-start gap-4 md:items-center md:text-center">
              <span className="relative grid size-12 place-items-center rounded-full bg-[#0b020b] text-sm shadow-[inset_0_0_0_1px_#ff00ff80,0_0_0_6px_#000]">{pad2(i + 1)}</span>
              <span className="font-display text-h4 leading-[1.15]">{s}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** System grid: the parts of the identity. */
export function CaseSystem({ c }: { c: CaseDetail }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap">
        <Reveal className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><p className="label mb-6" data-scramble>System</p><H2>{two(c.system.title)}</H2></div>
          <p className="text-lead leading-[1.36] text-dim lg:col-span-4 lg:col-start-9">{c.system.lead}</p>
        </Reveal>
        <div className="grid grid-cols-2 border-t border-l border-line md:grid-cols-3 lg:grid-cols-6">
          {c.system.items.map((s, i) => (
            <Reveal key={s} delay={i * 60} className="group relative aspect-square border-r border-b border-line p-5 transition-colors hover:bg-accent/5">
              <span className="text-nano text-accent">{pad2(i + 1)}</span>
              <span className="font-display absolute bottom-5 left-5 text-h4 leading-none transition-transform duration-500 ease-expo group-hover:-translate-y-1">{s}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Deliverables list. */
export function CaseDeliverables({ c }: { c: CaseDetail }) {
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5"><p className="label mb-6" data-scramble>Deliverables</p><H2>{two(c.deliverables.title)}</H2></Reveal>
        <Reveal className="lg:col-span-6 lg:col-start-7"><Ticks items={c.deliverables.items} /></Reveal>
      </div>
    </section>
  );
}

/** Large ticked list, two columns. */
export function Ticks({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-x-[var(--gutter)] sm:grid-cols-2">
      {items.map((t, i) => (
        <li key={t} className="relative border-b border-line py-4 pl-9 text-lead leading-snug">
          <span aria-hidden className="absolute top-1/2 left-0 grid size-[18px] -translate-y-1/2 place-items-center rounded-[5px] bg-accent shadow-[0_0_14px_#ff00ff73] transition-transform duration-500 [.rv:not(.in)_&]:scale-0" style={{ transitionDelay: `${400 + i * 110}ms` }}>
            <i className="mb-[3px] block h-1 w-2 -rotate-45 border-b-[1.75px] border-l-[1.75px] border-white" />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Credits plus a card linking to the next case. */
export function CaseCredits({ c, index }: { c: CaseDetail; index: number }) {
  const next = caseDetails[(index + 1) % caseDetails.length];
  return (
    <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="label mb-6" data-scramble>Credits</p>
          <dl className="text-micro">
            {c.credits.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 border-t border-line py-3 last:border-b">
                <dt className="text-faint">{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
          <Link href={`/work/${next.slug}`} data-cursor="view" data-cursor-label="Next" className="group relative block overflow-hidden rounded-[28px] ring-1 ring-line">
            <Art slot={`case-${next.slug}-hero`} variant={(index + 1) % 6} label={next.client} className="aspect-[16/10]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6">
              <Key>Next case</Key>
              <p className="font-display mt-3 text-h2 leading-none transition-colors group-hover:text-accent">{next.client}</p>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
