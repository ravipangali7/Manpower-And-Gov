import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery Albums — DoFE Admin Panel" },
      { name: "description", content: "Manage photograph and audio visual albums shown on the gallery." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="albums"
      title="Album"
      description="Photograph and audio visual albums shown on the homepage and Gallery page."
      searchKeys={["title", "type"]}
      fields={[
        { name: "title", label: "Title", width: "w-[45%]" },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: ["Photographs", "Audio Visual"].map((v) => ({ value: v, label: v })),
        },
        { name: "count", label: "Items", type: "number" },
        { name: "date", label: "Date" },
      ]}
    />
  ),
});
