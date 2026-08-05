import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/careers")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Careers"
      description="Manage internal career openings shown on /careers and in the footer hiring widget."
      resources={[resourceMap.careers]}
    />
  ),
});
