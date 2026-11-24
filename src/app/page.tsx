import { faqs } from "@/content/data";
import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { DepthSection } from "@/components/home/DepthSection";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { Marquee } from "@/components/home/Marquee";
import { ReelCarousel } from "@/components/home/ReelCarousel";
import { ArchiveSpiral } from "@/components/home/ArchiveSpiral";
import { Clients } from "@/components/home/Clients";
import { Warp } from "@/components/home/Warp";
import { Studio } from "@/components/home/Studio";
import { BriefMock } from "@/components/home/BriefMock";
import { ClosingPlanet } from "@/components/home/ClosingPlanet";
import { LightTunnel } from "@/components/fx/LightTunnel";
import { LiquidRibbons } from "@/components/fx/LiquidRibbons";
import { FaqSection } from "@/components/page/Faq";

/**
 * Home: 14 sections, in the order and rhythm of the reference site,
 * with original content, artwork and code.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <DepthSection fig="Fig. 01 · Speed study" caption="Generative study · directed and refined by people" title={["Built for", "speed."]} slot="depth-01" alt="Speed study" overlap>
        <LightTunnel />
      </DepthSection>
      <ServicesShowcase />
      <Marquee />
      <ReelCarousel />
      <DepthSection fig="Fig. 02 · Material study" caption="Light, chrome and colour · art-directed" title={["Made with", "care."]} slot="depth-02" alt="Material study">
        <LiquidRibbons />
      </DepthSection>
      <ArchiveSpiral />
      <Clients />
      <Warp />
      <Studio />
      <BriefMock />
      <FaqSection items={faqs} title={<>Good to<br />know.</>} />
      <ClosingPlanet />
    </>
  );
}
