import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/officials")({
  head: () => ({
    meta: [
      { title: "Officials — DoFE Admin Panel" },
      { name: "description", content: "Manage the officials card list shown on the website homepage." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="officials"
      title="Official"
      description="Officials displayed in the homepage contact card."
      searchKeys={["name", "role"]}
      fields={[
        { name: "name", label: "Name" },
        { name: "role", label: "Designation" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
      ]}
    />
  ),
});
