"use client";

import { useEffect, useState } from "react";

/**
 * Press G (or the footer button) to lay the 12 / 8 / 4 column grid over the page.
 * Ignored while typing in inputs.
 */
export function GridOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) setOn((v) => !v);
    };
    const onToggle = () => setOn((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("grid:toggle", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("grid:toggle", onToggle);
    };
  }, []);

  if (!on) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div className="wrap grid h-full grid-cols-4 gap-[clamp(16px,1.667vw,24px)] md:grid-cols-8 lg:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`h-full bg-accent/10 outline outline-1 outline-accent/25 ${
              i >= 8 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function GridToggleButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("grid:toggle"))}
      className={`hidden text-nano tracking-[0.14em] text-faint uppercase transition-colors hover:text-paper lg:inline-block ${className}`}
    >
      Grid (G)
    </button>
  );
}
