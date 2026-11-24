"use client";

import { useEffect, type RefObject } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Calls `cb(progress)` on every animation frame while the element is near the
 * viewport. progress = 0 when the element's top reaches the bottom of the
 * viewport, 1 when its bottom leaves the top. For sticky sections use `pinned`:
 * 0 when the top hits the top of the viewport, 1 when the bottom reaches the bottom.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  cb: (p: number, el: HTMLElement) => void,
  { pinned = false }: { pinned?: boolean } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let visible = false;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = pinned ? clamp(-r.top / Math.max(1, r.height - vh)) : clamp((vh - r.top) / (vh + r.height));
      cb(p, el);
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(tick);
        else tick();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    tick();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // cb is intentionally read fresh each frame via closure of the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, pinned]);
}

/** Runs `cb(time, dt)` every frame while the element is on screen. */
export function useVisibleLoop(ref: RefObject<HTMLElement | null>, cb: (t: number, dt: number) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let on = false;
    const loop = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      cb(t / 1000, dt);
      if (on) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      last = 0;
      if (on) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
