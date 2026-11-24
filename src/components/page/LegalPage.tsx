import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { legalDocs } from "@/content/legal";
import { PageHero } from "./PageHero";

/**
 * Legal page layout, as on the reference: white page, small hero with a
 * facts list on the right, a sticky table of contents, numbered sections,
 * and links to the other legal documents at the end.
 */
export function LegalPage({
  current,
  title,
  lead,
  updated,
  sections,
  children,
}: {
  current: string;
  title: [string, string];
  lead: string;
  updated: string;
  sections?: { title: string; body: string[] }[];
  children?: ReactNode;
}) {
  const others = [
    ...legalDocs.map((d) => ({ href: `/${d.slug}`, label: `${d.title[0]} ${d.title[1]}`.replace(/\.$/, "") })),
    { href: "/cookie-settings", label: "Cookie settings" },
  ].filter((d) => d.href !== `/${current}`);

  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(updated),
  );

  return (
    <div data-light-page>
      <PageHero
        eyebrow={`Legal · ${site.legalName}`}
        size="sm"
        lines={title}
        lead={lead}
        aside={
          <dl className="grid gap-4 text-micro">
            <Meta k="Company" v={`${site.legalName} · ${site.registration}`} />
            <Meta k="Last updated" v={date} />
            <Meta
              k="Questions"
              v={
                <a className="link" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              }
            />
          </dl>
        }
      />

      <section className="pt-8 pb-[clamp(88px,10vw,152px)]">
        <div className="wrap grid grid-cols-4 gap-x-[var(--gutter)] gap-y-12 md:grid-cols-8 lg:grid-cols-12">
          {sections ? (
            <>
              <aside aria-label="Sections" className="col-span-4 md:col-span-8 lg:col-span-3">
                <div className="lg:sticky lg:top-[calc(var(--nav-hs)+32px)]">
                  <p className="label mb-4">On this page</p>
                  <ol className="flex flex-col gap-2 text-sm">
                    {sections.map((s, i) => (
                      <li key={s.title}>
                        <a href={`#s${i + 1}`} className="group flex gap-3 text-dim transition-colors hover:text-[inherit]">
                          <span className="w-6 text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                          <span className="link">{s.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>

              <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
                {sections.map((s, i) => (
                  <article key={s.title} id={`s${i + 1}`} className="scroll-mt-32 border-t border-line py-10 first:border-t-0 first:pt-0">
                    <h2 className="font-display flex items-baseline gap-4 text-h3 leading-[1.08] tracking-[-0.01em]">
                      <span className="text-nano tracking-[0.14em] text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </h2>
                    <div className="mt-4 flex max-w-[70ch] flex-col gap-3 text-dim">
                      {s.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </article>
                ))}
                <p className="mt-6 rounded-[22px] bg-raise p-6 text-sm text-dim">
                  Template text for a practice build. Have the final wording drafted or reviewed by a lawyer.
                </p>
              </div>
            </>
          ) : (
            <div className="col-span-4 md:col-span-8 lg:col-span-12">{children}</div>
          )}
        </div>
      </section>

      <section className="pb-[clamp(88px,10vw,152px)]">
        <div className="wrap">
          <p className="label mb-6">Related documents</p>
          <ul className="grid gap-[var(--gutter)] md:grid-cols-3">
            {others.map((o) => (
              <li key={o.href}>
                <Link
                  href={o.href}
                  className="group flex items-center justify-between rounded-[22px] bg-raise p-6 transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-accent)]"
                >
                  <span className="font-display text-h3 leading-none">{o.label}</span>
                  <span className="grid size-10 place-items-center rounded-full bg-ghost transition-colors group-hover:bg-accent group-hover:text-paper">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 border-t border-line pt-3">
      <dt className="text-nano tracking-[0.14em] text-faint uppercase">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
