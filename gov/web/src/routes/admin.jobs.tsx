import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/jobs")({
  head: () => ({
    meta: [
      { title: "Job Vacancies — DoFE Admin Panel" },
      { name: "description", content: "Manage approved foreign employment job vacancies shown on the public jobs page." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <ResourceManager
      collection="jobs"
      title="Job Vacancy"
      description="Approved demands published on the public Foreign Employment Jobs page."
      searchKeys={["title", "company", "country"]}
      fields={[
        { name: "title", label: "Job Title" },
        { name: "company", label: "Employer" },
        { name: "country", label: "Country" },
        { name: "vacancies", label: "Vacancies", type: "number" },
        { name: "salary", label: "Salary" },
        { name: "contract", label: "Contract", hideInTable: true },
        { name: "deadline", label: "Deadline" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Open", "Closed"].map((v) => ({ value: v, label: v })),
        },
      ]}
    />
  ),
});
