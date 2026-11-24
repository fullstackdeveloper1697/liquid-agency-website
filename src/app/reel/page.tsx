import type { Metadata } from "next";
import { Closing } from "@/components/page/Closing";
import { ReelPlayer } from "@/components/page/ReelPlayer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/global/Words";

export const metadata: Metadata = { title: "Reel" };

export default function ReelPage() {
  return (
    <>
      <ReelPlayer />
      <section data-calm="1" className="py-[clamp(88px,10vw,152px)]">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label mb-6" data-scramble>After the reel</p>
            <h2 className="font-display text-h1 leading-[0.94] tracking-[-0.03em]"><Words>Every frame<br />made to order<span className="text-accent">.</span></Words></h2>
          </Reveal>
          <Reveal delay={120} className="flex flex-col items-start gap-8 lg:col-span-4 lg:col-start-9 lg:pt-12">
            <p className="text-dim">Brand films, product loops and launch content, directed by people and produced at machine speed. Replace this text with your own.</p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton href="/work" variant="light">See the cases</MagneticButton>
              <MagneticButton href="/contact" variant="primary">Start a brief</MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
      <Closing title={["Seen", "enough?"]} />
    </>
  );
}
