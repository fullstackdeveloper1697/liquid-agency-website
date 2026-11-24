import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { ContactForm } from "@/components/page/ContactForm";
import { LocalClock } from "@/components/ui/LocalClock";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Contact" };

const promises = [
  { title: "A person reads it", text: "Every brief is read by the creative lead, not a bot." },
  { title: "Reply within 12 hours", text: "On working days, usually much faster." },
  { title: "A written quote", text: "Fixed scope, fixed price, fixed dates. No surprises." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={`Contact · ${site.location.city}`}
        size="hello"
        lines={["Let's make", "something."]}
        lead="Start with a short brief, book a 15-minute intro call, or just write. Whatever is easiest for you."
        aside={
          <div className="group/stack relative ml-auto h-[340px] w-full max-w-[400px]">
            {[
              { k: "Brief", v: site.cta.label, href: "#brief", tone: "bg-[radial-gradient(120%_90%_at_100%_0%,#ff00ff66,#1a001a_60%,#0b0b0b)]" },
              { k: "Write", v: site.contact.email, href: `mailto:${site.contact.email}`, tone: "bg-[#141414]" },
              { k: "Call", v: site.contact.phone, href: site.contact.phoneHref, tone: "bg-[#0e0e0e]" },
            ].map((c, i) => (
              <a
                key={c.k}
                href={c.href}
                className={`${c.tone} absolute inset-x-0 flex h-[180px] flex-col gap-3 rounded-[22px] px-6 py-5 shadow-[inset_0_0_0_1px_var(--color-line),0_30px_60px_-20px_#000] transition-transform duration-700 ease-expo hover:-translate-y-3`}
                style={{ top: `${i * 80}px`, zIndex: i + 1, rotate: `${(i - 1) * 2}deg` }}
              >
                <span className="label flex justify-between"><span>{String(i + 1).padStart(2, "0")} · {c.k}</span><span className="text-paper">↗</span></span>
                <span className="font-display text-h4 leading-tight break-all">{c.v}</span>
              </a>
            ))}
          </div>
        }
      />

      <Section id="brief" label="Brief" title={<>Tell us<br />the idea.</>} intro="Five fields, about two minutes. We'll reply with questions or a first plan.">
        <ContactForm />
      </Section>

      <Section id="book" label="Call" title={<>Book a<br />15-minute call.</>}>
        <Reveal className="grid gap-[var(--gutter)] md:grid-cols-3">
          {["Tue 10:00", "Wed 14:30", "Thu 11:00"].map((slot) => (
            <a
              key={slot}
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Intro call: ${slot}`)}`}
              className="group flex items-center justify-between rounded-[22px] bg-raise p-6 shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-accent)]"
            >
              <span>
                <span className="label block">Next slot</span>
                <span className="font-display mt-2 block text-h3 tabular-nums">{slot}</span>
              </span>
              <span className="grid size-10 place-items-center rounded-full bg-ghost transition-colors group-hover:bg-accent">↗</span>
            </a>
          ))}
        </Reveal>
        <p className="mt-4 text-sm text-faint">Placeholder slots. Connect a scheduler such as Cal.com here.</p>
      </Section>

      <Section label="Promise" title={<>No<br />surprises.</>}>
        <div className="grid gap-[var(--gutter)] md:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="border-t border-line pt-6">
              <p className="text-nano tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-display mt-4 text-h4 leading-[1.15]">{p.title}</h3>
              <p className="mt-2 text-dim">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Studio" title={<>{site.location.city}<span className="text-accent">.</span></>}>
        <Reveal className="grid grid-cols-4 gap-x-[var(--gutter)] gap-y-8 md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 text-lead leading-[1.36]">
            <p>{site.legalName}</p>
            {site.location.address.map((l) => (
              <p key={l} className="text-dim">{l}</p>
            ))}
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-start-9">
            <p className="label">Local time</p>
            <p className="font-display mt-2 text-display leading-[0.88]">
              <LocalClock timeZone={site.location.timeZone} />
            </p>
            <p className="mt-2 text-sm text-dim tabular-nums">{site.location.coords}</p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
