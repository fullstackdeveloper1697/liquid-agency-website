"use client";

import { useEffect, useRef } from "react";
import { createChrome, rotation, SHAPES } from "./chrome";
import { reducedMotion } from "@/lib/motion";

/**
 * Hero centrepiece: one chrome form that melts from shape to shape every few
 * seconds, with a short magenta flicker at each change. Drag to spin.
 * Falls back to a CSS orb when WebGL2 is unavailable.
 */
export function ChromeMorph({ className = "", onShape }: { className?: string; onShape?: (i: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const chrome = createChrome(canvas);
    if (!chrome) {
      canvas.style.display = "none";
      fallback.current?.style.removeProperty("display");
      return;
    }
    const still = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rot = new Float32Array(9);
    const drag = { on: false, x: 0, y: 0, vx: 0, vy: 0, lx: 0, ly: 0 };
    const HOLD = 2.6, MORPH = 1.1;
    let a = 0, b = 1, phase = 0, raf = 0, last = 0, visible = true;
    onShape?.(0);

    const frame = (now: number) => {
      const t = now / 1000;
      const dt = last ? Math.min(0.05, t - last) : 0;
      last = t;
      phase += dt;
      let k = 0;
      if (phase > HOLD) k = Math.min(1, (phase - HOLD) / MORPH);
      if (phase > HOLD + MORPH) {
        a = b;
        b = (b + 1) % SHAPES.length;
        phase = 0;
        k = 0;
        onShape?.(a);
      }
      const flick = phase > HOLD + MORPH * 0.45 && phase < HOLD + MORPH * 0.75 ? 0.35 * Math.abs(Math.sin(t * 60)) : 0;
      if (!drag.on) {
        drag.x += drag.vx;
        drag.y += drag.vy;
        drag.vx *= 0.94;
        drag.vy *= 0.94;
      }
      rotation(t * 0.35 + drag.x, Math.sin(t * 0.5) * 0.35 + drag.y, rot);
      chrome.draw({ a, b, k: k * k * (3 - 2 * k), t, rot, wob: 1, flick, zoom: 0.78 });
      if (visible && !still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const down = (e: PointerEvent) => {
      drag.on = true;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag.on) return;
      drag.vx = (e.clientX - drag.lx) * 0.01;
      drag.vy = (e.clientY - drag.ly) * 0.01;
      drag.x += drag.vx;
      drag.y += drag.vy;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
    };
    const up = () => (drag.on = false);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className || "relative"}>
      <canvas ref={ref} aria-hidden className="size-full cursor-grab touch-pan-y active:cursor-grabbing" />
      <div ref={fallback} aria-hidden style={{ display: "none", background: "var(--sphere)" }} className="absolute inset-[12%] rounded-full" />
    </div>
  );
}
