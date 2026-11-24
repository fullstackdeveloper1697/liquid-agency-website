"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Copyright year that stays correct without rebuilding the site. */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <span>{year}</span>;
}
