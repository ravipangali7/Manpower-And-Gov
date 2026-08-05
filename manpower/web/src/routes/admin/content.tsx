import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/content")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Menus & SEO"
      description="Manage navigation, footer links, quick links, social profiles and per-page SEO."
      resources={[
        resourceMap.navigation,
        resourceMap["quick-links"],
        resourceMap["footer-links"],
        resourceMap.social,
        resourceMap.seo,
        resourceMap.pages,
        resourceMap.countries,
      ]}
    />
  ),
});
