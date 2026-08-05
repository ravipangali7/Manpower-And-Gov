import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage } from "@/components/admin/resource-config";

export const Route = createFileRoute("/admin/ethical-recruitment")({
  ssr: false,
  component: () => (
    <SectionPage
      title="Ethical Recruitment"
      description="Edit Ethical Recruitment page copy, section headings, and the Ethical vs Zero-cost comparison table (use ||| to separate columns; one row per line in Body paragraph 2)."
      resources={[contentBlocksForPage("ethical-recruitment")]}
    />
  ),
});
