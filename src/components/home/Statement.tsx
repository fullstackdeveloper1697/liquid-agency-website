"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChromeSprite } from "@/components/fx/ChromeSprite";
import { clamp, reducedMotion } from "@/lib/motion";

/** Edit the copy here. */
const LABEL = "A liquid studio";
const LEAD = "The team that becomes your".split(" ");
const ROLES = ["project.", "brand.", "website.", "campaign.", "3D world.", "launch."];
const CHIPS = ["Sharp taste", "Fast delivery", "One point of contact"];
const BODY = "Strategy, design, code and AI production run through one workflow, so you brief one studio instead of managing ten suppliers.";

/** Five chrome shapes with service labels, placed like the reference (.sv--a … e). */
const SHAPES = [
  { n: "01", label: "Brand", href: "/services/brand-and-identity", shape: 1, x: "10%", y: "22%", w: "clamp(96px,9.6vw,176px)", z: 0.9, side: "r" },
  { n: "02", label: "Websites", href: "/services/websites-and-digital-products", shape: 0, x: "89%", y: "15%", w: "clamp(72px,7vw,124px)", z: 0.6, side: "l" },
  { n: "03", label: "Campaigns", href: "/services/campaigns-and-content", shape: 2, x: "22%", y: "84%", w: "clamp(64px,6.2vw,112px)", z: 0.5, side: "r" },
  { n: "04", label: "AI visibility", href: "/services/ai-visibility", shape: 3, x: "79%", y: "86%", w: "clamp(84px,8.4vw,150px)", z: 0.8, side: "l" },
  { n: "05", label: "Retainer", href: "/services/creative-retainer", shape: 4, x: "54%", y: "10%", w: "clamp(50px,4.6vw,84px)", z: 0.35, side: "r" },
] as const;

/** smoothstep, as on the reference */
const K = (a: number, b: number, x: number) => {
  const o = clamp((x - a) / (b - a));
  return o * o * (3 - 2 * o);
};

/**
 * Pinned statement, following the reference's timeline: words light up as you
 * scroll, the last word flips through roles, five chrome shapes travel out from
 * the centre to their spots (with their service labels), bob gently, then fly
 * past the camera while the text blurs away.
 */
