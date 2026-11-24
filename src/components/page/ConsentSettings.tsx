"use client";

import { useSyncExternalStore } from "react";

const KEY = "consent.analytics"; // "granted" | "denied"
const listeners = new Set<() => void>();

function read(): "granted" | "denied" | "unset" {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}
function write(v: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
};

/**
 * Cookie choices, saved in this browser. Read `localStorage["consent.analytics"]`
 * before loading any analytics script.
 */
export function ConsentSettings() {
  const state = useSyncExternalStore(subscribe, read, () => "unset" as const);
  const on = state === "granted";

  return (
    <div className="grid grid-cols-4 gap-x-[var(--gutter)] gap-y-10 md:grid-cols-8 lg:grid-cols-12">
      <div className="col-span-4 md:col-span-8 lg:col-span-3">
        <p className="label mb-4">Your choice</p>
        <p className="font-display text-h3 leading-none">This website</p>
      </div>

      <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
        <Row
          title="Necessary"
          text="Keeps the site working and remembers this choice. Always on."
          control={<span className="label">Always on</span>}
        />
        <Row
          title="Analytics"
          text="Counts visits anonymously so we can see which pages help. Off unless you switch it on."
          control={
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label="Analytics"
              onClick={() => write(on ? "denied" : "granted")}
              className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${on ? "bg-accent" : "bg-ghost shadow-[inset_0_0_0_1px_var(--color-line)]"}`}
            >
              <span
                className={`absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform duration-300 ease-expo ${on ? "translate-x-6" : ""}`}
              />
            </button>
          }
        />
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn--primary" onClick={() => write("granted")}>
            <span className="roll">
              <span>Accept all</span>
              <span aria-hidden>Accept all</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => write("denied")}
            className="h-12 rounded-full px-6 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1px_currentColor]"
          >
            Necessary only
          </button>
          <p role="status" className="text-sm text-dim">
            {state === "unset" ? "No choice saved yet." : `Saved: analytics ${on ? "on" : "off"}.`}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ title, text, control }: { title: string; text: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-[22px] bg-raise p-6">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-dim">{text}</p>
      </div>
      {control}
    </div>
  );
}
