import Link from "next/link";
import { site, type NavLink } from "@/config/site";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { GridToggleButton } from "@/components/ui/GridOverlay";
import { LocalClock } from "@/components/ui/LocalClock";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { FooterScene } from "./FooterScene";

/**
 * Footer, measured from the reference:
 * rounded top corners with a magenta rim, a layered night sky,
 * claim + CTA, four columns, square social tiles and an uppercase base line.
 */
export function Footer() {
  return (
    <footer data-calm="1" className="relative isolate z-[2] flex flex-col justify-end overflow-hidden md:min-h-svh rounded-t-[clamp(22px,2.6vw,40px)] bg-deep pt-24 pb-8 shadow-[inset_0_1px_#ffffff29,0_-1px_#f0f9,0_-16px_60px_-18px_#ff00ff73] md:pt-32">
      <FooterScene />

      <div className="wrap relative z-[1]">
        {/* claim + CTA */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8 pb-12">
          <p className="font-display text-h1 leading-[0.95] tracking-[-0.03em]">
            {site.tagline}
            <br />
            <span className="text-dim">{site.claim}</span>
          </p>
          <MagneticButton href={site.cta.href} variant="primary">
            {site.cta.label}
          </MagneticButton>
        </div>

        {/* columns */}
        <div className="grid grid-cols-4 gap-x-[var(--gutter)] gap-y-12 text-micro md:grid-cols-8 lg:grid-cols-12">
          <Column title="Studio" wide>
            <ul>
              <li>{site.legalName}</li>
              {site.location.address.map((line) => (
                <li key={line} className="mt-2 text-dim">
                  {line}
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Pages">
            <LinkList links={site.footerPages} />
          </Column>

          <Column title="Services">
            <LinkList links={site.services} />
          </Column>

          <Column title="Contact" wide>
            <ul>
              <li>
                <ContactRow href={`mailto:${site.contact.email}`} icon="mail">
                  {site.contact.email}
                </ContactRow>
              </li>
              <li className="mt-2.5">
                <ContactRow href={site.contact.phoneHref} icon="phone">
                  {site.contact.phone}
                </ContactRow>
              </li>
              <li className="mt-6">
                <Link href={site.cta.href} className="link group">
                  {site.cta.label} <Arrow />
                </Link>
              </li>
              <li className="mt-2">
                <Link href={site.secondaryCta.href} className="link group">
                  {site.secondaryCta.label} <Arrow />
                </Link>
              </li>
            </ul>
          </Column>
        </div>

        {/* socials */}
        <div className="mt-12 pt-3">
          <h2 className="label mb-4 text-faint!">Follow {site.name}</h2>
          <ul className="flex flex-wrap gap-3">
            {site.socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  title={s.label}
                  className="group flex rounded-xl transition-transform duration-500 ease-expo hover:-translate-y-[3px] focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-paper"
                >
                  <span className="grid size-[46px] place-items-center rounded-[13px] text-paper shadow-[inset_0_0_0_1px_#ffffff38] transition-[background-color,box-shadow,transform] duration-300 group-hover:-rotate-[8deg] group-hover:scale-[1.06] group-hover:bg-accent group-hover:shadow-[inset_0_0_0_1px_var(--color-accent),0_10px_30px_-8px_#ff00ffbf]">
                    <SocialIcon name={s.key} className="size-5" />
                  </span>
                  <span className="sr-only">
                    {s.label} {s.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* base line */}
        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-nano leading-[1.2] tracking-[0.14em] text-faint uppercase md:mt-16">
          <span>
            © <CurrentYear fallback={2026} /> {site.legalName} · {site.registration}
          </span>
          <span className="font-sans text-xs font-light tracking-[0.04em] normal-case">{site.pronunciation}</span>
          <span className="tabular-nums">
            {site.location.coords} · {site.location.code} <LocalClock timeZone={site.location.timeZone} />
          </span>
          <span className="inline-flex flex-wrap gap-x-6 gap-y-0.5">
            {site.legal.map((l) => (
              <Link key={l.href} href={l.href} className="inline-block py-1.5 transition-colors hover:text-paper">
                {l.label}
              </Link>
            ))}
          </span>
          <GridToggleButton />
        </div>
      </div>
    </footer>
  );
}

function Column({ title, wide = false, children }: { title: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={`min-w-0 md:col-span-4 lg:col-span-3 ${wide ? "col-span-4" : "col-span-2"}`}>
      <h2 className="label mb-4 text-faint!">{title}</h2>
      {children}
    </div>
  );
}

function LinkList({ links }: { links: readonly NavLink[] }) {
  return (
    <ul>
      {links.map((l, i) => (
        <li key={l.href} className={i ? "mt-2" : ""}>
          <Link href={l.href} className="link">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className="size-2.5 transition-transform duration-300 group-hover:translate-x-0.5">
      <path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ContactRow({ href, icon, children }: { href: string; icon: "mail" | "phone"; children: React.ReactNode }) {
  return (
    <a href={href} className="group inline-flex items-center gap-3 text-paper transition-colors">
      <span
        aria-hidden
        className="grid size-[34px] flex-none place-items-center rounded-full text-paper shadow-[inset_0_0_0_1px_#ff00ff73] transition-[background,box-shadow,color] duration-[400ms] [background:radial-gradient(circle_at_32%_26%,#ff96ff4d,#ff00ff1a_60%,#ff00ff0a)] group-hover:text-ink group-hover:shadow-[0_0_26px_#f0fc] group-hover:[background:var(--color-accent)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4 overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon === "mail" ? (
            <>
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </>
          ) : (
            <path d="M8 3H5.5A2 2 0 0 0 3.5 5.2 16 16 0 0 0 18.8 20.5a2 2 0 0 0 2.2-2V16l-4-1.6-2 2a12 12 0 0 1-5-5l2-2L10.4 5Z" />
          )}
        </svg>
      </span>
      <span className="pb-px tabular-nums [background:linear-gradient(var(--color-accent),var(--color-accent))_0_100%/0_1px_no-repeat] transition-[background-size] duration-[600ms] ease-expo group-hover:[background-size:100%_1px]">
        {children}
      </span>
    </a>
  );
}
