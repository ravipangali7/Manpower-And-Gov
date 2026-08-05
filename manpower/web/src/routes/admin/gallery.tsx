import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/gallery")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Gallery"
      description="Manage gallery albums and images shown on /gallery."
      resources={[resourceMap["gallery-albums"], resourceMap["gallery-images"]]}
    />
  ),
});
