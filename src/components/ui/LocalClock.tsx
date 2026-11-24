"use client";

import { useEffect, useState } from "react";

type Props = { timeZone: string; className?: string };

/**
 * Live HH:MM clock for the studio's time zone.
 * Renders "--:--" on the server and fills in after hydration,
 * so the prerendered HTML never contains a stale time.
 */
export function LocalClock({ timeZone, className }: Props) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <time className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
