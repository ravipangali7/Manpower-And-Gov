import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage, resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/contact")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Contact"
      description="Manage FAQs, phone numbers, office locations and contact page copy. Company details are under Site settings."
      resources={[
        contentBlocksForPage("contact"),
        resourceMap.faqs,
        resourceMap.phones,
        resourceMap.offices,
      ]}
    />
  ),
});
