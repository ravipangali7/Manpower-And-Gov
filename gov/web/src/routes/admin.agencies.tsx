import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";
import { AGENCY_TITLES } from "@/data/cms-seed";

export const Route = createFileRoute("/admin/agencies")({
  head: () => ({
    meta: [
      { title: "Agencies — DoFE Admin Panel" },
      { name: "description", content: "Manage recruiting agencies, orientation centres, insurance companies and banks." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="agencies"
      title="Agency"
      description="Licensed institutions listed under the Agencies menu."
      searchKeys={["name", "license", "address", "type"]}
      fields={[
        { name: "name", label: "Name", width: "w-[26%]" },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: Object.entries(AGENCY_TITLES).map(([value, label]) => ({ value, label })),
        },
        { name: "license", label: "Licence No." },
        { name: "address", label: "Address" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email", hideInTable: true },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Suspended", "Expired"].map((v) => ({ value: v, label: v })),
        },
      ]}
    />
  ),
});
