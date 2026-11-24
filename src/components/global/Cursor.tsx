"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor, as on the reference: an 8px dot and a 40px ring (difference
 * blend). The ring trails the pointer, grows over links, fills white with a
 * label over [data-cursor="view"|"drag"] elements, and shrinks while pressed.
 * Mouse only; touch devices keep the native behaviour.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current!;
    let x = -100, y = -100, rx = x, ry = y, raf = 0, shown = false;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; el.style.display = "block"; }
      const t = e.target as HTMLElement;
      const view = t.closest<HTMLElement>("[data-cursor]");
      const link = t.closest("a, button, summary, [role=button], label, input, textarea, select");
      el.classList.toggle("is-view", !!view);
      el.classList.toggle("is-link", !view && !!link);
      if (view && label.current) label.current.textContent = view.dataset.cursor === "drag" ? "Drag" : view.dataset.cursorLabel || "View";
    };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    const leave = () => { el.style.display = "none"; shown = false; };
    const frame = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.current!.style.translate = `${x}px ${y}px`;
      ring.current!.style.translate = `${rx}px ${ry}px`;
      label.current!.style.translate = `${rx}px ${ry}px`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="cursor">
      <div ref={ring} className="cursor__pos"><i className="cursor__ring" /></div>
      <div ref={dot} className="cursor__pos"><i className="cursor__dot" /></div>
      <span ref={label} className="cursor__pos"><b className="cursor__label">View</b></span>
    </div>
  );
}
