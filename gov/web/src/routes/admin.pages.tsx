import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/pages")({
  head: () => ({
    meta: [
      { title: "Static Pages — DoFE Admin Panel" },
      { name: "description", content: "Manage About Us pages such as Aim and Vision, Background and Citizen Charter." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="pages"
      title="Page"
      description="About Us and information pages served at /pages/{slug}."
      searchKeys={["title", "slug"]}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug", placeholder: "aim-and-vision" },
        { name: "body", label: "Body (blank line = new paragraph)", type: "textarea", hideInTable: true },
        {
          name: "metaDescription",
          label: "Meta description",
          type: "textarea",
          hideInTable: true,
          optional: true,
        },
        {
          name: "documentPagesJson",
          label: "Document pages JSON (flipbook — Citizen Charter)",
          type: "textarea",
          hideInTable: true,
          optional: true,
          placeholder: '[{"id":"…","pageNo":1,"rows":[…]}]',
        },
      ]}
    />
  ),
});
