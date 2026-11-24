"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { posts } from "@/content/data";
import { Art } from "@/components/page/Art";
import { Reveal } from "@/components/ui/Reveal";

type Post = (typeof posts)[number];
const fmt = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(d));
const slotOf = (p: Post) => `journal-${String(posts.indexOf(p) + 1).padStart(2, "0")}`;

/** Filter chips, a wall of post cards and a post dialog opened with ?post=<slug>. */
export function JournalWall() {
  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.tag)))], []);
  const [tag, setTag] = useState("All");
  const list = tag === "All" ? posts : posts.filter((p) => p.tag === tag);
  const router = useRouter();
  const path = usePathname();
  const q = useSearchParams().get("post");
  const open = posts.find((p) => p.slug === q);
  const dlg = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && d.open) d.close();
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const show = (slug: string | null) => router.push(slug ? `${path}?post=${slug}` : path, { scroll: false });

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-2" role="toolbar" aria-label="Filter posts">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            className="rounded-full px-4 py-2 text-micro tracking-[0.08em] uppercase shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background,color,box-shadow] duration-300 hover:shadow-[inset_0_0_0_1px_var(--color-paper)] aria-pressed:bg-paper aria-pressed:text-ink"
          >
            {t}
            <span className="ml-2 opacity-50">{t === "All" ? posts.length : posts.filter((p) => p.tag === t).length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-x-[var(--gutter)] gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 80} className={i === 0 && tag === "All" ? "md:col-span-2 lg:col-span-2" : ""}>
            <a
              href={`${path}?post=${p.slug}`}
              onClick={(e) => { e.preventDefault(); show(p.slug); }}
              data-cursor="view"
              data-cursor-label="Read"
              className="group block"
            >
              <div className="overflow-hidden rounded-[22px]">
                <Art variant={p.art} label={p.title} slot={slotOf(p)} sizes="(min-width: 1024px) 33vw, 100vw" className={`${i === 0 && tag === "All" ? "aspect-[16/9]" : "aspect-[4/3]"} transition-transform duration-700 ease-expo group-hover:scale-[1.03]`} />
              </div>
              <p className="label mt-5 flex gap-3"><span className="text-accent">{p.tag}</span><time dateTime={p.date}>{fmt(p.date)}</time></p>
              <h3 className={`font-display mt-3 leading-[1.08] tracking-[-0.01em] transition-colors group-hover:text-accent ${i === 0 && tag === "All" ? "text-h2" : "text-h3"}`}>{p.title}</h3>
              <p className="mt-2 text-sm text-dim">{p.excerpt}</p>
            </a>
          </Reveal>
        ))}
      </div>

      <dialog
        ref={dlg}
        data-native-scroll
        onClose={() => open && show(null)}
        onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}
        className="m-auto max-h-[92svh] w-[min(880px,94vw)] overflow-y-auto rounded-[28px] bg-[#0b0b0b] p-0 text-paper shadow-[inset_0_0_0_1px_var(--color-line)] backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-[msg-in_.5s_var(--ease-expo)]"
      >
        {open && (
          <article>
            <Art variant={open.art} label={open.title} slot={slotOf(open)} className="aspect-[16/8]" />
            <div className="p-[clamp(24px,4vw,56px)]">
              <p className="label flex gap-3"><span className="text-accent">{open.tag}</span><time dateTime={open.date}>{fmt(open.date)}</time></p>
              <h2 className="font-display mt-4 text-h2 leading-none tracking-[-0.02em]">{open.title}</h2>
              <p className="mt-6 text-lead">{open.excerpt}</p>
              <div className="mt-6 flex flex-col gap-4 text-dim">
                <p>Placeholder body. Replace this with the full post. Add a <code>body</code> field to each entry in <code>src/content/data.ts</code> and render it here.</p>
                <p>Keep paragraphs short, use one image every few hundred words and end with a single clear takeaway.</p>
              </div>
            </div>
          </article>
        )}
        <button type="button" onClick={() => dlg.current?.close()} aria-label="Close" className="fixed top-6 right-6 grid size-12 place-items-center rounded-full bg-paper text-ink transition-transform hover:rotate-90">✕</button>
      </dialog>
    </>
  );
}
