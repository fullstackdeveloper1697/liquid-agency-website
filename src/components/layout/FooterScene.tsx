/**
 * Decorative sky behind the footer, CSS only, values taken from the reference:
 *  stars · breathing magenta glow · a dark planet with a glowing rim (top right)
 *  · a small moon (top left) · horizon haze · a neon grid floor running toward you.
 */
export function FooterScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
      {/* stars */}
      <i
        className="absolute inset-x-0 -top-[20%] bottom-0 block opacity-55"
        style={{
          backgroundImage: [
            "radial-gradient(1px 1px at 12% 18%, rgb(255 255 255 / .9), transparent 70%)",
            "radial-gradient(1px 1px at 33% 62%, rgb(255 255 255 / .7), transparent 70%)",
            "radial-gradient(1.5px 1.5px at 58% 27%, rgb(255 200 255 / .9), transparent 70%)",
            "radial-gradient(1px 1px at 77% 71%, rgb(255 255 255 / .6), transparent 70%)",
            "radial-gradient(1px 1px at 91% 41%, rgb(255 255 255 / .8), transparent 70%)",
            "radial-gradient(1px 1px at 46% 88%, rgb(255 255 255 / .5), transparent 70%)",
          ].join(","),
          backgroundSize: "420px 380px",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 55%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 55%, transparent 80%)",
        }}
      />

      {/* glow */}
      <i
        className="absolute -top-[50vw] -right-[40vw] block aspect-square w-[140vw] animate-foot-glow rounded-full md:-top-[30vw] md:-right-[12vw] md:w-[min(96vw,1360px)]"
        style={{
          background:
            "radial-gradient(closest-side, rgb(255 0 255 / .22), rgb(255 0 255 / .08) 60%, rgb(255 0 255 / 0))",
        }}
      />

      {/* planet */}
      <i
        className="absolute -top-[50vw] -right-[40vw] block aspect-square w-[120vw] rounded-full md:-top-[34vw] md:-right-[18vw] md:w-[min(78vw,1100px)]"
        style={{
          background:
            "radial-gradient(circle at 38% 62%, #ff00ff29, #2800288c 46%, #08000aeb 68%, #050407 69.6%, #05040700 70%)",
          boxShadow:
            "inset 0 0 0 1px #ff78ff47, 0 0 90px -10px #ff00ff59, 0 0 240px -40px #ff00ff40",
        }}
      />

      {/* moon */}
      <i
        className="absolute top-[9%] right-[10%] block aspect-square w-12 rounded-full opacity-85 md:top-[14%] md:right-auto md:left-[8%] md:w-[clamp(56px,7vw,120px)]"
        style={{
          background:
            "radial-gradient(circle at 70% 32%, #ffdcfff2 0, #ff50ffbf 18%, #780082d9 46%, #120016 72%)",
          boxShadow: "0 0 40px #ff00ff59, inset -6px -8px 18px #0000008c",
        }}
      />

      {/* haze */}
      <i
        className="absolute -inset-x-[20%] top-[40%] block h-[40%] md:top-[30%] md:h-[48%]"
        style={{
          background:
            "radial-gradient(ellipse 46% 50% at 50% 50%, #ff00ff2e, #ff00ff0f 48%, #f0f0 74%)",
        }}
      />

      {/* ground with the neon grid floor */}
      <span className="absolute inset-x-0 bottom-0 block h-[40%] overflow-hidden md:h-[48%]">
        <i
          className="absolute top-0 left-1/2 block h-[260%] w-[340%] origin-[50%_0] animate-foot-floor opacity-42"
          style={{
            transform: "translate(-50%) perspective(700px) rotateX(72deg)",
            backgroundImage:
              "linear-gradient(rgb(255 0 255 / .6) 2px, transparent 2px), linear-gradient(90deg, rgb(255 0 255 / .55) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            backgroundPosition: "50% 0",
            maskImage: "linear-gradient(to bottom, #0000, #0009 14%, #000 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, #0000, #0009 14%, #000 40%)",
          }}
        />
      </span>
    </div>
  );
}
