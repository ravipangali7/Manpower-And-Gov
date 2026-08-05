import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/home")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Home"
      description="Manage homepage hero, stats, motto, testimonials, memberships and partners. Section titles, intros, partnership form copy, and background images are under Site settings."
      resources={[
        resourceMap.hero,
        resourceMap.stats,
        resourceMap.motto,
        resourceMap.testimonials,
        resourceMap.memberships,
        resourceMap.clients,
      ]}
    />
  ),
});
