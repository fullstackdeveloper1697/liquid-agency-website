"use client";

import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "light" | "primary";
  external?: boolean;
  className?: string;
  onClick?: () => void;
};

const MAX_PULL = 6; // px

/**
 * Pill button (styles in globals.css under `.btn`):
 *  - a 320px circle of fill grows from where the pointer entered
 *  - the label rolls up and is replaced by a copy
 *  - the arrow nudges and turns 45deg
 *  - on hover devices the button leans up to 6px toward the pointer
 */
export function MagneticButton({ href, children, variant = "light", external, className = "", onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const setOrigin = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || !fine()) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX_PULL;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * MAX_PULL;
    el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
  };

  const onLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    setOrigin(e);
    if (ref.current) ref.current.style.translate = "";
  };

  const content = (
    <>
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className="btn__ico" aria-hidden>
        <svg viewBox="0 0 10 10">
          <path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
    </>
  );

  const props = {
    ref,
    className: `btn btn--${variant} [transition-property:color,box-shadow,transform,translate] ${className}`,
    onMouseEnter: setOrigin,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    "data-boost": "",
  };

  return external ? (
    <a href={href} target="_blank" rel="noopener" {...props}>
      {content}
    </a>
  ) : (
    <Link href={href} {...props}>
      {content}
    </Link>
  );
}
