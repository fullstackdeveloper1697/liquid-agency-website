"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChromeSprite } from "@/components/fx/ChromeSprite";
import { Words } from "@/components/global/Words";
import { Reveal } from "@/components/ui/Reveal";
import { reducedMotion } from "@/lib/motion";

/** Edit the figures here. */
const FACTS = [
  { v: 6, u: "", l: "disciplines in one layer, from strategy and brand to 3D and AI" },
  { v: 120, u: "+", l: "years of combined experience across the network" },
  { v: 300, u: "+", l: "projects delivered across platforms and brands" },
  { v: 50, u: "+", l: "brands supported across many industries" },
  { v: 15, u: "+", l: "senior specialists in the network, one team per project" },
  { v: 24, u: "/7", l: "AI agents at work on research, versions and checks while the team sleeps" },
  { v: 12, u: "h", l: "until a real person answers your brief" },
];

const Arrow = () => (
  <svg viewBox="0 0 10 10" aria-hidden className="ml-1.5 inline size-2.5 align-baseline"><path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
);

/** Odometer: every digit rolls through a strip of numbers and lands on its value (reference .od). */
function Odometer({ value, delay }: { value: number; delay: number }) {
  const digits = String(value).split("").map(Number);
  return (
    <span aria-hidden className="od" style={{ "--dl": `${delay}ms` } as React.CSSProperties}>
      {digits.map((d, j) => {
        const k = 20 + j * 10 + d;
        return (
          <span key={j} className="od__d" style={{ "--k": k, "--j": j } as React.CSSProperties}>
            <span className="od__g">{d}</span>
            <span className="od__s">
              {Array.from({ length: k + 1 }, (_, n) => <i key={n}>{n % 10}</i>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * Studio, in the reference's structure: heading row, seven key figures with
 * rolling digits and a magenta bar, a note card with a chrome shape, then the
 * "orchestrated, not relayed" diagram with pulses travelling down each chain.
 */
export function Studio() {
  const list = useRef<HTMLUListElement>(null);
  const viz = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = [...(list.current?.querySelectorAll<HTMLElement>(".kf") ?? [])];
    const fig = viz.current;
    if (reducedMotion()) {
      items.forEach((k) => k.classList.add("is-count"));
      list.current?.querySelectorAll(".od").forEach((o) => o.classList.add("is-on"));
      fig?.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        if (el === fig) el.classList.add("in");
        else {
          el.classList.add("is-count");
          el.querySelector(".od")?.classList.add("is-on");
        }
        io.unobserve(el);
      }),
      { threshold: 0.6 },
    );
    items.forEach((k) => io.observe(k));
    if (fig) io.observe(fig);
    return () => io.disconnect();
  }, []);

  return (
    <section data-calm="1" className="relative z-[2] -mt-[26svh] py-[clamp(88px,10vw,152px)] motion-reduce:mt-0">
      <div className="wrap">
        <div className="grid grid-cols-4 gap-x-[var(--gutter)] gap-y-6 md:grid-cols-8 lg:grid-cols-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
            <p className="label mb-6" data-scramble>Studio</p>
            <h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]">
              <Words>One lead.<br />Many hands.</Words>
            </h2>
          </Reveal>
          <Reveal className="col-span-4 self-end md:col-span-8 lg:col-span-5">
            <Link href="/studio" className="link">Meet the studio and the network<Arrow /></Link>
          </Reveal>
        </div>

        <ul ref={list} className="kfs" aria-label="The studio in figures">
          {FACTS.map((f, i) => (
            <Reveal as="li" key={f.l} delay={(i % 4) * 90} className="kf" style={{ "--i": i, "--ud": `${(i % 4) * 140}ms` } as React.CSSProperties}>
              <span aria-hidden className="text-nano tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</span>
              <p className="kf__v font-display">
                <Odometer value={f.v} delay={(i % 4) * 140} />
                <span className="sr-only">{f.v}{f.u}</span>
                <span className="kf__u">{f.u}</span>
              </p>
              <p className="kf__t">{f.l}</p>
              <span aria-hidden className="kf__bar" />
            </Reveal>
          ))}
          <Reveal as="li" delay={300} className="kf kf--note">
            <span aria-hidden className="kf__ico"><ChromeSprite shape={0} speed={0.5} draggable className="size-full" /></span>
            <p className="kf__q font-display">A liquid studio.<br />Sharp taste.<br /><span className="text-accent">Fast delivery.</span></p>
            <Link href="/studio" className="link text-micro">How the studio works<Arrow /></Link>
          </Reveal>
        </ul>

        <div className="mt-[clamp(112px,11vw,176px)] grid grid-cols-4 items-start gap-x-[var(--gutter)] gap-y-12 md:grid-cols-8 lg:grid-cols-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-4 lg:pt-8">
            <p className="text-lead">Orchestrated, not relayed.</p>
            <p className="mt-6 text-dim">Your brief goes into one layer that holds the work together: it picks the specialists, tools and AI models, briefs them, directs them and checks every output before it reaches you.</p>
          </Reveal>
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <figure ref={viz} className="viz">
              <div className="viz__bar text-nano"><span>Orchestration, not relay</span><span className="text-accent">Structure</span></div>
              <div className="viz__body" aria-hidden>
                <div className="hand">
                  <div className="hand__lane hand__lane--a">
                    <p className="hand__t text-nano">Typical agency set-up</p>
                    <ol>
                      {["You", "Account manager", "Project manager", "Creative director", "Designer"].map((t) => <li key={t}><i /><span>{t}</span></li>)}
                      <li className="hand__pulse" />
                    </ol>
                  </div>
                  <div className="hand__lane hand__lane--b">
                    <p className="hand__t text-nano">This studio · one orchestration layer</p>
                    <ol>
                      <li><i /><span>You</span></li>
                      <li className="hand__lead"><i /><span>Orchestration layer</span></li>
                      <li className="hand__team"><i /><i /><i /><span>Specialists for this project</span></li>
                      <li className="hand__pulse" />
                    </ol>
                  </div>
                </div>
              </div>
              <div className="viz__foot text-micro">
                <span className="viz__big"><b className="font-display">4</b><span className="text-dim">→</span><b className="font-display text-accent">1</b></span>
                <span className="text-dim">Handoffs between your brief and the people doing the work</span>
              </div>
              <table className="sr-only">
                <caption>Handoffs from brief to the people doing the work</caption>
                <tbody>
                  <tr><td>Typical agency</td><td>You → Account manager → Project manager → Creative director → Designer</td><td>4</td></tr>
                  <tr><td>This studio</td><td>You → Orchestration layer → Specialists</td><td>1</td></tr>
                </tbody>
              </table>
            </figure>
            <p className="mt-4 flex justify-between gap-4 text-nano tracking-[0.14em] text-faint uppercase"><span>Illustration</span><span>No account managers in between</span></p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
