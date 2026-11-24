import type { ReactNode } from "react";

type Props = {
  /** small uppercase line above the title, after a magenta rule */
  eyebrow: string;
  /** title lines; the last line can be highlighted with `accentLast` */
  lines: string[];
  accentLast?: boolean;
  /** smaller title for long headlines */
  size?: "display" | "sm" | "hello";
  lead?: ReactNode;
  /** optional block on the right (columns 8–12 on desktop) */
  aside?: ReactNode;
  children?: ReactNode;
};

/**
 * Page header used by every inner page:
 * eyebrow with a magenta rule, a huge title whose words rise in one by one,
 * a lead paragraph, an optional right-hand block, and a drifting magenta glow top right.
 */
export function PageHero({ eyebrow, lines, accentLast = false, size = "display", lead, aside, children }: Props) {
  let wordIndex = 0;

  return (
    <section data-calm="0.5" className="phero relative overflow-hidden pt-[calc(var(--nav-h)+128px)] pb-[clamp(88px,10vw,152px)]">
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-[88%] -mt-[35vmax] -ml-[35vmax] size-[70vmax]"
      >
        <i
          className="absolute inset-0 block animate-drift rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, #ff00ff6b, #ff00ff29 42%, #ff00ff0d 70%, #f0f0)",
          }}
        />
      </div>

      <div className="wrap relative z-[1]">
        <p className="label fx flex items-baseline gap-3 text-dim!" style={{ "--fx-d": "0ms" } as React.CSSProperties}>
          <span aria-hidden className="h-px w-8 flex-none self-center bg-accent" />
          <span data-scramble>{eyebrow}</span>
        </p>

        <h1
          className={`font-display tracking-[-0.035em] ${
            size === "display"
              ? "mt-8 text-display leading-[0.88]"
              : size === "hello"
                ? "mt-3 text-[clamp(36px,calc(8px+5.2vw),92px)] leading-[0.92]"
                : "mt-8 text-[clamp(36px,calc(14px+6.6vw),112px)] leading-[0.9]"
          }`}
        >
          {lines.map((line, li) => {
            const isLast = li === lines.length - 1;
            const words = line.split(" ");
            return (
              <span key={li} className={`block ${accentLast && isLast ? "text-accent" : ""}`}>
                {words.map((w, wi) => {
                  const i = wordIndex++;
                  const endsWithDot = !accentLast && isLast && wi === words.length - 1 && w.endsWith(".");
                  return (
                    <span key={wi}>
                      <span className="wd">
                        <span className="wi" style={{ "--i": i } as React.CSSProperties}>
                          {endsWithDot ? (
                            <>
                              {w.slice(0, -1)}
                              <span className="text-accent">.</span>
                            </>
                          ) : (
                            w
                          )}
                        </span>
                      </span>
                      {wi < words.length - 1 ? " " : null}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </h1>

        {(lead || aside) && (
          <div className="mt-8 grid grid-cols-4 gap-x-[var(--gutter)] gap-y-12 md:grid-cols-8 lg:grid-cols-12">
            {lead && (
              <div
                className="fx col-span-4 mt-8 text-lead leading-[1.36] tracking-[-0.005em] text-dim md:col-span-6"
                style={{ "--fx-d": "420ms" } as React.CSSProperties}
              >
                {lead}
              </div>
            )}
            {aside && (
              <div
                className="fx col-span-4 self-end md:col-span-8 lg:col-span-5 lg:col-start-8"
                style={{ "--fx-d": "520ms" } as React.CSSProperties}
              >
                {aside}
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
