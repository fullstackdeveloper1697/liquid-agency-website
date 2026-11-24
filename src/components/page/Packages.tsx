import Link from "next/link";
import { packages } from "@/content/data";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Packages shown as lit 3D shopping bags on a glowing floor, each floating
 * gently with a sheen passing over it, plus the scope underneath.
 */
export function Packages({ only }: { only?: readonly string[] }) {
  const list = only ? packages.filter((p) => only.includes(p.name)) : packages;
  return (
    <div>
      <Reveal className="relative overflow-hidden rounded-[28px] bg-[#050505] px-6 pt-16 pb-10 shadow-[inset_0_0_0_1px_var(--color-line)]">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,#ff00ff3d,transparent_70%)]" />
        <div aria-hidden className="absolute inset-x-[10%] bottom-10 h-px bg-[linear-gradient(90deg,transparent,#f0f9,transparent)]" />
        <div className="relative flex flex-wrap items-end justify-center gap-[clamp(24px,5vw,80px)]">
          {list.map((p, i) => (
            <Bag key={p.name} name={p.name} time={p.time} featured={"featured" in p && !!p.featured} i={i} />
          ))}
        </div>
      </Reveal>
      <div className={`mt-[var(--gutter)] grid gap-[var(--gutter)] ${list.length === 3 ? "md:grid-cols-3" : list.length === 2 ? "md:grid-cols-2" : ""}`}>
        {list.map((p, i) => (
          <Reveal key={p.name} delay={i * 90} className="flex flex-col rounded-[22px] bg-raise p-7 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <p className="label">{p.time}</p>
            <h3 className="font-display mt-4 text-h3 leading-none">{p.name}<span className="text-accent">.</span></h3>
            <p className="mt-2 text-sm text-dim">{p.for}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-2 border-t border-line pt-5 text-sm">
              {p.includes.map((x) => (
                <li key={x} className="flex gap-3"><i className="mt-2 size-1.5 flex-none rounded-full bg-accent" />{x}</li>
              ))}
            </ul>
            <Link href={site.cta.href} className="link mt-6 self-start text-sm">Choose {p.name} ↗</Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Bag({ name, time, featured, i }: { name: string; time: string; featured: boolean; i: number }) {
  return (
    <div className="flex flex-col items-center" style={{ animation: `bag-float 5s ease-in-out ${i * -1.3}s infinite` }}>
      <div className={`relative ${featured ? "w-[clamp(140px,15vw,220px)]" : "w-[clamp(120px,12vw,180px)]"} [perspective:800px]`}>
        {/* handle */}
        <span aria-hidden className="mx-auto block h-10 w-1/2 rounded-t-full border-[5px] border-b-0 border-[#d9d9e3]" />
        {/* body */}
        <div
          className="relative -mt-1 aspect-[4/5] overflow-hidden rounded-b-[10px] rounded-t-[4px] [transform:rotateY(-14deg)] shadow-[0_40px_80px_-30px_#f0f9,inset_-14px_0_24px_-10px_#0008]"
          style={{ background: featured ? "linear-gradient(135deg,#ff4dff,#ff00ff 40%,#7a007a)" : "linear-gradient(135deg,#f4f4f8,#c9c9d3 45%,#6d6d78)" }}
        >
          <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/40 blur-md" style={{ animation: `bag-sheen 4s ease-in-out ${1 + i * 0.6}s infinite` }} />
          <span className={`font-display absolute inset-x-0 top-[38%] text-center text-[clamp(18px,1.8vw,28px)] leading-none ${featured ? "text-paper" : "text-ink"}`}>{name}<span className={featured ? "text-ink" : "text-accent"}>.</span></span>
          <span className={`absolute inset-x-0 bottom-4 text-center text-nano tracking-[0.14em] uppercase ${featured ? "text-paper/80" : "text-ink/60"}`}>{time}</span>
        </div>
      </div>
      <span aria-hidden className="mt-3 h-3 w-3/4 rounded-[50%] bg-black/70 blur-md" />
    </div>
  );
}
