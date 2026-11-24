"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type Ref } from "react";
import { site, type NavLink } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

export type MenuState = "closed" | "open" | "leaving";

type Props = {
  state: MenuState;
  pathname: string;
  onClose: () => void;
  /** a link was clicked: slide the panel away fast, then navigate */
  onNavigate: () => void;
};

/**
 * Side menu, modelled on the original:
 *  - a dark scrim (black 72%) fades over the page
 *  - a narrow panel (34vw, min 420px, full width on phones) is revealed
 *    from its right edge with a clip-path wipe (0.8s expo)
 *  - a big magenta light sits on the panel's top-right corner, breathing slowly
 *  - the 7 page links rise and straighten one after another (45ms apart)
 *  - on hover each letter rolls up and is replaced by a magenta copy (24ms apart)
 *  - Services and More sit in two columns under a hairline, then the CTA and legal links
 *  - clicking a link slides the whole panel out to the right in 0.36s
 */
export function MenuOverlay({ state, pathname, onClose, onNavigate }: Props) {
  const open = state === "open";
  const leaving = state === "leaving";
  const visible = open || leaving;
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Escape closes, page scroll locks, focus moves to the first link
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 120);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  // Panel: clip-path wipe in/out, or a fast slide out when a link is followed
  const panelStyle: CSSProperties = leaving
    ? {
        clipPath: "inset(0 0 0 0)",
        transform: "translate3d(100%,0,0)",
        transition: "transform .36s cubic-bezier(.6,0,.86,.36)",
        visibility: "visible",
      }
    : open
      ? {
          clipPath: "inset(0 0 0 0)",
          transition: "clip-path .8s var(--ease-expo)",
          visibility: "visible",
        }
      : {
          clipPath: "inset(0 0 0 100%)",
          transition: "clip-path .8s var(--ease-expo), visibility 0s .8s",
          visibility: "hidden",
        };

  return (
    <>
      {/* scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-[44] bg-ink/72 backdrop-blur-[6px]"
        style={{
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: open
            ? "opacity .6s var(--ease-out)"
            : `opacity ${leaving ? ".3s" : ".6s"} var(--ease-out), visibility 0s .6s`,
        }}
      />

      {/* panel */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!visible}
        inert={!open}
        style={panelStyle}
        className="fixed inset-y-0 right-0 z-[45] w-screen overflow-hidden bg-[#060606] shadow-[-1px_0_0_rgb(255_255_255/0.08),-40px_0_120px_-40px_rgb(255_0_255/0.35)] md:w-[max(420px,34vw)]"
      >
        {/* magenta light centred on the panel's top-right corner */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <i
            className="absolute left-full top-0 block aspect-square w-[210%] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-menu-glow"
            style={{
              background:
                "radial-gradient(closest-side, rgb(255 0 255 / .95), rgb(255 0 255 / .78) 26%, rgb(255 0 255 / .5) 54%, rgb(255 0 255 / .24) 80%, rgb(255 0 255 / .08) 94%, transparent)",
            }}
          />
        </div>

        <div className="relative z-[1] flex h-full flex-col gap-12 overflow-y-auto px-[clamp(28px,3vw,52px)] pt-[calc(var(--nav-h)+24px)] pb-8">
          <nav aria-label="All pages" className="flex flex-1 flex-col gap-12">
            {/* big page links */}
            <ul className="mt-5 flex flex-col gap-0.5">
              {site.pages.map((link, i) => (
                <li key={link.href}>
                  <MenuLink
                    ref={i === 0 ? firstLink : undefined}
                    link={link}
                    index={i}
                    open={visible}
                    active={pathname === link.href}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>

            {/* Services | More */}
            <div
              className="grid grid-cols-1 gap-x-8 gap-y-2 border-t border-paper/10 pt-8 md:grid-cols-2 md:grid-rows-[auto_auto]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(20px)",
                transition: "opacity .6s .3s, transform .8s var(--ease-expo) .3s",
              }}
            >
              <SideList title="Services" links={site.services} onNavigate={onNavigate} />
              <SideList title="More" links={site.more} onNavigate={onNavigate} />
            </div>
          </nav>

          {/* CTA, copyright, legal */}
          <div
            className="flex flex-col items-start gap-4 text-micro"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity .6s var(--ease-out) .4s",
            }}
          >
            <MagneticButton href={site.cta.href} variant="primary" onClick={onNavigate}>
              {site.cta.label}
            </MagneticButton>
            <span className="text-dim">© {site.legalName}</span>
            <span className="flex flex-wrap gap-x-6 gap-y-2 text-dim">
              {site.legal.map((l) => (
                <Link key={l.href} href={l.href} onClick={onNavigate} className="transition-colors hover:text-paper">
                  {l.label}
                </Link>
              ))}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

type MenuLinkProps = {
  link: NavLink;
  index: number;
  open: boolean;
  active: boolean;
  onNavigate: () => void;
  ref?: Ref<HTMLAnchorElement>;
};

/** One big link: rises in with a slight tilt, letters roll to magenta on hover. */
function MenuLink({ link, index, open, active, onNavigate, ref }: MenuLinkProps) {
  const chars = Array.from(link.label);

  return (
    <Link
      ref={ref}
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className="group flex origin-bottom-left items-baseline gap-3 py-0.5 font-display text-menu leading-none tracking-[-0.035em] outline-none focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-accent"
      style={{
        opacity: open ? 1 : 0,
        transform: open ? "none" : "translateY(40%) rotate(3deg)",
        transition: "opacity .64s var(--ease-out), transform .64s var(--ease-expo)",
        transitionDelay: open ? `${index * 45}ms` : "0ms",
      }}
    >
      <sup className="top-[-0.2em] min-w-[2.2em] font-sans text-nano font-normal tracking-[0.14em] text-faint">
        {String(index + 1).padStart(2, "0")}
      </sup>

      <span className="sr-only">{link.label}</span>
      {/* letters: each one carries a magenta copy 1.04em below it (text-shadow) */}
      <span
        aria-hidden
        className={`-ml-[0.04em] -mr-[0.12em] inline-flex h-[1.04em] overflow-hidden pl-[0.04em] pr-[0.12em] leading-[1.04em] ${
          active ? "text-accent" : "text-paper"
        }`}
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            className="inline-block [text-shadow:0_1.04em_0_var(--color-accent)] group-hover:-translate-y-[1.04em] group-focus-visible:-translate-y-[1.04em]"
            style={{
              transition: "transform .55s var(--ease-expo)",
              transitionDelay: `${i * 24}ms`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </Link>
  );
}

function SideList({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: readonly NavLink[];
  onNavigate: () => void;
}) {
  return (
    <div className="contents">
      <p className="label mt-4 text-faint! md:row-start-1 md:mt-0">{title}</p>
      <ul className="flex flex-col gap-2 text-sm md:row-start-2">
        {links.map((l) => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noopener" className="link">
                {l.label} ↗
              </a>
            ) : (
              <Link href={l.href} onClick={onNavigate} className="link">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
