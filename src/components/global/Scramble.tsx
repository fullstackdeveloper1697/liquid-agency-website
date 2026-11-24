"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { reducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/+-";

/**
 * Small uppercase labels marked [data-scramble] decode from random glyphs into
 * their text the first time they scroll into view.
 */
export function Scramble() {
  const pathname = usePathname();
  useEffect(() => {
    if (reducedMotion()) return;
    const run = (el: HTMLElement) => {
      const final = el.dataset.text ?? el.textContent ?? "";
      el.dataset.text = final;
      const t0 = performance.now(), dur = 650;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const fixed = Math.floor(final.length * k);
        let s = final.slice(0, fixed);
        for (let i = fixed; i < final.length; i++) s += final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        el.textContent = s;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { io.unobserve(e.target); run(e.target as HTMLElement); }
    }), { rootMargin: "0px 0px -8% 0px" });
    const t = window.setTimeout(() => document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => io.observe(el)), 60);
    return () => { window.clearTimeout(t); io.disconnect(); };
  }, [pathname]);
  return null;
}
