"use client";

import { useEffect, useRef } from "react";

/** 1px magenta bar across the top that fills as you scroll the page. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current!.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    update();
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left scale-x-0 bg-accent" />;
}
