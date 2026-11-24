"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

const topics = ["Brand", "Website", "Campaign", "AI visibility", "Not sure yet"];

/**
 * Brief form. With no backend yet, it opens the visitor's email app with the
 * brief filled in. Swap `onSubmit` for a call to your API or form service.
 */
export function ContactForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Company: ${f.get("company")}`,
      `Topic: ${topic}`,
      `Launch date: ${f.get("date")}`,
      "",
      `${f.get("idea")}`,
    ].join("\n");
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Brief: ${topic}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "w-full border-b border-line bg-transparent py-4 text-lead outline-none transition-colors placeholder:text-faint focus:border-accent";

  return (
    <Reveal>
      <form onSubmit={onSubmit} className="grid grid-cols-4 gap-x-[var(--gutter)] gap-y-8 md:grid-cols-8 lg:grid-cols-12">
        <fieldset className="col-span-4 md:col-span-8 lg:col-span-12">
          <legend className="label mb-4">What is it about?</legend>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                aria-pressed={topic === t}
                className={`h-10 rounded-full px-5 text-sm font-medium transition-[background,box-shadow,color] duration-300 ${
                  topic === t
                    ? "bg-accent text-paper"
                    : "shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_#fff]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="col-span-4 lg:col-span-6">
          <span className="sr-only">Your name</span>
          <input required name="name" autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="col-span-4 lg:col-span-6">
          <span className="sr-only">Company</span>
          <input name="company" autoComplete="organization" placeholder="Company" className={field} />
        </label>
        <label className="col-span-4 md:col-span-8 lg:col-span-12">
          <span className="sr-only">The idea</span>
          <textarea required name="idea" rows={3} placeholder="The idea, in a few lines" className={`${field} resize-none`} />
        </label>
        <label className="col-span-4 lg:col-span-6">
          <span className="sr-only">Launch date</span>
          <input name="date" placeholder="When should it launch?" className={field} />
        </label>

        <div className="col-span-4 flex items-center gap-6 md:col-span-8 lg:col-span-12">
          <button type="submit" className="btn btn--primary">
            <span className="roll">
              <span>Send brief</span>
              <span aria-hidden>Send brief</span>
            </span>
            <span className="btn__ico" aria-hidden>
              <svg viewBox="0 0 10 10">
                <path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </button>
          {sent && <p role="status" className="text-sm text-dim">Your email app should open with the brief filled in.</p>}
        </div>
      </form>
    </Reveal>
  );
}
