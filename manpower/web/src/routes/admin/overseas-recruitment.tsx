import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage, resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/overseas-recruitment")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Overseas Recruitment"
      description="Edit overseas recruitment page copy and the How We Recruit process steps."
      resources={[
        contentBlocksForPage("overseas-recruitment"),
        resourceMap.recruitment,
      ]}
    />
  ),
});
