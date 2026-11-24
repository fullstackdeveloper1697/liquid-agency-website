"use client";

import { useEffect, useRef } from "react";
import { steps } from "@/content/data";
import { ChromeSprite } from "@/components/fx/ChromeSprite";
import { Words } from "@/components/global/Words";
import { Reveal } from "@/components/ui/Reveal";
import { clamp, reducedMotion } from "@/lib/motion";

/** Edit the section copy here. The last final word is drawn in the accent colour. */
const LABEL = "How the work flows";
const TITLE: [string, string] = ["People decide.", "Machines follow."];
const FINAL = ["Think.", "Make.", "Ship."];
const SHAPES = 6;

/** smoothstep between a and b, as on the reference */
const K = (a: number, b: number, x: number) => {
  const o = clamp((x - a) / (b - a));
  return o * o * (3 - 2 * o);
};

/**
 * Pinned 400vh stage, following the reference's timeline:
 * 0–.4   heading and four steps; each step lights up as you scroll (.03 + i·.08)
 * .4–.5  the content blurs and shrinks away
 * .4–.75 three final words travel in from depth, one after another
 * 0–.88  six chrome shapes orbit the centre in perspective, then rush past the camera
 * .74–1  the final words push towards you and fade; a magenta flash peaks at .93
 */
