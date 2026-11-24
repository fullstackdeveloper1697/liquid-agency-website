# liquid — creative studio website

A multi-page studio website built with **Next.js 16 (App Router)**, **TypeScript** and **Tailwind CSS v4**.
Dark black / white / magenta (`#FF00FF`) design with scroll-driven animation, WebGL effects and 3D chrome shapes.

> Class project. The layout and motion are studied from [dozfx.com](https://www.dozfx.com/) as a reference.
> All text, the name, the logo and the images in this repository are placeholders or original work. No
> dozfx text, logos, client logos or images are included, and this project is not affiliated with dozfx.

---

## Features

- **14-section home page:**
  - Hero with a morphing chrome shape
  - Pinned statement with orbiting service shapes
  - Two "depth" image studies
  - Services showcase
  - Marquee
  - 3D reel frame
  - Archive spiral
  - Client grid
  - "Warp" process section
  - Studio figures with rolling counters
  - Animated brief-assistant demo
  - FAQ with a scroll counter
  - Closing landscape
- **Inner pages:**
  - Work, plus 5 case-study pages (`/work/[slug]`)
  - Services, plus 5 service pages (`/services/[slug]`)
  - Studio, Reel, Journal (filters and post dialog), Contact, Design system
  - Legal notice, Data protection, Terms, Cookie settings
  - A custom 404 page
- **Motion:**
  - GPU starfield background
  - Custom cursor
  - Scroll progress bar
  - Smooth wheel scrolling
  - Page transitions and a first-load veil
  - Scrambling labels and word-by-word heading reveals
  - Magnetic buttons
- **WebGL:**
  - Ray-marched chrome shapes, all sharing one rendering context
  - Shader backgrounds (light tunnel, liquid ribbons, valley landscape)
  - 2D fallbacks when WebGL isn't available
- **Accessible by default:**
  - Respects `prefers-reduced-motion`
  - Keyboard-friendly menu and dialogs
  - The FAQ uses `<details>`, so it works without JavaScript
- **Responsive** from 360px phones to wide desktops, with no sideways scrolling.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack, `cacheComponents`) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 (`@theme` tokens, custom utilities in `globals.css`) |
| Fonts | Archivo Variable, Space Grotesk Variable (self-hosted via Fontsource) |
| Icons | react-icons |
| Graphics | WebGL2 shaders, Canvas 2D (no 3D library needed at runtime) |

## Getting started

Requirements: **Node.js 20+** and npm.

```bash
git clone https://github.com/<your-username>/liquid-agency.git
cd liquid-agency
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (scans `public/images` first) |
| `npm run build` | Production build (scans `public/images` first) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run images` | Re-scan `public/images` after adding or removing pictures |

> Opening the dev server from another device on your network (e.g. `http://192.168.x.x:3000`)?
> Those addresses are allowed in `next.config.ts` (`allowedDevOrigins`).

## Project structure

```
src/
├─ app/                    # Routes (App Router)
│  ├─ page.tsx             # Home
│  ├─ work/ [slug]/        # Work + case studies
│  ├─ services/ [slug]/    # Services + service pages
│  ├─ studio/ reel/ journal/ contact/ system/
│  ├─ legal-notice/ data-protection/ terms/ cookie-settings/
│  ├─ not-found.tsx        # 404
│  ├─ layout.tsx           # Header, footer, global effects
│  └─ globals.css          # Design tokens, keyframes, component styles
├─ components/
│  ├─ layout/              # Header, menu overlay, footer
│  ├─ home/                # Home page sections
│  ├─ page/                # Shared page blocks (hero, section, FAQ, closing…)
│  ├─ case/  services/  journal/
│  ├─ fx/                  # WebGL / canvas effects (starfield, chrome shapes, terrain…)
│  ├─ global/              # Cursor, page transitions, smooth scroll, scramble, word reveal
│  └─ ui/                  # Logo, buttons, reveal, clock…
├─ config/site.ts          # Name, navigation, contact details, socials
├─ content/                # All page copy (data.ts, cases.ts, services.ts, legal.ts)
└─ lib/motion.ts           # Scroll helpers and easing
public/images/             # Image slots (see below)
scripts/scan-images.mjs    # Builds the image map used by the components
```

## Make it yours

1. **Brand and contact details:** `src/config/site.ts`
2. **Page copy:**
   - Home sections, team, journal and FAQ: `src/content/data.ts`
   - Case studies: `src/content/cases.ts`
   - Service pages: `src/content/services.ts`
   - Legal pages: `src/content/legal.ts`
   - Some section headings live at the top of their component, for example `src/components/home/Warp.tsx` and `Statement.tsx`.
3. **Images:** add a file to `public/images` named after its slot, for example `depth-01.webp` or `case-northwind-hero.jpg`. Supported formats: `.webp`, `.avif`, `.jpg`, `.png`, `.gif`. When a slot has no file, a generated artwork is shown instead. The full slot list is in `public/images/README.md`.
4. **Reel video:** place `public/reel.mp4` (and optionally `public/reel.jpg` as the poster).
5. **Colours and type scale:** the `@theme` block at the top of `src/app/globals.css`.

## Deploy

Works out of the box on [Vercel](https://vercel.com/new): import the repository and keep the default settings.
Any Node host works too:

```bash
npm run build
npm start
```

## Image credits

- **Placeholder images in `public/images`:** original 3D renders made for this project.
- **`depth-01.webp`:** a rocket launch photo by NASA (public domain), taken from the scikit-image sample data and colour-graded.

## License

Code: MIT, free to use for learning.
Placeholder images and text: free to replace. If you publish a site based on this, use your own brand, text and images.
