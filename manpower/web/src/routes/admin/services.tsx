import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage, resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/services")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Services"
      description="Manage /services intro copy, sector cards (name, description, image), and featured flags. Changes appear live on the public Services page."
      resources={[contentBlocksForPage("services"), resourceMap.sectors]}
    />
  ),
});
