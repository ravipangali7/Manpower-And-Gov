import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage, resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/about")({
  ssr: false,
  component: () => (
    <SectionPage
      title="About Us"
      description="Edit welcome copy, affiliations, logo story, why-choose-us items, vision/mission accordion and candidate sourcing."
      resources={[
        contentBlocksForPage("about"),
        resourceMap.why,
        resourceMap.accordion,
      ]}
    />
  ),
});
