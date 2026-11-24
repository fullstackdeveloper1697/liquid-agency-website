"use client";

import { useEffect, useRef } from "react";
import { marquee } from "@/content/data";
import { reducedMotion } from "@/lib/motion";

/** Outlined text band that drifts with scroll. Grab it and throw it. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    const still = reducedMotion();
    let x = 0, v = -0.6, drag = false, lastX = 0, lastY = scrollY, raf = 0;
    const half = () => el.scrollWidth / 2;
    const frame = () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (!drag) {
        v += (-0.6 - dy * 0.08 - v) * 0.06;
        x += v;
      }
      const h = half();
      if (x < -h) x += h;
      if (x > 0) x -= h;
      el.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    if (!still) raf = requestAnimationFrame(frame);
    const down = (e: PointerEvent) => { drag = true; lastX = e.clientX; el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing"; };
    const move = (e: PointerEvent) => { if (!drag) return; const d = e.clientX - lastX; lastX = e.clientX; x += d; v = d; };
    const up = () => { drag = false; el.style.cursor = ""; };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="group/mq overflow-hidden border-y border-line py-12 select-none [&.grab_span]:[-webkit-text-stroke-color:var(--color-accent)]" aria-label={marquee.join(", ")}>
      <div ref={track} aria-hidden className="flex w-max cursor-grab touch-pan-y will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center gap-12 pr-12">
            {marquee.map((m) => (
              <span key={m} className="font-display flex items-center gap-12 text-display leading-none tracking-[-0.035em] whitespace-nowrap text-transparent transition-[color,-webkit-text-stroke-color] duration-500 ease-out [-webkit-text-stroke:1px_rgb(255_255_255/.5)] hover:text-accent hover:[-webkit-text-stroke-color:var(--color-accent)]">
                {m}
                <i className="size-[0.4em] flex-none rounded-full shadow-[0_0_40px_#ff00ff73]" style={{ background: "var(--sphere)" }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
