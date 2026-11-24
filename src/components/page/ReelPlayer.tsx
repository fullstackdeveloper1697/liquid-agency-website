"use client";

import { useRef, useState } from "react";

/**
 * Full-screen reel. Put your film at public/reel.mp4 (and a poster at public/reel.jpg);
 * until then an animated placeholder plays behind the title.
 */
export function ReelPlayer({ src = "/reel.mp4", poster }: { src?: string; poster?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  const toggle = () => {
    const v = video.current;
    if (!v || !hasVideo) return;
    if (v.paused) {
      v.muted = false;
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden pb-[clamp(48px,6vw,96px)]">
      {/* placeholder motion */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-1/4 -right-1/4 size-[80vmax] animate-drift rounded-full bg-[radial-gradient(closest-side,#ff00ff8c,#ff00ff26_50%,#f0f0)]" />
        <div className="absolute -bottom-1/3 -left-1/4 size-[70vmax] animate-drift rounded-full bg-[radial-gradient(closest-side,#c9c9d140,#f0f0)] [animation-delay:-8s]" />
      </div>

      {hasVideo && (
        <video
          ref={video}
          className="absolute inset-0 size-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onError={() => setHasVideo(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
          }}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#0000_42%,#00000085),radial-gradient(ellipse_at_50%_55%,#0000000d_25%,#0009)]" />

      <div className="wrap relative z-[1] flex flex-col items-center text-center">
        <p className="label fx flex items-center gap-2.5 text-dim!" style={{ "--fx-d": "0ms" } as React.CSSProperties}>
          <i className="size-1.5 rounded-full bg-accent" />
          Reel · A selection of our work
        </p>
        <h1 className="font-display mt-6 text-display leading-[0.88] tracking-[-0.035em]">
          <span className="wd">
            <span className="wi" style={{ "--i": 0 } as React.CSSProperties}>The</span>
          </span>
          <br />
          <span className="wd">
            <span className="wi" style={{ "--i": 1 } as React.CSSProperties}>
              reel<span className="text-accent">.</span>
            </span>
          </span>
        </h1>
        <button
          type="button"
          onClick={toggle}
          disabled={!hasVideo}
          className="fx group mt-10 grid size-24 place-items-center rounded-full text-micro font-semibold tracking-[0.14em] uppercase shadow-[inset_0_0_0_1px_#ffffff59] backdrop-blur-md transition-[background,box-shadow] duration-300 enabled:hover:bg-accent enabled:hover:shadow-[0_0_40px_#f0f9] disabled:opacity-50"
          style={{ "--fx-d": "500ms" } as React.CSSProperties}
          aria-label={hasVideo ? (playing ? "Pause reel" : "Play reel with sound") : "Reel coming soon"}
        >
          {hasVideo ? (playing ? "Pause" : "Play") : "Soon"}
        </button>
      </div>
      {/* load bar */}
      <div aria-hidden className="absolute inset-x-[var(--margin)] bottom-6 z-[1] h-px overflow-hidden bg-line">
        <i ref={bar} className={`block h-full origin-left bg-accent shadow-[0_0_10px_#f0f] ${hasVideo ? "scale-x-0" : "animate-[reel-load_3.2s_var(--ease-inout)_infinite]"}`} />
      </div>
    </section>
  );
}
