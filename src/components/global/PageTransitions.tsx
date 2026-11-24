"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

/**
 * Page change, as on the reference: following an internal link fades and
 * blurs the page away for a moment (the star field warps at the same time),
 * then the next page rises in.
 * First visit: a black veil with a percentage loader, then a magenta bloom.
 */
export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLElement>(null);

  // first-load veil with a percentage counter
  useEffect(() => {
    const v = veil.current!;
    if (reducedMotion()) { v.style.display = "none"; return; }
    let n = 0, raf = 0, done = false;
    const finish = () => { done = true; };
    if (document.readyState === "complete") finish(); else addEventListener("load", finish, { once: true });
    document.fonts?.ready.then(finish);
    const t0 = performance.now();
    const tick = (now: number) => {
      const goal = done ? 100 : Math.min(90, (now - t0) / 12);
      n += (goal - n) * 0.18;
      if (pct.current) pct.current.textContent = String(Math.round(n));
      if (done && n > 99.4) { v.classList.add("veil--out"); setTimeout(() => (v.style.display = "none"), 1500); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener("load", finish); };
  }, []);

  // leave animation on internal link clicks
  useEffect(() => {
    const html = document.documentElement;
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/")) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return; // same page: let anchors and queries work natively
      if (reducedMotion()) return;
      e.preventDefault();
      html.classList.add("is-leaving");
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), 260);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [router]);

  // arriving on a new page
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("is-leaving")) return;
    html.classList.remove("is-leaving");
    html.classList.add("is-entering");
    const t = window.setTimeout(() => html.classList.remove("is-entering"), 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <div ref={veil} aria-hidden className="veil">
      <div className="veil__ld">
        <b ref={pct}>0</b>
      </div>
    </div>
  );
}
