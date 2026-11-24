import { PageHero } from "@/components/page/PageHero";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ChromeSprite } from "@/components/fx/ChromeSprite";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404 · Page not found"
      lines={["Lost in", "space."]}
      accentLast
      lead="The page you are looking for has drifted off. It may have moved, or it never existed."
      aside={
        <div className="flex flex-col items-start gap-6 lg:items-end">
          <ChromeSprite shape={3} speed={0.6} draggable className="size-[clamp(120px,12vw,200px)]" />
          <div className="flex flex-wrap gap-3">
            <MagneticButton href="/" variant="primary">Back to home</MagneticButton>
            <MagneticButton href="/work" variant="light">See the work</MagneticButton>
          </div>
        </div>
      }
    />
  );
}
