import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({
    meta: [
      { title: "Contact Numbers — DoFE Admin Panel" },
      { name: "description", content: "Manage the section-wise contact number table shown at the top of the homepage." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="contactSections"
      title="Contact Section"
      description="Section-wise contact numbers shown in the red banner on the homepage."
      searchKeys={["name", "rows"]}
      fields={[
        { name: "no", label: "S.No." },
        { name: "name", label: "Section", width: "w-[35%]" },
        { name: "rows", label: "Contact rows (one per line)", type: "textarea" },
      ]}
    />
  ),
});
