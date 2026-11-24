"use client";

import Link from "next/link";
import { useRef } from "react";
import { site } from "@/config/site";
import { services } from "@/content/data";
import { ChromeMorph } from "@/components/fx/ChromeMorph";
import { MagneticButton } from "@/components/ui/MagneticButton";

/** Home hero: big title, claim, CTAs, and the live chrome form with a tab per service. */
export function Hero() {
  const tabs = useRef<HTMLOListElement>(null);
  const words = site.tagline.split(" ");
  const last = words.pop()!.replace(/\.$/, "");

  const onShape = (i: number) => {
    tabs.current?.querySelectorAll("li").forEach((li, j) => li.toggleAttribute("data-on", i === j));
  };

  return (
    <section className="relative flex min-h-[104svh] flex-col justify-end overflow-hidden pt-[calc(var(--nav-h)+96px)] pb-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,#ff00ff30,transparent_55%)]" />
      <ChromeMorph
        onShape={onShape}
        className="fx absolute top-[10%] right-[-18vw] h-[min(64vh,620px)] w-[min(64vh,620px)] md:top-[12%] md:right-[-4vw] md:h-[min(76vh,820px)] md:w-[min(76vh,820px)] lg:right-[2vw]"
      />

      <div className="wrap relative z-[1] pointer-events-none">
        <h1 className="font-display text-mega leading-[0.86] tracking-[-0.045em]">
          {words.map((w, i) => (
            <span key={i} className="wd">
              <span className="wi" style={{ "--i": i } as React.CSSProperties}>{w}&nbsp;</span>
            </span>
          ))}
          <br />
          <span className="wd">
            <span className="wi" style={{ "--i": words.length } as React.CSSProperties}>
              {last}
              <span className="text-accent">.</span>
            </span>
          </span>
        </h1>
        <p className="fx font-display mt-6 text-h1 leading-[0.98] tracking-[-0.03em]" style={{ "--fx-d": "600ms" } as React.CSSProperties}>
          {site.claim.split(". ")[0]}.
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_#fff]">{site.claim.split(". ").slice(1).join(". ")}</span>
        </p>
        <div className="fx pointer-events-auto mt-8 flex flex-wrap items-center gap-6" style={{ "--fx-d": "800ms" } as React.CSSProperties}>
          <MagneticButton href={site.cta.href} variant="primary">
            {site.cta.label}
          </MagneticButton>
          <Link href="/work" className="link text-sm">
            See the work ↗
          </Link>
        </div>

        <div className="fx mt-16 flex flex-wrap items-end justify-between gap-6" style={{ "--fx-d": "1000ms" } as React.CSSProperties}>
          <p className="label flex items-center gap-3">
            <span className="relative h-8 w-px overflow-hidden bg-line">
              <i className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.6s_var(--ease-inout)_infinite] bg-accent" />
            </span>
            Scroll
          </p>
          <ol ref={tabs} className="hidden gap-6 md:flex">
            {services.map((s) => (
              <li key={s.n} className="label transition-colors data-[on]:text-paper">
                <span className="text-accent">{s.n}</span> {s.title.split(" ")[0]}
              </li>
            ))}
          </ol>
          <p className="label">Est. 2024 · Working worldwide</p>
        </div>
      </div>
    </section>
  );
}
