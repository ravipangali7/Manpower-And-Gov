import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";
import { CATEGORY_TITLES } from "@/data/cms-seed";

export const Route = createFileRoute("/admin/contents")({
  head: () => ({
    meta: [
      { title: "Notices & Content — DoFE Admin Panel" },
      { name: "description", content: "Create, edit and delete notices, press releases, acts and publications." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="contents"
      title="Notice / Content"
      description="Everything listed under Notice, Resources and Downloads menus."
      searchKeys={["title", "category", "date"]}
      fields={[
        { name: "title", label: "Title", width: "w-[34%]" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: Object.entries(CATEGORY_TITLES).map(([value, label]) => ({ value, label })),
        },
        { name: "date", label: "Published Date", placeholder: "July 28, 2026, 04:13 PM" },
        {
          name: "updatedAt",
          label: "Updated Date (optional)",
          placeholder: "July 29, 2026, 10:00 AM",
          hideInTable: true,
          optional: true,
        },
        { name: "featured", label: "Show on homepage", type: "checkbox" },
        { name: "fileUrl", label: "Attachment URL", hideInTable: true, placeholder: "https://..." },
        { name: "summary", label: "Summary", type: "textarea", hideInTable: true },
        { name: "body", label: "Body", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
