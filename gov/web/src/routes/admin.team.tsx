import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Official and Staff — DoFE Admin Panel" },
      { name: "description", content: "Manage the staff directory published on the Official and Staff page." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="team"
      title="Team Member"
      description="Staff directory published on the Official and Staff page."
      searchKeys={["name", "designation", "division", "section"]}
      fields={[
        { name: "name", label: "Name" },
        { name: "designation", label: "Designation / Position" },
        { name: "division", label: "Division", optional: true },
        { name: "section", label: "Section", optional: true },
        { name: "phone", label: "Phone", hideInTable: true, optional: true },
        { name: "email", label: "Email", hideInTable: true, optional: true },
        {
          name: "photoUrl",
          label: "Photo URL",
          hideInTable: true,
          optional: true,
          placeholder: "https://...",
        },
      ]}
    />
  ),
});
