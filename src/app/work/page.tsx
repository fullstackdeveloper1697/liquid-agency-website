import type { Metadata } from "next";
import { cases, gallery } from "@/content/data";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Closing } from "@/components/page/Closing";
import { Art } from "@/components/page/Art";
import { Reveal } from "@/components/ui/Reveal";
import { DepthSection } from "@/components/home/DepthSection";
import { LiquidRibbons } from "@/components/fx/LiquidRibbons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Link from "next/link";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work · 2024–2026"
        lines={["Work."]}
        lead="Five cases across payments, events, retail and hardware, then a small gallery of studies from the studio. Every project was directed by people and produced at machine speed."
        aside={<WorkIndex />}
      />

      <Section id="cases" label="Cases" title={<>Five cases,<br />five problems.</>}>
        <div className="flex flex-col gap-[clamp(48px,6vw,96px)]">
          {cases.map((c, i) => (
            <Reveal key={c.slug}>
              <a
                href={`/work/${c.slug}`}
                id={c.slug}
                className={`group grid scroll-mt-32 grid-cols-4 items-end gap-x-[var(--gutter)] gap-y-6 md:grid-cols-8 lg:grid-cols-12 ${
                  i % 2 ? "lg:[direction:rtl]" : ""
                }`}
              >
                <Art variant={c.art} label={`${c.client} visual`} slot={`case-${String(i + 1).padStart(2, "0")}`} className="col-span-4 aspect-[16/10] rounded-[28px] md:col-span-8 lg:col-span-7" />
                <div className="col-span-4 [direction:ltr] md:col-span-6 lg:col-span-5">
                  <p className="label flex gap-3">
                    <span className="text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {c.client} · {c.year}
                  </p>
                  <h3 className="font-display mt-4 text-h3 leading-[1.08] tracking-[-0.01em] transition-colors group-hover:text-accent">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm text-dim">{c.tags}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <DepthSection fig="Work · Archive" caption="Five cases · one standard" title={["Made to", "be used."]} slot="work-depth" alt="Work">
        <LiquidRibbons />
      </DepthSection>

      <Section id="gallery" label="Gallery" title={<>Studies and<br />side projects.</>}>
        <div className="grid grid-cols-2 gap-[var(--gutter)] lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 80} className="group">
              <Art variant={g.art} label={g.title} slot={`gallery-${String(i + 1).padStart(2, "0")}`} sizes="(min-width: 1024px) 33vw, 50vw" className="aspect-[4/5] rounded-[22px]" />
              <p className="mt-3 text-sm text-dim">{g.title}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Reel" title={<>The reel,<br />in motion.</>}>
        <Reveal>
          <Link href="/reel" data-cursor="view" data-cursor-label="Play" className="group relative block overflow-hidden rounded-[28px] ring-1 ring-line">
            <Art variant={2} label="Reel" slot="reel-poster" className="aspect-[16/9] transition-transform duration-1000 ease-expo group-hover:scale-[1.03]" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-24 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-expo group-hover:scale-110">▶</span>
            </span>
            <span className="label absolute bottom-6 left-6 text-paper!">Showreel · 01:24</span>
          </Link>
        </Reveal>
        <div className="mt-8"><MagneticButton href="/reel" variant="light">Watch the reel</MagneticButton></div>
      </Section>

      <Closing />
    </>
  );
}

function WorkIndex() {
  const rows = [
    ...cases.map((c, i) => ({ n: String(i + 1).padStart(2, "0"), name: c.client, d: c.tags, y: c.year, href: `/work/${c.slug}` })),
    { n: "06", name: "Gallery", d: "Projects and studies", y: "2024–26", href: "#gallery" },
  ];
  return (
    <nav aria-label="Work index" className="flex flex-col gap-4">
      <p className="flex items-center gap-2.5 text-nano tracking-[0.14em] text-dim uppercase">
        <i className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_#ff00ffb3]" />
        <b className="font-medium text-paper">Index</b>
      </p>
      <ol className="border-t border-line">
        {rows.map((r) => (
          <li key={r.n}>
            <a
              href={r.href}
              className="group grid grid-cols-[2em_minmax(0,1fr)_4.4em_12px] items-baseline gap-4 border-b border-line py-3.5 text-[15px] transition-[padding] duration-500 ease-expo hover:pl-2.5 md:grid-cols-[2.4em_minmax(0,.8fr)_minmax(0,1.7fr)_4.4em_12px]"
            >
              <span className="text-nano text-accent tabular-nums">{r.n}</span>
              <b className="truncate font-medium">{r.name}</b>
              <span className="hidden truncate text-[13px] text-dim md:block">{r.d}</span>
              <span className="justify-self-end text-[13px] whitespace-nowrap text-dim tabular-nums">{r.y}</span>
              <svg viewBox="0 0 10 10" aria-hidden className="size-2.5 rotate-90 opacity-50 transition-opacity group-hover:text-accent group-hover:opacity-100">
                <path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
