import type { Metadata } from "next";
import { cookieDoc } from "@/content/legal";
import { LegalPage } from "@/components/page/LegalPage";
import { ConsentSettings } from "@/components/page/ConsentSettings";

export const metadata: Metadata = { title: "Cookie settings" };

export default function Page() {
  return (
    <LegalPage current="cookie-settings" title={cookieDoc.title} lead={cookieDoc.lead} updated="2026-11-20">
      <ConsentSettings />
    </LegalPage>
  );
}
