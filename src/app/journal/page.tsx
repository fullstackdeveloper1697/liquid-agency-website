import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Closing } from "@/components/page/Closing";
import { JournalWall } from "@/components/journal/JournalWall";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <>
      <PageHero
        eyebrow="Journal · Notes from the studio"
        lines={["Journal."]}
        lead="Work in progress, the people behind the projects and what we learn along the way. New notes most weekdays."
      />
      <Section className="pt-0!">
        <Suspense>
          <JournalWall />
        </Suspense>
      </Section>
      <Closing title={["Got a", "story?"]} />
    </>
  );
}
