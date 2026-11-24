import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { LegalPage } from "@/components/page/LegalPage";

const doc = legalDocs.find((d) => d.slug === "data-protection")!;

export const metadata: Metadata = { title: `${doc.title[0]} ${doc.title[1]}`.replace(/\.$/, "") };

export default function Page() {
  return <LegalPage current={doc.slug} title={doc.title} lead={doc.lead} updated={doc.updated} sections={doc.sections} />;
}
