/**
 * Site-wide content for the header, menu and footer.
 * Swap these placeholder values for your own brand, links and contact details.
 */

export type NavLink = { label: string; href: string; external?: boolean };

export type SocialKey =
  | "instagram"
  | "linkedin"
  | "facebook"
  | "x"
  | "bluesky"
  | "threads"
  | "tiktok"
  | "youtube"
  | "twitch"
  | "whatsapp";

export type SocialLink = { key: SocialKey; label: string; handle: string; href: string };

export const site = {
  name: "liquid",
  legalName: "Liquid Creative Studio Ltd",
  registration: "Reg. 000000",
  tagline: "A liquid studio.",
  claim: "Sharp taste. Fast delivery.",
  pronunciation: "/ˈlɪk.wɪd/",

  /** Primary call to action shown in header, menu and footer */
  cta: { label: "Start a brief", href: "/contact" } satisfies NavLink,
  secondaryCta: { label: "Book an intro call", href: "/contact#book" } satisfies NavLink,

  /** Location used for the live clock in header and footer */
  location: {
    code: "LIM",
    city: "Limassol",
    timeZone: "Asia/Nicosia",
    coords: "34.69° N 33.02° E",
    address: ["Your Street 1, Your Building", "0000 Your City, Your Country"],
  },

  contact: {
    email: "hello@example.com",
    phone: "+357 00 000000",
    phoneHref: "tel:+35700000000",
  },

  pages: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/studio" },
    { label: "Reel", href: "/reel" },
    { label: "Journal", href: "/journal" },
    { label: "Say hello", href: "/contact" },
  ] satisfies NavLink[],

  footerPages: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/studio" },
    { label: "Reel", href: "/reel" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
    { label: "Design system", href: "/system" },
  ] satisfies NavLink[],

  services: [
    { label: "Brand and identity", href: "/services/brand-and-identity" },
    { label: "Websites and digital products", href: "/services/websites-and-digital-products" },
    { label: "Campaigns and content", href: "/services/campaigns-and-content" },
    { label: "AI visibility", href: "/services/ai-visibility" },
    { label: "Creative retainer", href: "/services/creative-retainer" },
  ] satisfies NavLink[],

  more: [
    { label: "Design system", href: "/system" },
    { label: "Brief form", href: "/contact#brief" },
  ] satisfies NavLink[],

  legal: [
    { label: "Legal notice", href: "/legal-notice" },
    { label: "Data protection", href: "/data-protection" },
    { label: "Terms", href: "/terms" },
    { label: "Cookie settings", href: "/cookie-settings" },
  ] satisfies NavLink[],

  socials: [
    { key: "instagram", label: "Instagram", handle: "@yourstudio", href: "https://www.instagram.com/" },
    { key: "linkedin", label: "LinkedIn", handle: "Your Studio", href: "https://www.linkedin.com/" },
    { key: "facebook", label: "Facebook", handle: "Your Studio", href: "https://www.facebook.com/" },
    { key: "x", label: "X", handle: "@yourstudio", href: "https://x.com/" },
    { key: "bluesky", label: "Bluesky", handle: "@yourstudio.bsky.social", href: "https://bsky.app/" },
    { key: "threads", label: "Threads", handle: "@yourstudio", href: "https://www.threads.com/" },
    { key: "tiktok", label: "TikTok", handle: "@yourstudio", href: "https://www.tiktok.com/" },
    { key: "youtube", label: "YouTube", handle: "@yourstudio", href: "https://www.youtube.com/" },
    { key: "twitch", label: "Twitch", handle: "yourstudio", href: "https://www.twitch.tv/" },
    { key: "whatsapp", label: "WhatsApp", handle: "+357 00 000000", href: "https://wa.me/" },
  ] satisfies SocialLink[],
} as const;
