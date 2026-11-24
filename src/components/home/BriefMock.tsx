"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Words } from "@/components/global/Words";
import { Reveal } from "@/components/ui/Reveal";
import { reducedMotion } from "@/lib/motion";

/** Edit the sample conversation here. `chips` are the quick answers shown under the input; `pick` highlights some. */
const LOG: { who: "a" | "u" | "brief"; text?: string; chips?: string; pick?: number[] }[] = [
  { who: "a", text: "Hi, I'm the Brief Assistant. What are you working on?", chips: "Brand|Website|Campaign|Not sure yet" },
  { who: "u", text: "We launch a payment app in spring and need a brand and a website.", pick: [0, 1] },
  { who: "a", text: "Nice. Who is it for, and how should people feel the first time they see it?", chips: "Young professionals|Families|Businesses|Safe|Playful" },
  { who: "u", text: "Young professionals. Safe, but never boring.", pick: [0, 3] },
  { who: "brief", chips: "Looks good|Change the scope|Add files", pick: [0] },
];
const FIRST_CHIPS = "Brand|Website|Campaign|Not sure yet";

const Ico = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden><path d={d} /></svg>
);

/**
 * The intake section, built like the reference: copy on the left (sticky on
 * desktop), a browser window on the right with a brief assistant that plays a
 * scripted conversation: a cursor clicks "New project", the assistant types,
 * the visitor's answers are typed into the input and sent, and a summary card
 * appears. It loops while on screen.
 */
