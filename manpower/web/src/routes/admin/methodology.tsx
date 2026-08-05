import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/methodology")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Methodology"
      description="Edit the Methodology CMS page shown at /methodology. Create or update the page with slug “methodology”."
      resources={[resourceMap.pages]}
    />
  ),
});
