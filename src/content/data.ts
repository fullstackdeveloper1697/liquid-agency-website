/**
 * Placeholder content for the inner pages. Replace with your own.
 * `art` picks one of the CSS placeholder artworks in components/page/Art.tsx.
 */

export const cases = [
  { slug: "northwind", client: "Northwind Pay", title: "A payments brand that feels calm.", tags: "Brand · Web", year: "2026", art: 0 },
  { slug: "halo-summit", client: "Halo Summit", title: "An event that looks like a headline act.", tags: "Event brand · Social", year: "2026", art: 3 },
  { slug: "kilnworks", client: "Kilnworks", title: "Ceramics, sold by the light they hold.", tags: "E-commerce · Photo", year: "2025", art: 2 },
  { slug: "orbit-labs", client: "Orbit Labs", title: "A chip startup with a visual language.", tags: "Brand system · 3D", year: "2025", art: 1 },
  { slug: "saltline", client: "Saltline", title: "A beach club in one colour.", tags: "Identity · Print", year: "2024", art: 5 },
] as const;

export const gallery = [
  { title: "Bottle study", art: 0 },
  { title: "Poster series", art: 4 },
  { title: "App onboarding", art: 3 },
  { title: "Chrome type", art: 2 },
  { title: "Packaging set", art: 5 },
  { title: "Launch film stills", art: 1 },
] as const;

export const services = [
  {
    n: "01",
    title: "Brand and identity",
    text: "Names, marks and identity systems that look established from the first day and hold up from the pitch deck to the shop window.",
    items: ["Positioning", "Naming", "Logo and system", "Guidelines"],
    time: "from 10 business days",
  },
  {
    n: "02",
    title: "Websites and digital products",
    text: "Fast sites and product interfaces, designed and built in one team, with search and AI visibility planned from the first wireframe.",
    items: ["UX and UI", "Next.js builds", "CMS or prompt-based editing", "Performance"],
    time: "from 15 business days",
  },
  {
    n: "03",
    title: "Campaigns and content",
    text: "Photo, film, 3D and motion. Directed by people, produced with AI where it saves time without costing quality.",
    items: ["Key visuals", "Social sets", "3D and motion", "Launch films"],
    time: "from 5 business days",
  },
  {
    n: "04",
    title: "AI visibility",
    text: "We check whether AI assistants recommend you when buyers ask, which sources they trust, and what it takes to get named.",
    items: ["Audit", "Source map", "Content plan", "Monthly tracking"],
    time: "audit in 7 business days",
  },
  {
    n: "05",
    title: "Creative retainer",
    text: "Your external creative team: one lead who knows the brand and the right specialists each month, on a fixed time budget.",
    items: ["Monthly hours", "One point of contact", "Priority slots", "Quarterly review"],
    time: "monthly",
  },
] as const;

export const packages = [
  { name: "Launch", for: "New companies that need to look ready", includes: ["Logo and core identity", "One-page website", "Launch social set"], time: "4 weeks" },
  { name: "Grow", for: "Teams with traction and a brand that lags", includes: ["Identity refresh", "Multi-page website", "Campaign kit", "AI visibility audit"], time: "8 weeks", featured: true },
  { name: "Partner", for: "Teams that ship every week", includes: ["Retainer hours", "Dedicated creative lead", "Priority production"], time: "Monthly" },
] as const;

export const faqs = [
  { q: "How fast can you start?", a: "Usually within a week of an accepted quote. Rush slots exist for launches with a fixed date." },
  { q: "How do you use AI?", a: "As a production tool for research, variations, formats and checks. Ideas, decisions and the final look stay with people." },
  { q: "Who will I work with?", a: "One creative lead from the first call to the last file, plus the specialists your project needs. No account managers in between." },
  { q: "Do you work remotely?", a: "Yes, with clients worldwide. We travel for shoots and workshops when it helps the work." },
  { q: "What does a project cost?", a: "Every quote is fixed and written. Packages give a starting point; the brief sets the final scope." },
] as const;

export const facts = [
  { value: "6", label: "disciplines in one team" },
  { value: "120+", label: "projects delivered" },
  { value: "40+", label: "brands supported" },
  { value: "12h", label: "until a person answers your brief" },
] as const;

export const values = [
  { title: "Taste first", text: "Tools change every month. The eye that decides what is good does not." },
  { title: "One voice", text: "You talk to one lead. That lead talks to everyone else." },
  { title: "Fixed dates", text: "We plan backwards from your launch and protect the date." },
  { title: "Show, then tell", text: "We share work early and often, not decks about work." },
] as const;

export const team = [
  { name: "Creative lead", role: "Direction and client contact", art: 0 },
  { name: "Design lead", role: "Identity and interfaces", art: 3 },
  { name: "Tech lead", role: "Builds and performance", art: 2 },
  { name: "Motion lead", role: "3D, film and animation", art: 1 },
] as const;

export const posts = [
  { slug: "brief-is-a-feeling", date: "2026-11-18", tag: "Process", title: "The idea is there. The brief is still a feeling.", excerpt: "How a five-minute intake turns a hunch into a scope you can price.", art: 3 },
  { slug: "chrome-type", date: "2026-11-12", tag: "Studio", title: "Chrome type, three ways.", excerpt: "Shader, render or photo: what each costs and when to pick which.", art: 2 },
  { slug: "deadline", date: "2026-11-05", tag: "Opinion", title: "Perfection needs a deadline.", excerpt: "Why the best version is the one that ships on the date.", art: 0 },
  { slug: "fast-is-a-number", date: "2026-10-29", tag: "Web", title: "Fast is a number, not a feeling.", excerpt: "The speed budget we hold every site to, and how we keep it.", art: 5 },
  { slug: "first-idea", date: "2026-10-22", tag: "Process", title: "Your first idea is a starting point.", excerpt: "Notes on killing darlings without killing momentum.", art: 1 },
  { slug: "one-colour", date: "2026-10-15", tag: "Brand", title: "One colour is a strategy.", excerpt: "What happens when a brand owns a single hue and nothing else.", art: 4 },
] as const;

export const steps = [
  { step: "Direction", title: "People set the direction.", text: "People set the idea, the look and the limits." },
  { step: "Production", title: "Tools carry the volume.", text: "AI carries the volume: versions, formats, checks." },
  { step: "Quality", title: "People check every detail.", text: "People review every detail before you see it." },
  { step: "Delivery", title: "We ship on the agreed date.", text: "On the date in the quote, in every format you need." },
] as const;

export const marquee = ["Fewer meetings", "Better work", "Clear timelines", "No templates"] as const;