export function BriefMock() {
  const app = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const e = app.current;
    if (!e) return;
    const items = [...e.querySelectorAll<HTMLElement>(".msg, .brief")];
    const pickCard = e.querySelector<HTMLElement>(".app__card.is-pick");
    const typed = e.querySelector<HTMLElement>(".dock__typed");
    const send = e.querySelector<HTMLElement>(".dock__send");
    const count = e.querySelector<HTMLElement>(".dock__n");
    const bar = e.querySelector<HTMLElement>(".dock__bar");
    const chipsBox = e.querySelector<HTMLElement>(".dock__chips");
    const setChips = (s?: string) => {
      if (!chipsBox || !s) return;
      chipsBox.innerHTML = s.split("|").map((c) => `<span>${c}</span>`).join("");
    };
    const pick = (p?: number[]) => chipsBox?.querySelectorAll("span").forEach((s, i) => s.classList.toggle("on", !!p?.includes(i)));
    const progress = (n: number) => {
      bar?.style.setProperty("--bp", (n / items.length).toFixed(3));
      if (count) count.textContent = n >= items.length ? "Ready for review" : `${n} of ${items.length}`;
      e.classList.toggle("is-done", n >= items.length);
    };
    if (reducedMotion()) {
      e.classList.add("is-chat");
      items.forEach((i) => i.classList.add("on"));
      progress(items.length);
      setChips(LOG[LOG.length - 1].chips);
      pick(LOG[LOG.length - 1].pick);
      return;
    }

    let run = 0;
    const wait = (ms: number, id: number) => new Promise<boolean>((r) => setTimeout(() => r(id === run), ms));
    const reset = () => {
      e.classList.remove("is-chat", "is-typing", "is-cursor", "is-click", "is-typing-u");
      items.forEach((i) => i.classList.remove("on"));
      if (typed) typed.textContent = "";
      progress(0);
      setChips(FIRST_CHIPS);
      pickCard?.classList.remove("is-press");
      e.style.setProperty("--cx", "82%");
      e.style.setProperty("--cy", "96%");
    };
    const play = async (id: number) => {
      reset();
      if (!(await wait(900, id))) return;
      e.classList.add("is-cursor");
      if (pickCard) {
        const S = e.getBoundingClientRect();
        const L = pickCard.getBoundingClientRect();
        e.style.setProperty("--cx", `${(((L.left + L.width * 0.45 - S.left) / S.width) * 100).toFixed(1)}%`);
        e.style.setProperty("--cy", `${(((L.top + L.height * 0.5 - S.top) / S.height) * 100).toFixed(1)}%`);
      }
      if (!(await wait(950, id))) return;
      e.classList.add("is-click");
      pickCard?.classList.add("is-press");
      if (!(await wait(200, id))) return;
      e.classList.remove("is-click");
      if (!(await wait(220, id))) return;
      e.classList.add("is-chat");
      e.classList.remove("is-cursor");
      pickCard?.classList.remove("is-press");
      if (!(await wait(260, id))) return;
      let n = 0;
      for (const [k, el] of items.entries()) {
        const m = LOG[k];
        if (m.who !== "u") {
          e.classList.add("is-typing");
          if (!(await wait(n ? 820 : 520, id))) return;
          e.classList.remove("is-typing");
          el.classList.add("on");
          setChips(m.chips);
          if (m.pick) {
            if (!(await wait(750, id))) return;
            pick(m.pick);
          }
          if (!(await wait(700, id))) return;
        } else {
          pick(m.pick);
          e.classList.add("is-typing-u");
          const t = m.text ?? "";
          for (let p = 1; p <= t.length; p += 2) {
            if (typed) typed.textContent = t.slice(0, p);
            if (!(await wait(32, id))) return;
          }
          if (typed) typed.textContent = t;
          if (!(await wait(380, id))) return;
          send?.classList.add("is-hit");
          if (!(await wait(160, id))) return;
          send?.classList.remove("is-hit");
          if (typed) typed.textContent = "";
          e.classList.remove("is-typing-u");
          el.classList.add("on");
          if (!(await wait(700, id))) return;
        }
        progress(++n);
      }
      if (await wait(5200, id)) play(id);
    };
    const io = new IntersectionObserver(
      (es) => es.forEach((x) => {
        run++;
        if (x.isIntersecting) play(run);
      }),
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(e);
    return () => { run++; io.disconnect(); };
  }, []);

  return (
    <section data-calm="1" className="platform relative overflow-x-clip py-[clamp(88px,10vw,152px)]">
      <div aria-hidden className="pointer-events-none absolute top-[-30%] left-[20%] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,#f0f,transparent)] opacity-[.22]" />
      <div className="wrap relative grid grid-cols-4 gap-x-[var(--gutter)] gap-y-12 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 flex flex-col gap-6 self-center md:col-span-8 lg:sticky lg:top-[calc(var(--nav-hs)+32px)] lg:col-span-5 lg:self-start">
          <Reveal>
            <p className="label mb-6" data-scramble>The intake</p>
            <h2 className="font-display text-h2 leading-[1] tracking-[-0.02em]"><Words>Your brief in about five minutes.</Words></h2>
          </Reveal>
          <Reveal><p className="text-dim">Brief in. Structure out. Context kept. A short guided form asks the right questions and turns your answers into a structured brief before a real person picks it up.</p></Reveal>
          <Reveal className="flex flex-wrap gap-3">
            <MagneticButton href="/contact#brief" variant="primary">Open the brief form</MagneticButton>
            <MagneticButton href={site.cta.href} variant="light">Talk to a person</MagneticButton>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
          <div className="bw" aria-hidden>
            <div className="bw__bar">
              <span className="bw__dots"><i /><i /><i /></span>
              <span className="bw__tab"><span className="bw__fav" />{site.name} · Brief Assistant<span className="bw__x">×</span></span>
              <span className="bw__plus">+</span>
            </div>
            <div className="bw__url">
              <span className="bw__nav">
                <Ico d="M15 18l-6-6 6-6" /><Ico d="M9 18l6-6-6-6" /><Ico d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
              </span>
              <span className="bw__addr"><Ico d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" />brief.your-studio.com</span>
            </div>
            <div className="bw__view">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(60%_70%_at_50%_100%,rgb(255_0_255/.35),transparent_70%)]" />
              <div ref={app} className="app">
                <div className="app__bar">
                  <span className="app__icon"><b className="font-display text-[15px] leading-none text-white">l.</b></span>
                  <span className="app__name"><b>{site.name}</b><span><i />Brief Assistant</span></span>
                  <span className="app__login text-micro">Log in</span>
                </div>
                <div className="app__stage">
                  <div className="app__welcome">
                    <span className="app__icon app__icon--lg"><b className="font-display text-[28px] leading-none text-white">l.</b></span>
                    <p className="app__h">Welcome to {site.name}.<br />Let&apos;s build your project brief together.</p>
                    <p className="app__sub">This takes about 5 minutes. No account needed to start.</p>
                  </div>
                  <div className="app__log">
                    {LOG.map((m, i) =>
                      m.who === "brief" ? (
                        <div key={i} className="brief text-micro">
                          <div><span className="text-nano text-faint">Scope</span><span>Brand launch</span></div>
                          <div><span className="text-nano text-faint">Deliverables</span><span>Name, logo, identity, website</span></div>
                          <div><span className="text-nano text-faint">Delivery</span><span className="tabular-nums">11 business days</span></div>
                          <div><span className="text-nano text-faint">Next</span><span className="text-accent">A person reviews it</span></div>
                        </div>
                      ) : (
                        <p key={i} className={`msg msg--${m.who}`}>{m.text}</p>
                      ),
                    )}
                  </div>
                  <div className="app__typing"><i /><i /><i /></div>
                </div>
                <div className="app__foot">
                  <div className="app__cards">
                    <div className="app__card is-pick"><span className="app__ci app__ci--m">+</span><b>New project</b><span>Start a structured brief for a new project.</span></div>
                    <div className="app__card"><span className="app__ci app__ci--m"><Ico d="M4 6h16M4 12h16M4 18h10" /></span><b>Existing project</b><span>Continue where you left off.</span></div>
                    <div className="app__card"><span className="app__ci app__ci--v"><Ico d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></span><b>Chat</b><span>Ask about the studio, services, or your project.</span></div>
                  </div>
                  <div className="app__dock">
                    <div className="dock__meta text-nano"><span>Your brief</span><span className="dock__bar"><i /></span><span className="dock__n tabular-nums">0 of 5</span></div>
                    <div className="dock__in">
                      <span className="dock__clip"><Ico d="M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7" /></span>
                      <span className="dock__txt"><span className="dock__ph">Type your answer…</span><span className="dock__typed" /><i className="dock__caret" /></span>
                      <span className="dock__send"><Ico d="M12 19V5M5 12l7-7 7 7" /></span>
                    </div>
                    <div className="dock__chips text-micro">{FIRST_CHIPS.split("|").map((c) => <span key={c}>{c}</span>)}</div>
                  </div>
                </div>
                <span className="app__cursor" />
              </div>
            </div>
          </div>
          <p className="mt-4 flex justify-between text-nano tracking-[0.14em] text-faint uppercase"><span>brief.your-studio.com</span><span>Sample conversation</span></p>
        </div>
      </div>
    </section>
  );
}
