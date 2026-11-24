"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { images } from "@/content/images.generated";
import { clamp, reducedMotion } from "@/lib/motion";

const STRIPS = 10;

/** smoothstep, as on the reference */
const K = (a: number, b: number, x: number) => {
  const o = clamp((x - a) / (b - a));
  return o * o * (3 - 2 * o);
};

/**
 * Pinned "depth" study, following the reference's timeline:
 * - the picture starts in a rounded frame (60% × 40% of the screen) and opens to full bleed (--e)
 * - ten horizontal strips of the picture slide in from alternating sides while a scan line sweeps down
 * - a counter runs 000 → 100, the headline rises in
 * - at the end the picture fades and the headline flies up as the next section slides over it
 * If the slot has no image yet, the generative `children` are shown instead.
 */
export function DepthSection({
  fig,
  caption,
  title,
  slot,
  alt = "",
  overlap = false,
  children,
}: {
  fig: string;
  caption: string;
  title: [string, string];
  /** image slot; if public/images has a file with this name it replaces the generative visual */
  slot?: string;
  alt?: string;
  /** slide up over the previous pinned section (the reference does this after the statement) */
  overlap?: boolean;
  children: ReactNode;
}) {
  const src = slot ? images[slot] : undefined;
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const strips = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    const st = stage.current;
    if (!el || !st) return;
    if (reducedMotion()) {
      st.style.setProperty("--e", "1");
      st.style.setProperty("--ia", "1");
      head.current?.classList.add("in");
      return;
    }
    let raf = 0;
    let last = -9;
    const tick = () => {
      raf = 0;
      const k = innerHeight;
      const v = el.getBoundingClientRect();
      if (v.bottom < -k || v.top > k * 1.5) return;
      const p = Math.max(1, (v.height - k) / k);
      const i = (k - v.top) / k;
      if (Math.abs(i - last) < 0.0015) return;
      last = i;
      const e = K(0.22, 1.55, i);
      st.style.setProperty("--e", e.toFixed(4));
      if (i > 0.8) head.current?.classList.add("in");
      // strips + scan line
      strips.current.forEach((s, n) => s?.style.setProperty("--s", K(0.2 + n * 0.065, 0.85 + n * 0.065, i).toFixed(3)));
      st.style.setProperty("--sc", K(0.2, 1.5, i).toFixed(4));
      st.style.setProperty("--so", (K(0.2, 0.4, i) * (1 - K(1.35, 1.55, i))).toFixed(3));
      st.style.setProperty("--ia", K(1.4, 1.55, i).toFixed(3));
      st.classList.toggle("is-built", i >= 1.56);
      // exit: headline flies up and fades, picture fades
      const M = 1.42;
      const P = p - 0.64;
      const I = Math.max(1.72, M + 0.7 * (P - M) - 0.42);
      const z = K(I, I + 0.42, i);
      st.style.setProperty("--tt", `${(-z * z * 0.98 * k).toFixed(1)}px`);
      st.style.setProperty("--tto", (1 - K(I + 0.24, I + 0.42, i)).toFixed(3));
      st.style.setProperty("--fo", K(p - 0.45, p - 0.05, i).toFixed(4));
      // the next section covers the stage; hide it once fully covered
      const next = el.nextElementSibling as HTMLElement | null;
      next?.style.setProperty("--cov", (1 - K(p + 1, p + 1.3, i)).toFixed(3));
      st.style.visibility = i > p + 1.01 ? "hidden" : "visible";
      if (counter.current) counter.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    tick();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={wrap} className={`depth relative z-[2] h-[440svh] motion-reduce:h-svh ${overlap ? "-mt-[100svh] motion-reduce:mt-0" : ""}`}>
      <div ref={stage} className="depth__stage sticky top-0 grid h-svh place-items-center overflow-hidden">
        <div className="depth__media">
          {src ? (
            <>
              <Image src={src} alt={alt} fill sizes="100vw" className="depth__img object-cover" />
              <div aria-hidden className="depth__strips">
                {Array.from({ length: STRIPS }, (_, n) => (
                  <i key={n} ref={(x) => { strips.current[n] = x; }} style={{ "--k": n, backgroundImage: `url("${src}")` } as React.CSSProperties} />
                ))}
              </div>
              <span aria-hidden className="depth__scan" />
            </>
          ) : (
            <div className="absolute inset-0" style={{ opacity: "var(--e, 0)" }}>{children}</div>
          )}
          <div aria-hidden className="depth__veil" />
        </div>

        <div className="depth__meta label text-[#fffc]!">
          <span data-scramble>{fig}</span>
          <span ref={counter} className="tabular-nums">000</span>
        </div>
        <h2 ref={head} className="depth__title font-display">
          {title[0]}
          <br />
          {title[1].replace(/\.$/, "")}
          <span className="text-accent">.</span>
        </h2>
        <p className="depth__cap label text-[#ffffffb8]!">{caption}</p>
      </div>
    </section>
  );
}
