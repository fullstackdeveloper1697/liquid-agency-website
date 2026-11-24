"use client";

import { useEffect } from "react";
import { reducedMotion } from "@/lib/motion";

/**
 * Smooth wheel scrolling: the page eases toward the wheel target instead of
 * jumping. Native scrolling stays in charge of keyboard, touch, scrollbars,
 * anchors, pinch-zoom, horizontal wheels, open menus and [data-native-scroll].
 */
export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const html = document.documentElement;
    let target = scrollY, cur = scrollY, active = false, raf = 0;
    const max = () => html.scrollHeight - innerHeight;
    const step = () => {
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.5) { cur = target; active = false; }
      scrollTo(0, Math.round(cur));
      if (active) raf = requestAnimationFrame(step);
    };
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (html.style.overflow === "hidden" || (e.target as HTMLElement).closest?.("dialog, [data-native-scroll], #site-menu")) return;
      e.preventDefault();
      if (!active) { cur = target = scrollY; }
      const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      target = Math.max(0, Math.min(max(), target + d));
      if (!active) { active = true; raf = requestAnimationFrame(step); }
    };
    // any native scroll (keys, scrollbar, anchors) resets the target
    const sync = () => { if (!active) cur = target = scrollY; };
    addEventListener("wheel", wheel, { passive: false });
    addEventListener("scroll", sync, { passive: true });
    return () => { removeEventListener("wheel", wheel); removeEventListener("scroll", sync); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
