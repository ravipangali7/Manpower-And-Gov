import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage, resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/demands")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Demands"
      description="Manage intro copy and public demand list entries shown on /demands."
      resources={[contentBlocksForPage("demands"), resourceMap.demands]}
    />
  ),
});
