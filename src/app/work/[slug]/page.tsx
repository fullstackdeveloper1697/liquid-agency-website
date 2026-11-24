import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseDetails, getCase } from "@/content/cases";
import { CaseBrief, CaseCredits, CaseDeliverables, CaseFigure, CaseGantt, CaseHero, CaseProcess, CaseRow, CaseStats, CaseSystem } from "@/components/case/CaseBlocks";
import { DepthSection } from "@/components/home/DepthSection";
import { LiquidRibbons } from "@/components/fx/LiquidRibbons";
import { Closing } from "@/components/page/Closing";

export function generateStaticParams() {
  return caseDetails.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const c = getCase((await params).slug);
  return { title: c ? `${c.client} — Case` : "Case" };
}

/** Case study, in the order of the reference's case pages. */
export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  const index = caseDetails.indexOf(c);
  const half = Math.ceil(c.rows.length / 2);

  return (
    <>
      <CaseHero c={c} index={index} />
      <CaseFigure c={c} />
      <CaseStats c={c} />
      <DepthSection fig={`Case ${String(index + 1).padStart(2, "0")} · ${c.client}`} caption={c.facts[2][1]} title={c.depthTitle} slot={`case-${c.slug}-depth`} alt={c.client}>
        <LiquidRibbons />
      </DepthSection>
      <CaseBrief c={c} />
      <CaseGantt c={c} />
      {c.rows.slice(0, half).map((r, i) => <CaseRow key={i} c={c} row={r} index={i} />)}
      <CaseProcess c={c} />
      {c.rows.slice(half).map((r, i) => <CaseRow key={i + half} c={c} row={r} index={i + half} />)}
      <CaseSystem c={c} />
      <CaseDeliverables c={c} />
      <CaseCredits c={c} index={index} />
      <Closing title={["Your project", "next."]} />
    </>
  );
}
