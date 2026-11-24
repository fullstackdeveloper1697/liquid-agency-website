"use client";

import { useRef } from "react";
import { useVisibleLoop } from "@/lib/motion";

/** Full-screen generative visual: flowing chrome and magenta ribbons in a dark studio. */
export function LiquidRibbons({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useVisibleLoop(ref, (t) => {
    const c = ref.current!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const W = Math.round(c.clientWidth * dpr), H = Math.round(c.clientHeight * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#050407"; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W * 0.7, H * 0.3, W * 0.6);
    glow.addColorStop(0, "rgba(255,0,255,.35)"); glow.addColorStop(1, "rgba(255,0,255,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let r = 0; r < 26; r++) {
      const k = r / 26;
      const magenta = r % 5 === 0;
      ctx.strokeStyle = magenta ? `rgba(255,0,255,${0.55 - k * 0.3})` : `rgba(220,222,235,${0.28 - k * 0.18})`;
      ctx.lineWidth = (magenta ? 3 : 1.5) * dpr;
      ctx.beginPath();
      for (let x = -20; x <= W + 20; x += 12 * dpr) {
        const u = x / W;
        const y = H * (0.25 + k * 0.55) + Math.sin(u * 5 + t * 0.6 + k * 4) * H * 0.08 + Math.sin(u * 11 - t * 0.9 + k * 9) * H * 0.025;
        if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  });

  return <canvas ref={ref} aria-hidden className={`block size-full ${className}`} />;
}
