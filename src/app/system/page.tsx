import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Art } from "@/components/page/Art";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GridToggleButton } from "@/components/ui/GridOverlay";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Design system" };

const type = [
  { name: "Mega", spec: "48 → 188 px · 0.86", cls: "text-mega leading-[0.86] tracking-[-0.045em] font-display", sample: "Liquid" },
  { name: "Display", spec: "40 → 148 px · 0.88", cls: "text-display leading-[0.88] tracking-[-0.035em] font-display", sample: "Take shape" },
  { name: "H1", spec: "40 → 72 px · 0.94", cls: "text-h1 leading-[0.94] tracking-[-0.03em] font-display", sample: "One creative lead" },
  { name: "H2", spec: "30 → 45 px · 1.00", cls: "text-h2 leading-none font-display", sample: "Five ways we work" },
  { name: "H3", spec: "24 → 35 px · 1.08", cls: "text-h3 leading-[1.08] font-display", sample: "Brand and identity" },
  { name: "Lead", spec: "18 → 22 px · 1.36", cls: "text-lead leading-[1.36]", sample: "Brand identities, websites and campaigns." },
  { name: "Body", spec: "16 → 17 px · 1.50", cls: "text-body", sample: "One creative lead steers the specialists your project needs." },
  { name: "Micro", spec: "12 → 13 px · 1.40", cls: "text-micro", sample: "Business days count from the accepted quote." },
  { name: "Nano", spec: "10 px · 1.20", cls: "text-nano uppercase tracking-[0.14em]", sample: `${site.tagline} · ${site.location.city}` },
];

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

const colours = [
  { name: "Ground", value: "#000000", swatch: "bg-ink shadow-[inset_0_0_0_1px_var(--color-line)]" },
  { name: "Type", value: "#FFFFFF · 21:1", swatch: "bg-paper" },
  { name: "Accent", value: "#FF00FF", swatch: "bg-accent" },
  { name: "Raise", value: "#0B0B0B", swatch: "bg-raise shadow-[inset_0_0_0_1px_var(--color-line)]" },
  { name: "Deep", value: "#050407", swatch: "bg-deep shadow-[inset_0_0_0_1px_var(--color-line)]" },
  { name: "Dim / Faint / Line", value: "white 64% · 52% · 14%", swatch: "bg-[linear-gradient(90deg,rgb(255_255_255/.64)_0_33%,rgb(255_255_255/.52)_33%_66%,rgb(255_255_255/.14)_66%)]" },
];

const motion = [
  ["Easing", "One family: out (.22,1,.36,1), in-out (.65,0,.35,1), expo (.16,1,.3,1)."],
  ["Durations", "160 ms for hovers, 320 ms for state changes, 640 ms for entrances."],
  ["Headlines", "Words rise out of a mask, tilted and blurred, starting magenta."],
  ["Sections", "Fade up once as they scroll into view."],
  ["Menu", "Panel wipes in from the right; letters roll to magenta on hover."],
  ["Reduced motion", "Every effect becomes an instant change."],
];

export default function SystemPage() {
  return (
    <>
      <PageHero
        eyebrow="Design system · v1"
        lines={["The system."]}
        lead="Every size on this site comes from a small set of tokens, and every effect follows a small set of rules. Nothing is placed by eye."
        aside={
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="text-sm text-dim">On a computer, press G on any page to lay the grid over it.</p>
            <GridToggleButton className="lg:inline-block! inline-block! rounded-full px-4 py-2 shadow-[inset_0_0_0_1px_var(--color-line)]" />
          </div>
        }
      />

      <Section label="Grid" title="Grid.">
        <Reveal>
          <div className="grid h-40 grid-cols-4 gap-[var(--gutter)] md:grid-cols-8 lg:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`rounded-md bg-accent/15 shadow-[inset_0_0_0_1px_#ff00ff55] ${i >= 8 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : ""}`} />
            ))}
          </div>
          <dl className="mt-10 grid gap-6 text-sm md:grid-cols-3">
            {[
              ["Columns", "12 desktop · 8 tablet · 4 phone"],
              ["Gutter / margin", "16 → 24 px · 24 → 64 px"],
              ["Content width", "1,312 px max, text ~70 characters"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-line pt-4">
                <dt className="label">{k}</dt>
                <dd className="mt-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section label="Type" title="Type scale." intro="Steps on a √φ ratio (1.272) from a 17 px base. Display face for headlines, Space Grotesk for text.">
        <div className="border-t border-line">
          {type.map((t) => (
            <Reveal key={t.name} className="grid grid-cols-4 items-baseline gap-x-[var(--gutter)] gap-y-2 border-b border-line py-6 md:grid-cols-8 lg:grid-cols-12">
              <div className="col-span-4 md:col-span-2 lg:col-span-2">
                <p className="font-medium">{t.name}</p>
                <p className="text-micro text-dim">{t.spec}</p>
              </div>
              <p className={`col-span-4 truncate md:col-span-6 lg:col-span-10 ${t.cls}`}>{t.sample}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Spacing" title="Spacing.">
        <Reveal className="flex flex-col gap-3">
          {spacing.map((s, i) => (
            <div key={s} className="flex items-center gap-6">
              <span className="w-16 text-micro text-dim tabular-nums">--s-{i + 1}</span>
              <span className="h-3 rounded-full bg-accent" style={{ width: s * 3 }} />
              <span className="text-micro tabular-nums">{s} px</span>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section label="Colour" title="Colour.">
        <div className="grid grid-cols-2 gap-[var(--gutter)] lg:grid-cols-3">
          {colours.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className={`aspect-[3/2] rounded-[22px] ${c.swatch}`} />
              <p className="mt-3 font-medium">{c.name}</p>
              <p className="text-micro text-dim">{c.value}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Motion" title="Motion.">
        <Reveal className="mb-12 flex flex-wrap items-center gap-4">
          <MagneticButton href="/system" variant="light">Hover me</MagneticButton>
          <MagneticButton href="/system" variant="primary">Magnetic</MagneticButton>
          <a href="#motion" className="link">Underline</a>
        </Reveal>
        <dl id="motion" className="grid gap-x-[var(--gutter)] md:grid-cols-2">
          {motion.map(([k, v]) => (
            <Reveal key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-line py-5">
              <dt className="label pt-1">{k}</dt>
              <dd className="text-dim">{v}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section label="Imagery" title="Imagery." intro="Dark grounds, chrome surfaces, magenta light. Placeholder artwork is drawn in CSS until real images arrive.">
        <div className="grid grid-cols-2 gap-[var(--gutter)] lg:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <Reveal key={v} delay={v * 50}>
              <Art variant={v} className="aspect-square rounded-[22px]" />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Speed" title="Speed.">
        <dl className="grid gap-x-[var(--gutter)] md:grid-cols-2">
          {[
            ["Per page", "Static HTML, prerendered at build time."],
            ["Fonts", "Two variable files, self-hosted, no third-party requests."],
            ["Effects", "CSS only: no animation libraries, no canvas on inner pages."],
            ["Images", "Use next/image with explicit sizes when real images are added."],
          ].map(([k, v]) => (
            <Reveal key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-line py-5">
              <dt className="label pt-1">{k}</dt>
              <dd className="text-dim">{v}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>
    </>
  );
}
