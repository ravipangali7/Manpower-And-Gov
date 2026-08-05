import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage, resourceMap } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/awards")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Awards"
      description="Manage intro copy and certificates (preview images + downloadable PDFs) on /awards."
      resources={[contentBlocksForPage("awards"), resourceMap.certificates]}
    />
  ),
});
