"use client";

import { useEffect, useRef } from "react";
import { registerSprite } from "./chrome";
import { reducedMotion } from "@/lib/motion";

/**
 * A small spinning chrome shape. All sprites share one WebGL context
 * (see chrome.ts), so dozens can sit on a page without hitting browser limits.
 */
export function ChromeSprite({
  shape,
  speed = 0.5,
  phase = 0,
  className = "",
  draggable = false,
}: {
  shape: number;
  speed?: number;
  phase?: number;
  className?: string;
  draggable?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({ shape, speed, phase, visible: false, drag: { x: 0, y: 0 } });
  useEffect(() => {
    state.current.shape = shape;
  }, [shape]);

  useEffect(() => {
    const canvas = ref.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      // layout size (not the on-screen box) so a parent's scale() doesn't shrink the bitmap
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    size();
    const s = state.current;
    const sprite = {
      canvas,
      get shape() { return s.shape; },
      speed: reducedMotion() ? 0 : s.speed,
      phase: s.phase,
      visible: false,
      drag: s.drag,
    };
    const unregister = registerSprite(sprite);
    const io = new IntersectionObserver(([e]) => (sprite.visible = e.isIntersecting), { rootMargin: "10%" });
    io.observe(canvas);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    let lx = 0, ly = 0, on = false;
    const down = (e: PointerEvent) => { on = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!on) return; s.drag.x += (e.clientX - lx) * 0.012; s.drag.y += (e.clientY - ly) * 0.012; lx = e.clientX; ly = e.clientY; };
    const up = () => (on = false);
    if (draggable) {
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
    }
    return () => {
      unregister();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
    };
  }, [draggable]);

  return <canvas ref={ref} aria-hidden className={`${draggable ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none"} ${className}`} />;
}