export function Statement() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const roles = useRef<(HTMLSpanElement | null)[]>([]);
  const shapes = useRef<(HTMLDivElement | null)[]>([]);

  // rotating role word: 3D flip, stacked in one grid cell so the line never collapses
  useEffect(() => {
    const els = roles.current;
    els.forEach((e, i) => e?.classList.toggle("is-on", i === 0));
    if (reducedMotion()) return;
    let i = 0;
    const id = window.setInterval(() => {
      const prev = els[i];
      i = (i + 1) % ROLES.length;
      prev?.classList.remove("is-on");
      prev?.classList.add("is-out");
      window.setTimeout(() => prev?.classList.remove("is-out"), 900);
      els[i]?.classList.add("is-on");
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (reducedMotion()) {
      words.current.forEach((w) => w?.classList.add("on"));
      shapes.current.forEach((s) => { if (s) { s.style.setProperty("--o", "1"); s.style.setProperty("--lo", "1"); } });
      return;
    }
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const st = SHAPES.map(() => ({ ax: 0, ay: 0, x: 0, y: 0 }));
    const measure = () => {
      shapes.current.forEach((s, i) => {
        if (!s) return;
        const parent = s.offsetParent as HTMLElement | null;
        if (!parent) return;
        st[i].ax = s.offsetLeft + s.offsetWidth / 2 - parent.clientWidth / 2;
        st[i].ay = s.offsetTop + s.offsetHeight / 2 - parent.clientHeight / 2;
      });
    };
    measure();
    addEventListener("resize", measure);
    let pt = { x: 0.5, y: 0.5 };
    const onPointer = (e: PointerEvent) => { pt = { x: e.clientX / innerWidth, y: e.clientY / innerHeight }; };
    addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let visible = false;
    let d = Math.random() * 10;
    let last = performance.now();
    let lit = -1;
    const tick = (now: number) => {
      d += Math.min(64, now - last) / 1000;
      last = now;
      const k = innerHeight;
      const Z = innerWidth;
      const c = el.getBoundingClientRect();
      const f = (k - c.top) / k; // 0 when the section's top meets the bottom of the screen
      const r = c.height / k;
      const on = Math.round(K(0.6, 1.35, f) * (LEAD.length + 1));
      if (on !== lit) {
        lit = on;
        words.current.forEach((w, i) => w?.classList.toggle("on", i < on));
      }
      stage.current?.style.setProperty("--so", (1 - K(r - 0.55, r - 0.08, f)).toFixed(3));

      shapes.current.forEach((s, i) => {
        if (!s) return;
        const m = st[i];
        const z = SHAPES[i].z;
        const y = i * 0.07;
        const g = K(0.35 + y, 1.05 + y, f);
        const u = Math.pow(K(r - 0.8 + i * 0.03, r - 0.22 + i * 0.02, f), 1.4);
        const v = Math.hypot(m.ax, m.ay) || 1;
        const px = m.ax / v;
        const py = m.ay / v;
        const sc = (0.3 + 0.7 * g) * (1 + u * (1.4 + z * 1.6));
        const S = (1 - g) * 0.85;
        const tx = -m.ax * S + (fine ? (pt.x - 0.5) * -46 * z : 0) + Math.sin(d * 0.45 + i * 1.7) * 9 * z + px * u * Z * 0.75;
        const ty = -m.ay * S + (1.3 - f) * 120 * z + Math.cos(d * 0.55 + i) * 11 * z + (fine ? (pt.y - 0.5) * -30 * z : 0) + py * u * k * 0.8;
        m.x += (tx - m.x) * (u > 0.01 ? 0.3 : 0.1);
        m.y += (ty - m.y) * (u > 0.01 ? 0.3 : 0.1);
        s.style.setProperty("--tx", `${m.x.toFixed(1)}px`);
        s.style.setProperty("--ty", `${m.y.toFixed(1)}px`);
        s.style.setProperty("--sc", sc.toFixed(4));
        s.style.setProperty("--rz", `${(u * (i % 2 ? 1 : -1) * 70).toFixed(1)}deg`);
        s.style.setProperty("--o", (K(0.3 + y, 0.55 + y, f) * (1 - K(r - 0.2, r - 0.02, f))).toFixed(3));
        s.style.setProperty("--lo", (K(0.95 + y, 1.1 + y, f) * (1 - K(r - 0.85, r - 0.65, f))).toFixed(3));
      });
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) { last = performance.now(); raf = requestAnimationFrame(tick); }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);
    tick(performance.now());
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", measure);
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section ref={section} data-calm="1" className="statement relative h-[265vh] max-md:h-[235vh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:py-[clamp(88px,10vw,152px)]">
        <div className="pointer-events-none absolute inset-0">
          {SHAPES.map((x, i) => (
            <div
              key={x.n}
              ref={(n) => { shapes.current[i] = n; }}
              className={`sv sv--${x.side} ${i === 2 ? "max-lg:hidden" : ""}`}
              style={{ "--x": x.x, "--y": x.y, "--w": x.w } as React.CSSProperties}
            >
              <ChromeSprite shape={x.shape} speed={0.35 + i * 0.08} phase={i * 1.9} draggable className={`pointer-events-auto absolute inset-0 size-full ${i === 4 ? "blur-[1px]" : ""}`} />
              <Link href={x.href} className="sv__lab text-nano max-lg:hidden">
                <b className="tabular-nums">{x.n}</b>
                {x.label}
              </Link>
            </div>
          ))}
        </div>

        <div
          ref={stage}
          className="wrap relative z-[1] grid w-full grid-cols-4 gap-x-[var(--gutter)] md:grid-cols-8 lg:grid-cols-12"
          style={{
            opacity: "var(--so, 1)",
            filter: "blur(calc((1 - var(--so, 1)) * 8px))",
            transform: "translate3d(0, calc((1 - var(--so, 1)) * -18vh), 0) scale(calc(.94 + var(--so, 1) * .06))",
          }}
        >
          <div className="col-span-4 md:col-span-8 lg:col-span-3">
            <p className="label max-lg:mb-6" data-scramble>{LABEL}</p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            <p className="statement-text font-display text-[clamp(34px,4.6vw,84px)] leading-[0.98] tracking-[-0.035em] max-md:text-[clamp(30px,8.4vw,44px)]">
              {LEAD.map((w, i) => (
                <span key={i}>
                  <span ref={(n) => { words.current[i] = n; }} className="sw">{w}</span>{" "}
                </span>
              ))}
              <span className="rot">
                <span className="sr-only">{ROLES.join(", ")}</span>
                <span className="rot__w" aria-hidden>
                  {ROLES.map((r, i) => (
                    <span key={r} ref={(n) => { roles.current[i] = n; }} className="rot__i">{r}</span>
                  ))}
                </span>
              </span>
            </p>
            <p className="mt-8 flex flex-wrap gap-x-7 gap-y-2.5 text-nano tracking-[0.14em] text-dim uppercase">
              {CHIPS.map((t) => (
                <span key={t} className="inline-flex items-center gap-2.5">
                  <i className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_#f0fc]" /> {t}
                </span>
              ))}
            </p>
            <p className="mt-8 max-w-[60ch] text-lead leading-[1.36] text-dim">{BODY}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
