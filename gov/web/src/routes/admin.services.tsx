import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Services — DoFE Admin Panel" },
      { name: "description", content: "Manage the online services listed on the homepage and services page." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="services"
      title="Service"
      description="Online services shown on the homepage and the Services page."
      searchKeys={["title", "href"]}
      fields={[
        { name: "title", label: "Title" },
        { name: "href", label: "Link", placeholder: "https://feims.dofe.gov.np" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  ),
});
