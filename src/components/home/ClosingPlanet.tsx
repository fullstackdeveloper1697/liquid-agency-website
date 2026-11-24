import { site } from "@/config/site";
import { Terrain } from "@/components/fx/Terrain";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

/** Final call to action over the glowing valley. */
export function ClosingPlanet() {
  return (
    <section className="relative h-[260svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-end overflow-hidden pt-[calc(var(--nav-hs)+24px)] pb-12">
      <Terrain />
      <div className="wrap relative z-[1]">
        <Reveal>
          <p className="label mb-12">Start a project</p>
          <h2 className="font-display text-mega leading-[0.86] tracking-[-0.045em]">
            Let&apos;s make
            <br />
            it<span className="text-accent">.</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-8 max-w-xl">
          <p className="text-lead leading-[1.36] text-paper/82">Brief us from anywhere. A real person reads every brief and replies within 12 hours.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href={site.cta.href} variant="primary">{site.cta.label}</MagneticButton>
            <MagneticButton href={site.secondaryCta.href} variant="light">{site.secondaryCta.label}</MagneticButton>
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  );
}
