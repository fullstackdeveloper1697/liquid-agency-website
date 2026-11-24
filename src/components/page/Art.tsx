import Image from "next/image";
import { images } from "@/content/images.generated";

/**
 * An image slot. If public/images contains a file named after `slot`
 * (for example public/images/case-1.webp), that image is shown.
 * Otherwise a placeholder artwork in the site's look is drawn with CSS.
 * See public/images/README.md for the full list of slots.
 */
const variants = [
  "radial-gradient(circle at 30% 30%, #fff 0%, #ff80ff 8%, #ff00ff 28%, #5a005a 58%, #0b000b 85%)",
  "conic-gradient(from 210deg at 60% 55%, #0b0b0b, #ff00ff 18%, #1a001a 32%, #c9c9d1 46%, #0b0b0b 60%, #ff00ff 82%, #0b0b0b)",
  "linear-gradient(135deg, #111 0%, #2a2a33 30%, #e6e6ee 48%, #2a2a33 62%, #ff00ff 100%)",
  "radial-gradient(120% 90% at 80% 10%, #ff00ff 0%, #6b006b 30%, #050407 70%)",
  "repeating-linear-gradient(180deg, #fff 0 3px, transparent 3px 14px), radial-gradient(circle at 50% 120%, #ff00ff, #200020 60%, #050407)",
  "radial-gradient(circle at 70% 70%, #ff00ff 0%, transparent 40%), radial-gradient(circle at 25% 30%, #d9d9e3 0%, #3a3a44 25%, transparent 50%), #07060a",
];

export function Art({
  variant = 0,
  label,
  slot,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  variant?: number;
  label?: string;
  slot?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = slot ? images[slot] : undefined;
  return (
    <div
      role={label && !src ? "img" : undefined}
      aria-label={label && !src ? label : undefined}
      aria-hidden={label ? undefined : true}
      className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative "}overflow-hidden bg-raise ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={label ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06]"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06]"
            style={{ background: variants[variant % variants.length] }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,#0000_30%,#0008)]" />
        </>
      )}
    </div>
  );
}