export function Warp() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLParagraphElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const stepEls = useRef<(HTMLLIElement | null)[]>([]);
  const wordEls = useRef<(HTMLSpanElement | null)[]>([]);
  const shapeEls = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (reducedMotion()) {
      stepEls.current.forEach((s) => s?.classList.add("on"));
      return;
    }
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let t = Math.random() * 10;
    let pt = { x: 0.5, y: 0.5 };
    const onPointer = (e: PointerEvent) => { pt = { x: e.clientX / innerWidth, y: e.clientY / innerHeight }; };

    const tick = (now: number) => {
      t += Math.min(64, now - last) / 1000;
      last = now;
      const r = el.getBoundingClientRect();
      const k = innerHeight;
      const Z = innerWidth;
      const L = clamp(-r.top / Math.max(1, r.height - k));

      // heading + steps
      stepEls.current.forEach((s, i) => s?.classList.toggle("on", L > 0.03 + i * 0.08));
      const co = 1 - K(0.4, 0.5, L);
      const ci = K(0.4, 1, clamp((k - r.top) / k));
      const c = content.current!;
      c.style.opacity = (co * ci).toFixed(3);
      c.style.filter = co < 0.999 ? `blur(${((1 - co) * 8).toFixed(2)}px)` : "none";
      c.style.transform = `translate3d(0,${((1 - ci) * 56).toFixed(1)}px,0) scale(${(0.9 + co * 0.1).toFixed(4)})`;
      c.style.pointerEvents = co < 0.5 ? "none" : "";

      // final words
      wordEls.current.forEach((w, i) => {
        if (!w) return;
        const f = K(0.4 + i * 0.07, 0.54 + i * 0.07, L);
        w.style.opacity = f.toFixed(3);
        w.style.transform = `translateZ(${((f - 1) * 2200).toFixed(1)}px) rotateX(${((1 - f) * 30).toFixed(2)}deg)`;
        w.style.filter = f > 0.995 ? "none" : `blur(${((1 - f) * 12).toFixed(2)}px)`;
        if (i === FINAL.length - 1) w.style.textShadow = `0 0 ${(f * 40).toFixed(1)}px rgb(255 0 255 / .55)`;
      });
      const push = K(0.74, 0.99, L);
      const y = Math.pow(push, 1.7) * (fine ? 772 : 600);
      const wp = words.current!;
      wp.style.transform = y < 0.05 ? "none" : `scale(${(800 / (800 - y)).toFixed(3)})`;
      wp.style.opacity = (1 - K(fine ? 0.93 : 0.88, fine ? 1 : 0.97, L)).toFixed(3);
      flash.current!.style.opacity = (K(0.86, 0.93, L) * (1 - K(0.93, 0.995, L)) * 0.55).toFixed(3);

      // orbiting chrome shapes
      const desk = Z >= 1024;
      const phone = Z < 768;
      const D = 800;
      const cx = desk ? 0.255 * Z : 0;
      const cy = desk ? -0.15 * k : phone ? -0.29 * k : -0.27 * k;
      const R = desk ? Math.min(0.18 * Z, 340) : phone ? 0.34 * Z : 0.3 * Z;
      const tilt = desk ? 0.42 : 0.36;
      const tc = Math.sqrt(1 - tilt * tilt);
      const base = t * 0.2 + L * 2.6;
      shapeEls.current.forEach((s, M) => {
        if (!s) return;
        const a = base + (M * Math.PI * 2) / SHAPES;
        const X = Math.cos(a) * R;
        const I = Math.sin(a) * R;
        const z = I * tc;
        const Y = I * tilt + Math.sin(t * 0.7 + M * 2) * 6;
        const C = D / (D - z);
        const O = K(0.4 + M * 0.03, 0.82 + M * 0.02, L);
        const fly = O * 690 - (1 - K(0, 0.1, L)) * 600;
        const ot = D / (D - fly);
        const px = fine ? (pt.x - 0.5) * -46 * 0.6 : 0;
        const py = fine ? (pt.y - 0.5) * -30 * 0.6 : 0;
        const W = (cx + X * C) * ot + px;
        const H = (cy + Y * C) * ot + py;
        const sc = C * ot;
        s.style.transform = `translate3d(-50%,-50%,0) translate3d(${W.toFixed(1)}px,${H.toFixed(1)}px,0) scale(${sc.toFixed(3)}) rotate(${(Math.sin(t * 0.4 + M) * 14 + O * 120 * (M % 2 ? 1 : -1)).toFixed(1)}deg)`;
        const T = (I / R + 1) / 2;
        s.style.zIndex = String(10 + Math.round(T * 20 + O * 40));
        const op = K(0, 0.08, L) * (1 - K(0.72, 0.88, L + M * 0.01)) * (0.42 + 0.58 * Math.max(T, O));
        s.style.opacity = op.toFixed(3);
        s.style.visibility = op < 0.005 ? "hidden" : "visible";
      });

      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) { last = performance.now(); raf = requestAnimationFrame(tick); }
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);
    addEventListener("pointermove", onPointer, { passive: true });
    tick(performance.now());
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section ref={section} data-calm="1" className="warp relative z-[1] -mt-[30svh] h-[400vh] max-md:h-[330vh] motion-reduce:mt-0 motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[var(--nav-hs)] motion-reduce:relative motion-reduce:h-auto motion-reduce:py-[clamp(88px,10vw,152px)]">
        <div className="wrap">
          <div ref={content} className="relative z-[1] will-change-transform">
            <Reveal>
              <p className="label" data-scramble>{LABEL}</p>
              <h2 className="font-display mt-6 text-h1 leading-[0.94] tracking-[-0.03em]">
                <Words>{TITLE[0]}<br />{TITLE[1]}</Words>
              </h2>
            </Reveal>
            <ol className="mt-16 grid grid-cols-4 gap-[var(--gutter)] max-md:mt-12 max-md:grid-cols-2 max-md:gap-y-8">
              {steps.map((s, i) => (
                <li key={s.step} ref={(n) => { stepEls.current[i] = n; }} className="warp-step relative pt-4">
                  <span className="mb-6 block text-nano font-medium tracking-[0.14em] uppercase tabular-nums">{String(i + 1).padStart(2, "0")} / {s.step}</span>
                  <h3 className="font-display mb-3 text-h4 leading-[1.15] tracking-[-0.01em]">{s.title}</h3>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden">
          {Array.from({ length: SHAPES }, (_, i) => (
            <span
              key={i}
              ref={(n) => { shapeEls.current[i] = n; }}
              className="absolute top-1/2 left-1/2 block aspect-square w-[clamp(64px,7vw,128px)] opacity-0 drop-shadow-[0_30px_40px_rgb(0_0_0/.55)] will-change-transform"
            >
              <ChromeSprite shape={i % 5} speed={0.35 + i * 0.08} phase={i * 1.7} className="size-full" />
            </span>
          ))}
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center [perspective:800px] motion-reduce:relative motion-reduce:mt-16">
          <p ref={words} className="font-display flex flex-col items-center text-center text-mega leading-[0.92] tracking-[-0.045em] will-change-transform">
            {FINAL.map((w, i) => (
              <span
                key={w}
                ref={(n) => { wordEls.current[i] = n; }}
                className={`block opacity-0 will-change-transform motion-reduce:opacity-100 ${i === FINAL.length - 1 ? "text-accent" : ""}`}
              >
                {w}
              </span>
            ))}
          </p>
        </div>

        <div ref={flash} aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#ff00ff,rgb(255_0_255/.6)_30%,transparent_70%)] opacity-0 mix-blend-screen" />
      </div>
    </section>
  );
}
