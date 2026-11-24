/**
 * Case studies (placeholder content). Each entry drives one page at /work/[slug].
 * Image slots: case-<slug>-hero, case-<slug>-depth, case-<slug>-1 … -8, see public/images/README.md
 */
import { cases } from "./data";

export type CaseDetail = {
  slug: string;
  client: string;
  title: string[]; // hero title lines
  intro: string;
  facts: [string, string][];
  stats: { v: string; u?: string; t: string }[];
  depthTitle: [string, string];
  brief: { k: string; t: string }[];
  phases: { name: string; start: number; len: number }[]; // weeks
  weeks: number;
  rows: { layout: "full" | "two" | "three"; caption: string }[];
  process: { title: [string, string]; lead: string; steps: string[] };
  system: { title: [string, string]; lead: string; items: string[] };
  deliverables: { title: [string, string]; items: string[] };
  credits: [string, string][];
};

const base = (i: number) => cases[i];

export const caseDetails: CaseDetail[] = [
  {
    slug: base(0).slug,
    client: base(0).client,
    title: ["Calm money.", "Clear brand."],
    intro: "A payments start-up needed to look trustworthy to banks and friendly to the people paying. We built a calm brand system and a website that explains the product in one scroll.",
    facts: [["Client", "Northwind Pay"], ["Sector", "Payments"], ["Scope", "Brand · Website · Launch kit"], ["Year", "2026"], ["Role", "Lead studio"]],
    stats: [{ v: "11", u: "days", t: "from brief to launch" }, { v: "3", t: "markets at launch" }, { v: "98", t: "Lighthouse score" }],
    depthTitle: ["Trust is", "a feeling."],
    brief: [
      { k: "Challenge", t: "A new payments brand had to feel as safe as a bank and as simple as a messaging app." },
      { k: "Idea", t: "One calm colour, one confident typeface, and motion that only moves when money moves." },
      { k: "Result", t: "A brand and site live in eleven days, ready for three markets." },
    ],
    phases: [{ name: "Discovery", start: 0, len: 1 }, { name: "Identity", start: 1, len: 1 }, { name: "Website", start: 1, len: 2 }, { name: "Launch kit", start: 2, len: 1 }],
    weeks: 3,
    rows: [{ layout: "full", caption: "The identity at full size." }, { layout: "two", caption: "Cards and app screens." }, { layout: "three", caption: "Launch posts." }, { layout: "full", caption: "The website hero." }],
    process: { title: ["Five steps.", "One payment."], lead: "The site walks a merchant through one payment, from tap to settlement.", steps: ["Tap", "Authorise", "Check", "Settle", "Report"] },
    system: { title: ["One mark.", "Every surface."], lead: "The mark scales from a 16px favicon to a trade-show wall.", items: ["Logo", "Colour", "Type", "Icons", "Motion", "Tone"] },
    deliverables: { title: ["Everything", "in the box."], items: ["Brand guidelines", "Logo suite", "Website", "Pitch deck", "Social templates", "Launch film"] },
    credits: [["Creative direction", "Creative lead"], ["Design", "Design lead"], ["Development", "Tech lead"], ["Motion", "Motion lead"]],
  },
  {
    slug: base(1).slug,
    client: base(1).client,
    title: ["Not a conference.", "A headline act."],
    intro: "A summit wanted to feel like a night out, not a trade fair. We gave it a fight-card identity, an event site and a social run that sold out the room.",
    facts: [["Client", "Halo Summit"], ["Sector", "Events"], ["Scope", "Event brand · Website · Social"], ["Year", "2026"], ["Role", "Lead studio"]],
    stats: [{ v: "10", t: "posts in the launch run" }, { v: "100", u: "%", t: "tickets sold" }, { v: "4", u: "weeks", t: "start to stage" }],
    depthTitle: ["The room is", "the brand."],
    brief: [
      { k: "Challenge", t: "A crowded calendar and a topic people find dry." },
      { k: "Idea", t: "Treat speakers like headliners and the agenda like a fight card." },
      { k: "Result", t: "A sold-out room and a brand the organisers reuse every year." },
    ],
    phases: [{ name: "Concept", start: 0, len: 1 }, { name: "Key visual", start: 1, len: 1 }, { name: "Website", start: 1, len: 2 }, { name: "Social run", start: 2, len: 2 }],
    weeks: 4,
    rows: [{ layout: "full", caption: "Key visual." }, { layout: "three", caption: "Speaker cards." }, { layout: "two", caption: "Stage and badges." }],
    process: { title: ["Built like", "a fight card."], lead: "Every session is billed like a bout: two names, one topic, one round.", steps: ["Announce", "Build-up", "Weigh-in", "Main event", "Recap"] },
    system: { title: ["One world.", "Every channel."], lead: "One look across web, social, stage and print.", items: ["Key visual", "Type", "Speaker cards", "Stage", "Badges", "Social"] },
    deliverables: { title: ["Everything", "in the box."], items: ["Identity", "Event website", "10 social posts", "Stage design", "Badges", "Recap film"] },
    credits: [["Creative direction", "Creative lead"], ["Design", "Design lead"], ["Development", "Tech lead"], ["3D", "Motion lead"]],
  },
  {
    slug: base(2).slug,
    client: base(2).client,
    title: ["Sold by", "the light."],
    intro: "A ceramics maker needed an online shop that shows what photos usually lose: how a glaze holds the light.",
    facts: [["Client", "Kilnworks"], ["Sector", "Retail"], ["Scope", "E-commerce · Photography"], ["Year", "2025"], ["Role", "Lead studio"]],
    stats: [{ v: "2.4", u: "×", t: "conversion rate" }, { v: "180", t: "products shot" }, { v: "6", u: "weeks", t: "to launch" }],
    depthTitle: ["Made by", "hand."],
    brief: [
      { k: "Challenge", t: "Product photos made every glaze look the same." },
      { k: "Idea", t: "Shoot each piece in moving light and let visitors turn it." },
      { k: "Result", t: "More than double the conversion in the first quarter." },
    ],
    phases: [{ name: "Shoot", start: 0, len: 2 }, { name: "Design", start: 1, len: 2 }, { name: "Build", start: 2, len: 3 }, { name: "Launch", start: 5, len: 1 }],
    weeks: 6,
    rows: [{ layout: "full", caption: "Glaze studies." }, { layout: "two", caption: "Product pages." }, { layout: "three", caption: "Packaging." }],
    process: { title: ["From kiln", "to cart."], lead: "Three clicks from a glaze you like to a box at your door.", steps: ["Browse", "Turn", "Compare", "Buy", "Unbox"] },
    system: { title: ["One light.", "Every piece."], lead: "One lighting set-up, repeated for every product.", items: ["Light set", "Backdrop", "Grid", "Type", "Packaging", "Labels"] },
    deliverables: { title: ["Everything", "in the box."], items: ["Shop", "180 product shots", "Turntable videos", "Packaging", "Labels", "Newsletter"] },
    credits: [["Creative direction", "Creative lead"], ["Photography", "Motion lead"], ["Development", "Tech lead"], ["Design", "Design lead"]],
  },
  {
    slug: base(3).slug,
    client: base(3).client,
    title: ["Small chip.", "Big language."],
    intro: "A hardware start-up had a product nobody could see. We built a visual language around it: 3D, motion and a sales deck engineers liked.",
    facts: [["Client", "Orbit Labs"], ["Sector", "Hardware"], ["Scope", "Brand system · 3D · Sales tools"], ["Year", "2025"], ["Role", "Lead studio"]],
    stats: [{ v: "40", t: "3D renders" }, { v: "1", t: "visual language" }, { v: "5", u: "weeks", t: "brief to deck" }],
    depthTitle: ["Seeing the", "invisible."],
    brief: [
      { k: "Challenge", t: "A product too small to photograph and too technical to explain." },
      { k: "Idea", t: "Scale it up: render the chip as architecture you can walk through." },
      { k: "Result", t: "A deck, a site and a booth built from one set of 3D assets." },
    ],
    phases: [{ name: "Research", start: 0, len: 1 }, { name: "3D", start: 1, len: 3 }, { name: "Deck", start: 2, len: 2 }, { name: "Website", start: 3, len: 2 }],
    weeks: 5,
    rows: [{ layout: "full", caption: "The chip as architecture." }, { layout: "three", caption: "Detail renders." }, { layout: "two", caption: "Sales deck." }],
    process: { title: ["One asset.", "Many uses."], lead: "Every render feeds the deck, the site and the booth.", steps: ["Model", "Light", "Render", "Animate", "Reuse"] },
    system: { title: ["One language.", "Every surface."], lead: "Lines, light and a single accent colour.", items: ["3D library", "Colour", "Type", "Diagrams", "Motion", "Deck"] },
    deliverables: { title: ["Everything", "in the box."], items: ["Brand system", "40 renders", "Sales deck", "Website", "Booth", "Product film"] },
    credits: [["Creative direction", "Creative lead"], ["3D", "Motion lead"], ["Design", "Design lead"], ["Development", "Tech lead"]],
  },
  {
    slug: base(4).slug,
    client: base(4).client,
    title: ["One colour.", "Every summer."],
    intro: "A beach club wanted to be recognised from a towel, a cup or a wristband. We gave it one colour and used it everywhere.",
    facts: [["Client", "Saltline"], ["Sector", "Hospitality"], ["Scope", "Identity · Print · Merchandise"], ["Year", "2024"], ["Role", "Lead studio"]],
    stats: [{ v: "1", t: "colour" }, { v: "24", t: "touchpoints" }, { v: "3", u: "weeks", t: "to opening day" }],
    depthTitle: ["Salt, sun,", "one colour."],
    brief: [
      { k: "Challenge", t: "A new club in a strip of near-identical venues." },
      { k: "Idea", t: "Own one colour so completely that guests photograph it." },
      { k: "Result", t: "The colour became the club's name on social media." },
    ],
    phases: [{ name: "Identity", start: 0, len: 1 }, { name: "Print", start: 1, len: 1 }, { name: "Merchandise", start: 1, len: 2 }],
    weeks: 3,
    rows: [{ layout: "full", caption: "The colour on site." }, { layout: "three", caption: "Merchandise." }, { layout: "two", caption: "Menus and signs." }],
    process: { title: ["From towel", "to tote."], lead: "Every object a guest touches carries the colour.", steps: ["Arrive", "Order", "Swim", "Shop", "Share"] },
    system: { title: ["One colour.", "Every touchpoint."], lead: "One colour, one stripe, one typeface.", items: ["Colour", "Stripe", "Type", "Signs", "Menus", "Merchandise"] },
    deliverables: { title: ["Everything", "in the box."], items: ["Identity", "Signs", "Menus", "Towels", "Cups", "Wristbands"] },
    credits: [["Creative direction", "Creative lead"], ["Design", "Design lead"], ["Production", "Motion lead"]],
  },
];

export const getCase = (slug: string) => caseDetails.find((c) => c.slug === slug);
