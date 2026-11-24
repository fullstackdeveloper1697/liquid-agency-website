import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/global/Words";

/** Standard page section: label + big two-line title, then content. */
export function Section({
  id,
  label,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  label?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-calm="1" className={`relative py-[clamp(88px,10vw,152px)] ${className}`}>
      <div className="wrap relative z-[1]">
        {(label || title) && (
          <Reveal className="mb-12 grid grid-cols-4 gap-x-[var(--gutter)] gap-y-6 md:grid-cols-8 lg:grid-cols-12 lg:items-end">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              {label && <p className="label mb-6" data-scramble>{label}</p>}
              {title && <h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]"><Words>{title}</Words></h2>}
            </div>
            {intro && (
              <div className="col-span-4 text-dim md:col-span-6 lg:col-span-4 lg:col-start-9">{intro}</div>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
