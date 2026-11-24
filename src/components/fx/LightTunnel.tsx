"use client";

import { useRef } from "react";
import { useVisibleLoop } from "@/lib/motion";

/** Full-screen generative visual: a tunnel of white light with one magenta line racing through it. */
export function LightTunnel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rings = useRef(Array.from({ length: 34 }, (_, i) => i / 34));

  useVisibleLoop(ref, (t, dt) => {
    const c = ref.current!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const W = Math.round(c.clientWidth * dpr), H = Math.round(c.clientHeight * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext("2d")!;
    const cx = W / 2 + Math.sin(t * 0.4) * W * 0.04, cy = H * 0.52 + Math.cos(t * 0.3) * H * 0.03;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
    g.addColorStop(0, "#fff"); g.addColorStop(0.08, "#c9c9d6"); g.addColorStop(0.35, "#1a1a22"); g.addColorStop(1, "#000");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < rings.current.length; i++) {
      let z = rings.current[i] - dt * 0.35;
      if (z <= 0) z += 1;
      rings.current[i] = z;
      const s = 1 / (z * 3 + 0.05);
      const rw = W * 0.18 * s, rh = H * 0.12 * s;
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.6, (1 - z) * 0.7)})`;
      ctx.lineWidth = Math.max(1, (1 - z) * 6 * dpr);
      ctx.beginPath();
      ctx.roundRect(cx - rw, cy - rh, rw * 2, rh * 2, rh * 0.5);
      ctx.stroke();
    }
    // magenta light line
    const y = cy + H * 0.12;
    const lg = ctx.createLinearGradient(0, y, W, y);
    lg.addColorStop(0, "rgba(255,0,255,0)"); lg.addColorStop(0.5, "rgba(255,0,255,1)"); lg.addColorStop(1, "rgba(255,0,255,0)");
    ctx.fillStyle = lg;
    ctx.shadowColor = "#f0f"; ctx.shadowBlur = 30 * dpr;
    ctx.fillRect(0, y - 2 * dpr, W, 4 * dpr);
    ctx.shadowBlur = 0;
  });

  return <canvas ref={ref} aria-hidden className={`block size-full ${className}`} />;
}
