import type { Metadata } from "next";
import { facts, team, values } from "@/content/data";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Art } from "@/components/page/Art";
import { Reveal } from "@/components/ui/Reveal";
import { posts, services } from "@/content/data";
import { slugify } from "@/content/services";
import { Trio } from "@/components/page/ServiceBlocks";
import { DepthSection } from "@/components/home/DepthSection";
import { LiquidRibbons } from "@/components/fx/LiquidRibbons";
import { LightTunnel } from "@/components/fx/LightTunnel";
import { ClosingPlanet } from "@/components/home/ClosingPlanet";
import Link from "next/link";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Studio · People and process"
        lines={["Small team.", "Big output."]}
        accentLast
        lead="A senior creative lead, a network of specialists, and a workflow where AI carries the volume while people keep the taste. You deal with one studio instead of ten suppliers."
      />

      <Section>
        <Reveal className="grid grid-cols-4 items-end gap-x-[var(--gutter)] gap-y-10 md:grid-cols-8 lg:grid-cols-12">
          <Art variant={0} label="Studio portrait" slot="studio-portrait" className="col-span-4 aspect-[4/5] rounded-[28px] md:col-span-4 lg:col-span-5" />
          <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
            <p className="label mb-6">The lead</p>
            <h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]">
              One person
              <br />
              from brief to file<span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-[56ch] text-dim">
              Your creative lead runs the first call, writes the scope, directs the specialists and signs off every
              output. Replace this paragraph with the real story of your studio.
            </p>
          </div>
        </Reveal>
      </Section>

      <DepthSection fig="Studio · People" caption="One lead · a network of specialists" title={["Small team.", "Big output."]} slot="studio-depth-01" alt="Studio">
        <LiquidRibbons />
      </DepthSection>

      <Section label="Team" title={<>The core<br />team.</>}>
        <div className="grid grid-cols-2 gap-[var(--gutter)] lg:grid-cols-4">
          {team.map((t, i) => (
            <Reveal key={t.name} delay={i * 80} className="group">
              <Art variant={t.art} label={t.name} slot={`team-${String(i + 1).padStart(2, "0")}`} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[3/4] rounded-[22px]" />
              <p className="mt-4 font-medium">{t.name}</p>
              <p className="text-sm text-dim">{t.role}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Trio label="Values" items={values.slice(0, 3).map((v, i) => ({ h: v.title, t: v.text, q: String(i + 1).padStart(2, "0") }))} />

      <DepthSection fig="Studio · Craft" caption="Taste decides · tools deliver" title={["Taste first.", "Tools second."]} slot="studio-depth-02" alt="Studio craft">
        <LightTunnel />
      </DepthSection>

      <Section label="Disciplines" title={<>Six disciplines,<br />one table.</>}>
        <ul className="border-t border-line">
          {services.map((x, i) => (
            <Reveal as="li" key={x.n} delay={i * 60} className="border-b border-line">
              <Link href={`/services/${slugify(x.title)}`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-6 py-7 transition-[padding] duration-500 ease-expo hover:pl-3">
                <span className="text-nano tracking-[0.14em] text-accent tabular-nums">{x.n}</span>
                <span className="font-display text-h3 leading-[1.08] transition-colors group-hover:text-accent">{x.title}</span>
                <span className="label hidden md:block">{x.time} ↗</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label="The facts" title={<>Numbers,<br />not adjectives.</>}>
        <div className="grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 80} className="border-r border-b border-line p-6 md:p-8">
              <p className="font-display text-display leading-[0.88] tracking-[-0.035em]">{f.value}</p>
              <p className="mt-4 text-sm text-dim">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Studio life" title={<>From the<br />journal.</>}>
        <div className="grid gap-[var(--gutter)] md:grid-cols-3">
          {posts.slice(0, 3).map((x, i) => (
            <Reveal key={x.slug} delay={i * 80}>
              <Link href={`/journal?post=${x.slug}`} data-cursor="view" className="group block">
                <Art variant={x.art} label={x.title} slot={`journal-${String(i + 1).padStart(2, "0")}`} sizes="33vw" className="aspect-[4/3] rounded-[22px]" />
                <p className="label mt-4 text-accent!">{x.tag}</p>
                <p className="font-display mt-2 text-h4 leading-[1.15] transition-colors group-hover:text-accent">{x.title}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <ClosingPlanet />
    </>
  );
}
