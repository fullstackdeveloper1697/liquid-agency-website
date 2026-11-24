/**
 * Template legal texts. They are placeholders written for a practice build:
 * have real ones drafted or reviewed by a lawyer before going live.
 */
import { site } from "@/config/site";

export type LegalDoc = {
  slug: string;
  title: [string, string];
  lead: string;
  updated: string;
  sections: { title: string; body: string[] }[];
};

const company = `${site.legalName}, ${site.location.address.join(", ")}`;

export const legalDocs: LegalDoc[] = [
  {
    slug: "legal-notice",
    title: ["Legal", "notice."],
    lead: `Who runs this website and how to reach us.`,
    updated: "2026-11-20",
    sections: [
      { title: "Company information", body: [company, `Registration: ${site.registration}.`] },
      { title: "Managing director", body: ["Name of the managing director goes here."] },
      { title: "Contact information", body: [`Email: ${site.contact.email}`, `Phone: ${site.contact.phone}`] },
      { title: "Scope of this notice", body: ["This notice applies to this website and every page and file served from it."] },
      { title: "Intellectual property", body: ["Text, images, graphics, code and design on this website belong to the company or are used with permission. Do not reuse them without written consent."] },
      { title: "External links", body: ["We link to other websites for convenience. We do not control them and are not responsible for their content."] },
      { title: "Disclaimer", body: ["We keep the information on this website accurate and current, but give no guarantee that it is complete or free of errors."] },
      { title: "Applicable law", body: ["The law of the country of the company's registered office applies. Courts at that seat have jurisdiction."] },
    ],
  },
  {
    slug: "data-protection",
    title: ["Data", "protection."],
    lead: "What personal data this website processes, why, and what rights you have.",
    updated: "2026-11-20",
    sections: [
      { title: "Controller", body: [company, `Email: ${site.contact.email}`] },
      { title: "Data we collect", body: ["Data you send us: name, email, company and the content of your brief.", "Technical data: IP address, browser type and pages visited, kept in server logs for security."] },
      { title: "Why we use it", body: ["To answer your enquiry, prepare quotes and deliver projects.", "To keep the website secure and working."] },
      { title: "Legal basis", body: ["Steps before a contract at your request, our legitimate interest in a secure website, and your consent for optional analytics."] },
      { title: "Cookies and analytics", body: ["Necessary storage only, unless you agree to analytics on the cookie settings page. You can change your choice at any time."] },
      { title: "Service providers", body: ["Hosting, email and analytics providers process data on our behalf under data processing agreements."] },
      { title: "Retention", body: ["Enquiries: up to 2 years. Contract records: as long as the law requires. Server logs: up to 30 days."] },
      { title: "Your rights", body: ["You can ask for access, correction, deletion, restriction or a copy of your data, object to processing, and complain to a supervisory authority."] },
    ],
  },
  {
    slug: "terms",
    title: ["Terms &", "conditions."],
    lead: "The rules for using this website and for working with us.",
    updated: "2026-11-20",
    sections: [
      { title: "Scope", body: ["These terms apply to every quote, project and use of this website unless a signed agreement says otherwise."] },
      { title: "Quotes and acceptance", body: ["Quotes are fixed and written. A project starts when the quote is accepted in writing."] },
      { title: "Fees and payment", body: ["Unless agreed otherwise: 50% on acceptance, 50% on delivery, payable within 14 days of invoice."] },
      { title: "Timelines", body: ["Business days count from the accepted quote and the delivery of all materials we need from you."] },
      { title: "Your materials", body: ["You confirm you have the rights to everything you send us, and we use it only for your project."] },
      { title: "Rights to the work", body: ["Usage rights to final deliverables pass to you on full payment. We may show the work in our portfolio unless agreed otherwise."] },
      { title: "Liability", body: ["We are liable for intent and gross negligence. Otherwise liability is limited to the project fee."] },
      { title: "Confidentiality", body: ["Both sides keep the other's confidential information private during and after the project."] },
    ],
  },
];

export const cookieDoc = {
  title: ["Cookie", "settings."] as [string, string],
  lead: "Analytics is optional. Choose what this website may use.",
};
