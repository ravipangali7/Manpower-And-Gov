import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationGraph } from "@/lib/schema";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PartnerWithUs } from "./PartnerWithUs";

export function SiteLayout({
  children,
  partner = true,
}: {
  children: React.ReactNode;
  partner?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={buildOrganizationGraph()} />
      <Header />
      <main>{children}</main>
      {partner && <PartnerWithUs />}
      <Footer />
    </div>
  );
}
