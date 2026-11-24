import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { getService, serviceDetails } from "@/content/services";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Closing } from "@/components/page/Closing";
import { Faq } from "@/components/page/Faq";
import { Packages } from "@/components/page/Packages";
import { Metric, Practice, Steps, Trio } from "@/components/page/ServiceBlocks";
import { Ticks } from "@/components/case/CaseBlocks";
import { DepthSection } from "@/components/home/DepthSection";
import { LightTunnel } from "@/components/fx/LightTunnel";
import { ChromeSprite } from "@/components/fx/ChromeSprite";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return serviceDetails.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const d = getService((await params).slug);
  return { title: d ? d.name : "Service" };
}

/** Service detail page, in the order of the reference's service pages. */
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const d = getService(slug);
  if (!d) notFound();

  return (
    <>
      <PageHero
        eyebrow={`Service ${d.n} · ${d.name}`}
        size="sm"
        lines={d.title}
        lead={d.lead}
        aside={
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <ChromeSprite shape={d.shape} speed={0.5} draggable className="size-[clamp(120px,12vw,200px)]" />
            <MagneticButton href={site.cta.href} variant="primary">{site.cta.label}</MagneticButton>
          </div>
        }
      />
      <Trio items={d.who} />
      <Section label="Scope" title={<>In the<br />box.</>}>
        <Reveal><Ticks items={d.box} /></Reveal>
      </Section>
      <DepthSection fig={`Service ${d.n} · ${d.name}`} caption="Directed by people · produced at machine speed" title={d.depthTitle} slot={`service-${d.slug}-depth`} alt={d.name}>
        <LightTunnel />
      </DepthSection>
      <Steps steps={d.steps} />
      <Practice d={d} />
      <Metric d={d} />
      <Section label="Packages" title={<>Matching<br />packages.</>}>
        <Packages only={d.packages} />
      </Section>
      <Section label="Questions" title={<>Questions,<br />answered.</>}>
        <Faq items={d.faqs} />
      </Section>
      <section className="pb-12">
        <p className="wrap label">Business days count from the accepted quote and the delivery of all materials.</p>
      </section>
      <Closing title={d.closing} />
    </>
  );
}
