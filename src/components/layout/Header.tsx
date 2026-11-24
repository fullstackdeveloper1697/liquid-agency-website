"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { LocalClock } from "@/components/ui/LocalClock";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MenuOverlay, type MenuState } from "./MenuOverlay";

/**
 * Fixed header.
 * - transparent at the top; after 24px it compacts and gets a dark bar with a hairline
 * - hides while scrolling down past 220px, returns when scrolling up
 * - live studio clock, main CTA and the Menu pill (clock and CTA fade out while the menu is open)
 */
export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<MenuState>("closed");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const open = menu === "open";

  // Scroll behaviour
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > lastY.current + 3 && y > 220) setHidden(true);
        else if (y < lastY.current - 3 || y < 220) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Route changed: make sure the menu is shut
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenu("closed");
  }

  const close = useCallback(() => {
    setMenu("closed");
    menuButton.current?.focus({ preventScroll: true });
  }, []);

  // A menu link was clicked: slide the panel out, then reset
  const navigate = useCallback(() => {
    setMenu("leaving");
    window.setTimeout(() => setMenu((m) => (m === "leaving" ? "closed" : m)), 380);
  }, []);

  const toggle = () => {
    if (open) {
      close();
    } else {
      setHidden(false);
      setMenu("open");
    }
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-paper px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header
        data-scrolled={scrolled && !open ? "" : undefined}
        className={`site-header fixed inset-x-0 top-0 z-50 text-paper transition-[transform,background-color] duration-[640ms] ease-out ${
          hidden && !open ? "-translate-y-[101%]" : "translate-y-0"
        } ${scrolled && !open ? "bg-ink/86" : "bg-transparent"}`}
      >
        {/* hairline under the dark bar */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-line)_20%,var(--color-line)_80%,transparent)] transition-opacity duration-300 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`wrap relative flex items-center justify-between gap-6 transition-[height] duration-500 ease-expo ${
            scrolled ? "h-[var(--nav-hs)]" : "h-[var(--nav-h)]"
          }`}
        >
          <span className="animate-nav-item [animation-delay:.55s]">
            <Logo compact={scrolled} />
          </span>

          <div className="flex items-center gap-4">
            {/* live clock */}
            <span
              className={`hidden animate-nav-item items-center gap-2 text-nano leading-[1.5] tracking-[0.14em] whitespace-nowrap text-dim uppercase tabular-nums transition-opacity duration-300 [animation-delay:.75s] lg:inline-flex ${
                open ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <span className="sr-only">Local time in {site.location.city}: </span>
              <i aria-hidden className="relative size-1.5 rounded-full bg-accent">
                <i className="absolute inset-0 animate-live rounded-full bg-accent" />
              </i>
              <span aria-hidden>{site.location.code}</span>
              <LocalClock timeZone={site.location.timeZone} />
            </span>

            <span
              className={`hidden animate-nav-item transition-opacity duration-300 [animation-delay:.85s] sm:block ${
                open ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <MagneticButton href={site.cta.href} variant="light">
                {site.cta.label}
              </MagneticButton>
            </span>

            {/* Menu pill: text + two bars that cross into an X */}
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={toggle}
              className="group relative z-[60] inline-flex size-12 animate-nav-item items-center justify-center gap-2.5 rounded-full text-sm leading-none font-semibold shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow duration-300 [animation-delay:.95s] hover:shadow-[inset_0_0_0_1px_#fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:w-auto md:pr-4 md:pl-5"
            >
              <span aria-hidden className="hidden md:inline">
                Menu
              </span>
              <span aria-hidden className="relative grid size-[18px] place-items-center">
                <i
                  className={`absolute h-[1.5px] w-[18px] bg-current transition-transform duration-300 ease-out ${
                    open
                      ? "rotate-45"
                      : "-translate-y-[3px] group-hover:-translate-y-[4px] group-hover:scale-x-[0.7]"
                  }`}
                />
                <i
                  className={`absolute h-[1.5px] w-[18px] bg-current transition-transform duration-300 ease-out ${
                    open ? "-rotate-45" : "translate-y-[3px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay state={menu} pathname={pathname} onClose={close} onNavigate={navigate} />
    </>
  );
}
