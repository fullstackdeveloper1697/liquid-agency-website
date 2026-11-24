/**
 * Service detail pages (placeholder content). Each entry drives /services/[slug].
 */
import { services } from "./data";

export const slugify = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

export type ServiceDetail = {
  slug: string;
  n: string;
  shape: number; // chrome shape index for the header icon
  name: string;
  title: string[];
  lead: string;
  who: { t: string; q: string }[];
  box: string[];
  depthTitle: [string, string];
  steps: { t: string; d: string }[];
  practice: { title: [string, string]; cases: string[] };
  metric: { title: [string, string]; lead: string; rows: { k: string; v: number; u: string }[] };
  packages: string[];
  faqs: { q: string; a: string }[];
  closing: [string, string];
};

const s = (i: number) => services[i];

export const serviceDetails: ServiceDetail[] = [
  {
    slug: slugify(s(0).title), n: s(0).n, shape: 0, name: s(0).title,
    title: ["Brand identity that", "looks established", "from day one."],
    lead: "Names, logos, identity systems and guidelines for companies that need to earn trust fast, with customers, partners and investors.",
    who: [{ t: "Start-ups before a launch or a round", q: "01" }, { t: "Companies that outgrew their first logo", q: "02" }, { t: "Teams merging two brands into one", q: "03" }],
    box: ["Positioning workshop", "Naming (if needed)", "Logo and variations", "Colour and type system", "Icon set", "Brand guidelines", "Templates", "Launch assets"],
    depthTitle: ["Brands people", "remember."],
    steps: [{ t: "Listen", d: "A workshop to find what makes you different." }, { t: "Explore", d: "Three directions, shown in real use." }, { t: "Refine", d: "One direction, built out in detail." }, { t: "Hand over", d: "Guidelines, files and templates." }],
    practice: { title: ["Identity,", "in practice."], cases: ["northwind", "saltline", "orbit-labs"] },
    metric: { title: ["One position.", "Every touchpoint."], lead: "Where a new identity typically shows up in the first month.", rows: [{ k: "Website", v: 100, u: "%" }, { k: "Pitch deck", v: 92, u: "%" }, { k: "Social", v: 85, u: "%" }, { k: "Print", v: 60, u: "%" }] },
    packages: ["Launch", "Grow"],
    faqs: [{ q: "How long does a brand take?", a: "Usually 10 to 20 business days, depending on naming and the number of touchpoints." }, { q: "Do I own the logo?", a: "Yes. All rights to the final work pass to you on full payment." }],
    closing: ["Earn trust", "early."],
  },
  {
    slug: slugify(s(1).title), n: s(1).n, shape: 1, name: s(1).title,
    title: ["Websites that", "load fast, read clearly", "and get found."],
    lead: "Websites, landing pages and product interfaces, designed and built in one team, with search and AI visibility planned from the first wireframe.",
    who: [{ t: "Companies whose site no longer fits the product", q: "01" }, { t: "Launches that need a page this month", q: "02" }, { t: "Teams tired of a slow, heavy CMS", q: "03" }],
    box: ["Site map and wireframes", "Design system", "Next.js build", "Editing set-up", "Search set-up", "AI visibility basics", "Analytics", "Launch and handover"],
    depthTitle: ["Spaces you", "want to enter."],
    steps: [{ t: "Map", d: "Pages, content and goals on one sheet." }, { t: "Design", d: "Key pages first, then the system." }, { t: "Build", d: "Fast, accessible, easy to edit." }, { t: "Launch", d: "Tested, measured and handed over." }],
    practice: { title: ["Websites,", "in practice."], cases: ["northwind", "kilnworks", "halo-summit"] },
    metric: { title: ["Fast is", "a number."], lead: "The speed budget every site is held to (lab values).", rows: [{ k: "Performance", v: 98, u: "" }, { k: "Accessibility", v: 100, u: "" }, { k: "Best practices", v: 100, u: "" }, { k: "SEO", v: 100, u: "" }] },
    packages: ["Launch", "Grow"],
    faqs: [{ q: "Can I edit the site myself?", a: "Yes, through a simple editor or a prompt, whichever suits your team." }, { q: "Do you host it?", a: "We set it up on a modern host in your name, so you own everything." }],
    closing: ["Get", "found."],
  },
  {
    slug: slugify(s(2).title), n: s(2).n, shape: 2, name: s(2).title,
    title: ["Campaign content", "at the volume today's", "channels need."],
    lead: "Photo, film, 3D and motion, directed by people and produced with AI where it saves time without costing quality.",
    who: [{ t: "Brands launching a product or season", q: "01" }, { t: "Teams that need ten formats, not one", q: "02" }, { t: "Events that want a run, not a post", q: "03" }],
    box: ["Campaign idea", "Key visual", "Photo or 3D production", "Motion and film", "Format set for every channel", "Copy", "Media-ready files", "Usage rights"],
    depthTitle: ["Stories with", "depth."],
    steps: [{ t: "Idea", d: "One thought that works in every channel." }, { t: "Key visual", d: "The image everything else follows." }, { t: "Production", d: "Photo, 3D and film, at volume." }, { t: "Roll-out", d: "Every format, on schedule." }],
    practice: { title: ["Campaigns,", "in practice."], cases: ["halo-summit", "orbit-labs", "saltline"] },
    metric: { title: ["One idea.", "Every channel."], lead: "A typical campaign set, by number of formats.", rows: [{ k: "Social", v: 40, u: "" }, { k: "Display", v: 18, u: "" }, { k: "Video", v: 8, u: "" }, { k: "Print", v: 6, u: "" }] },
    packages: ["Grow", "Partner"],
    faqs: [{ q: "Do you use AI images?", a: "Where it saves time without costing quality, always directed and checked by people." }, { q: "Who owns the content?", a: "You do, with usage rights agreed up front." }],
    closing: ["Make some", "noise."],
  },
  {
    slug: slugify(s(3).title), n: s(3).n, shape: 3, name: s(3).title,
    title: ["Do AI answers", "name your", "company?"],
    lead: "When buyers ask an assistant for a recommendation they get a short list of names. Our audit shows whether yours is on it, and what it takes to get there.",
    who: [{ t: "B2B companies sold on recommendations", q: "01" }, { t: "Brands that rank on search but not in AI answers", q: "02" }, { t: "Teams planning content for next year", q: "03" }],
    box: ["Question set for your market", "Answers from major assistants", "Source map", "Competitor view", "Gap list", "Content plan", "One-page summary", "Monthly tracking (optional)"],
    depthTitle: ["Be the", "answer."],
    steps: [{ t: "Ask", d: "The questions your buyers ask." }, { t: "Map", d: "Which sources the answers rely on." }, { t: "Plan", d: "What to publish, fix and earn." }, { t: "Track", d: "Movement you can measure." }],
    practice: { title: ["One page.", "A clear answer."], cases: ["northwind", "orbit-labs", "kilnworks"] },
    metric: { title: ["Movement you", "can measure."], lead: "Share of answers naming the client, before and after (example).", rows: [{ k: "Month 0", v: 12, u: "%" }, { k: "Month 2", v: 26, u: "%" }, { k: "Month 4", v: 41, u: "%" }, { k: "Month 6", v: 55, u: "%" }] },
    packages: ["Grow", "Partner"],
    faqs: [{ q: "Which assistants do you check?", a: "The major general assistants and any that matter in your market." }, { q: "Is this SEO?", a: "It overlaps, but focuses on the sources AI answers cite." }],
    closing: ["Get", "named."],
  },
  {
    slug: slugify(s(4).title), n: s(4).n, shape: 4, name: s(4).title,
    title: ["Your external", "creative", "department."],
    lead: "One point of contact, a monthly time budget and the specialists you need each month. Built for teams that ship every week.",
    who: [{ t: "Marketing teams without in-house design", q: "01" }, { t: "Start-ups shipping weekly", q: "02" }, { t: "Brands that need one consistent hand", q: "03" }],
    box: ["Monthly hours", "One creative lead", "Specialists on demand", "Priority slots", "Shared board", "Monthly report", "Quarterly review", "Flexible scope"],
    depthTitle: ["Presence over", "noise."],
    steps: [{ t: "Plan", d: "A monthly plan with clear priorities." }, { t: "Make", d: "Design, copy, code and production." }, { t: "Review", d: "Weekly check-ins, quick changes." }, { t: "Report", d: "Hours, output and next month." }],
    practice: { title: ["The work,", "in practice."], cases: ["halo-summit", "saltline", "northwind"] },
    metric: { title: ["Capacity that", "moves with you."], lead: "A typical month, by type of work.", rows: [{ k: "Design", v: 45, u: "%" }, { k: "Content", v: 25, u: "%" }, { k: "Web", v: 20, u: "%" }, { k: "Strategy", v: 10, u: "%" }] },
    packages: ["Partner"],
    faqs: [{ q: "What if I need more hours?", a: "Add hours any month; unused hours roll over once." }, { q: "Is there a minimum term?", a: "Three months, then month to month." }],
    closing: ["Ship every", "week."],
  },
];

export const getService = (slug: string) => serviceDetails.find((d) => d.slug === slug);
