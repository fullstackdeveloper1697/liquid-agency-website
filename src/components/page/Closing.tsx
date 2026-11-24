import { site } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/global/Words";

/**
 * End-of-page call to action, laid out like the reference's closing:
 * a drifting magenta glow, label + giant title (columns 1–9), then the lead
 * and buttons (columns 1–6).
 */
export function Closing({
  title = ["Start", "something."],
  label = "Start a project",
  lead,
}: {
  title?: [string, string];
  label?: string;
  lead?: string;
}) {
  return (
    <section data-calm="1" className="relative overflow-hidden py-[clamp(88px,10vw,152px)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <i
          className="absolute -top-[48%] -right-[28%] block h-[150%] w-[110%] origin-[80%_20%] animate-[mg_16s_ease-in-out_infinite_alternate] rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, #ff00fff2, #ff00ff9e, #ff00ff42, #f0f0 78%)" }}
        />
      </div>
      <div className="wrap relative z-[1] grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <Reveal className="lg:col-span-9">
          <p className="label mb-12" data-scramble>{label}</p>
          <h2 className="font-display text-mega leading-[0.86] tracking-[-0.045em]">
            <Words>
              {title[0]}
              <br />
              {title[1].replace(/[.?!]$/, "")}
              <span className="text-accent">{title[1].match(/[.?!]$/)?.[0] ?? "."}</span>
            </Words>
          </h2>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-8 lg:col-span-6">
          <p className="text-lead leading-[1.36] tracking-[-0.005em] text-dim">
            {lead ?? "Tell us the idea in a few lines. A real person reads every brief and replies within 12 hours."}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton href={site.cta.href} variant="primary">{site.cta.label}</MagneticButton>
            <MagneticButton href={site.secondaryCta.href} variant="light">{site.secondaryCta.label}</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
