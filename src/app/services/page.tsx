import type { Metadata } from "next";
import { faqs } from "@/content/data";
import { site } from "@/config/site";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Closing } from "@/components/page/Closing";
import { Faq } from "@/components/page/Faq";
import { Packages } from "@/components/page/Packages";
import { StackCards } from "@/components/services/StackCards";
import { TriPinned } from "@/components/services/TriPinned";
import { DepthSection } from "@/components/home/DepthSection";
import { LiquidRibbons } from "@/components/fx/LiquidRibbons";
import { Ticks } from "@/components/case/CaseBlocks";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Services" };

const terms = [
  "Fixed written quote before work starts",
  "50% to start, 50% on delivery",
  "Two revision rounds included",
  "Delivery date in writing",
  "You own every final file",
  "Source files included",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services · Worldwide"
        lines={["Brand, web,", "motion.", "One team."]}
        accentLast
        lead="Five ways to work together, three packages for a clear start, a fixed written quote for everything, and one creative lead from the first call to the last file."
        aside={
          <div className="flex justify-start lg:justify-end">
            <MagneticButton href={site.cta.href} variant="primary">{site.cta.label}</MagneticButton>
          </div>
        }
      />

      <Section label="What we do" title={<>Five ways<br />to work together.</>}>
        <StackCards />
      </Section>

      <TriPinned />

      <DepthSection fig="Services · Method" caption="Directed by people · produced at machine speed" title={["Clear scope.", "Fixed price."]} slot="services-depth" alt="Services">
        <LiquidRibbons />
      </DepthSection>

      <Section id="packages" label="Packages" title={<>Three ways<br />to start.</>} intro="Each package is a starting point with a written scope. Business days count from the accepted quote.">
        <Packages />
      </Section>

      <Section label="Terms" title={<>Clear<br />terms.</>}>
        <Reveal><Ticks items={terms} /></Reveal>
      </Section>

      <Section label="Questions" title={<>Common<br />questions.</>}>
        <Faq items={faqs} />
      </Section>

      <Closing title={["Choose a", "starting point."]} />
    </>
  );
}
