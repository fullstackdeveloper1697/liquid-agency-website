"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  as?: ElementType;
  delay?: number; // ms
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Fades and lifts its content in the first time it scrolls into view.
 * Content that is already on screen, or that the visitor has scrolled past
 * (fast scroll, jump to an anchor, back/forward), is shown straight away,
 * so nothing can stay invisible.
 */
export function Reveal({ as: Tag = "div", delay = 0, className = "", style, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("in");

    // Already in view or above the viewport: show now
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) show();
    if (r.bottom <= 0) {
      el.style.transitionDelay = "0ms";
      show();
    }
    if (el.classList.contains("in")) return;

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        // in view, or scrolled past it between frames
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // Safety net: never leave content hidden for long
    const t = window.setTimeout(() => {
      const b = el.getBoundingClientRect();
      if (b.top < window.innerHeight) show();
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <Tag ref={ref} className={`rv ${className}`} style={{ ...style, "--rv-d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
