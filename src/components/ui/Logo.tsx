import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { site } from "@/config/site";

/**
 * Striped logo, built like the reference: 18 thin stripes form the mark
 * (here a placeholder "L + dot"), with the wordmark underneath.
 * Each stripe fades in behind a white wipe, holds, then wipes out again;
 * on hover a few stripes slide sideways.
 *
 * Box: 500 x 620 units. Stripes fill the top 70%, wordmark the bottom.
 * Replace MARK with your own rows to draw a different symbol.
 */

const ROWS = 18;
const STEP = 4.0157; // % of height between stripe tops
const ROW_H = 2.419; // % of height per stripe

// For each stripe: [left %, width %] segments across the 500-unit width.
const MARK: Array<Array<[number, number]>> = Array.from({ length: ROWS }, (_, i) => {
  const segs: Array<[number, number]> = [[0, 26]]; // vertical bar of the L
  // dot, a circle on the top right (rows 0..6)
  const cy = 3;
  const r = 3.4;
  const dy = i - cy;
  if (Math.abs(dy) < r) {
    const half = Math.sqrt(r * r - dy * dy) / r; // 0..1
    const cx = 82;
    const w = 18 * half;
    segs.push([cx - w, w * 2]);
  }
  // foot of the L (rows 13..17)
  if (i >= 13) segs[0] = [0, 70];
  return segs;
});

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, home`}
      className={`logo block shrink-0 justify-self-start rounded-sm transition-[width] duration-500 ease-expo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        compact ? "w-[42px]" : "w-[58px]"
      }`}
    >
      <span aria-hidden className="relative block w-full" style={{ aspectRatio: "500 / 620" }}>
        {MARK.map((segs, i) => (
          <Fragment key={i}>
            <span
              className="lg__r"
              style={{ "--i": i, top: `${(i * STEP).toFixed(3)}%`, height: `${ROW_H}%` } as CSSProperties}
            >
              {segs.map(([l, w], j) => (
                <span
                  key={j}
                  className="absolute inset-y-0 bg-current"
                  style={{ left: `${l}%`, width: `${w}%` }}
                />
              ))}
            </span>
            <span
              className="lg__b"
              style={{ "--i": i, top: `${(i * STEP).toFixed(3)}%`, height: `${ROW_H}%` } as CSSProperties}
            />
          </Fragment>
        ))}

        {/* wordmark, stretched to the full logo width */}
        <svg viewBox="0 0 500 620" className="absolute inset-0 size-full overflow-visible">
          <text
            x="0"
            y="606"
            textLength="500"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            style={{ fontFamily: "var(--f-display)", fontWeight: 720, fontSize: 150 }}
          >
            {site.name}
            <tspan>.</tspan>
          </text>
        </svg>
      </span>
    </Link>
  );
}
