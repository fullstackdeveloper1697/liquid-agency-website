"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cases, gallery } from "@/content/data";
import { Art } from "@/components/page/Art";
import { clamp, reducedMotion } from "@/lib/motion";

const SCREENS = [...cases.map((c) => ({ title: c.client, art: c.art })), ...gallery.slice(0, 5)].slice(0, 10);

/**
 * Reel, as on the reference: a 16:9 frame that lies tilted back (rotateX 66°)
 * and stands up as you scroll it into view. Inside, a ring of screens on
 * chrome stands turns slowly. Put a real film at public/reel.mp4 to replace it
 * on the /reel page.
 */
export function ReelCarousel() {
  const frame = useRef<HTMLAnchorElement>(null);
  const step = 360 / SCREENS.length;

  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    if (reducedMotion()) { f.style.setProperty("--u", "1"); return; }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = f.getBoundingClientRect();
      const k = innerHeight;
      f.style.setProperty("--u", clamp((k - r.top) / ((k + r.height) * 0.54)).toFixed(4));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on, { passive: true });
    tick();
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section data-calm="1" className="reel relative overflow-x-clip py-[clamp(88px,10vw,152px)]">
      <div className="wrap [perspective:min(1300px,170vw)] [perspective-origin:50%_115%]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <p className="label" data-scramble>Reel · selected moments</p>
          <Link href="/reel" className="link text-sm">Watch the full reel ↗</Link>
        </div>
        <Link
          ref={frame}
          href="/reel"
          data-cursor="view"
          data-cursor-label="Play"
          aria-label="Watch the reel"
          className="reel__frame group relative mx-auto block aspect-video w-[min(100%,1080px)] overflow-hidden rounded-[22px] bg-[radial-gradient(90%_70%_at_50%_30%,#1b0a1e,#050407_70%)] [container-type:inline-size] shadow-[inset_0_0_0_1px_var(--color-line)]"
        >
          {/* the "film": screens on stands turning on a ring */}
          <div aria-hidden className="absolute inset-0 [perspective:90cqw] [perspective-origin:50%_35%]">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_70%_at_50%_100%,rgb(255_0_255/.28),transparent_70%)]" />
            <div className="reel__ring absolute top-[14%] left-1/2 aspect-[16/10] w-[44cqw] [transform-style:preserve-3d]">
              {SCREENS.map((c, i) => (
                <div key={c.title + i} className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: `rotateY(${i * step}deg) translateZ(var(--rr))` }}>
                  <div className="relative size-full rounded-[8px] bg-[linear-gradient(180deg,#2a2a30,#0c0c0f)] p-[3%] shadow-[0_30px_60px_-20px_#000,inset_0_0_0_1px_rgb(255_255_255/.14)]">
                    <Art variant={c.art} slot={`reel-${String(i + 1).padStart(2, "0")}`} sizes="420px" className="size-full rounded-[4px]" />
                  </div>
                  {/* chrome stand */}
                  <span className="absolute top-full left-1/2 h-[14%] w-[9%] -translate-x-1/2 bg-[linear-gradient(90deg,#5b5b66,#e6e6ee_45%,#7a7a86)]" />
                  <span className="absolute top-[113%] left-1/2 h-[5%] w-[46%] -translate-x-1/2 rounded-[50%] bg-[linear-gradient(180deg,#d9d9e3,#4a4a55)] shadow-[0_10px_20px_-6px_#000]" />
                </div>
              ))}
            </div>
          </div>
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_40%,rgb(0_0_0/.6))]" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 scale-90 place-items-center rounded-full text-micro font-semibold tracking-[0.14em] uppercase opacity-0 shadow-[inset_0_0_0_1px_#ffffff59] backdrop-blur-md transition-[opacity,transform] duration-500 ease-expo group-hover:scale-100 group-hover:opacity-100">Play</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
