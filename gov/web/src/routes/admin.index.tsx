import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORY_TITLES } from "@/data/cms-seed";
import { useCms } from "@/lib/cms-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DoFE Admin Panel" },
      { name: "description", content: "Overview of website content managed through the demo admin panel." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useCms();

  const stats = [
    { label: "Notices & Content", value: data.contents.length, to: "/admin/contents" },
    { label: "Agencies", value: data.agencies.length, to: "/admin/agencies" },
    { label: "Job Vacancies", value: data.jobs.length, to: "/admin/jobs" },
    { label: "Services", value: data.services.length, to: "/admin/services" },
    { label: "Team Members", value: data.team.length, to: "/admin/team" },
    { label: "Static Pages", value: data.pages.length, to: "/admin/pages" },
    { label: "Gallery Albums", value: data.albums.length, to: "/admin/gallery" },
    { label: "Contact Sections", value: data.contactSections.length, to: "/admin/contacts" },
  ] as const;

  const byCategory = Object.entries(
    data.contents.reduce<Record<string, number>>((acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything published on the public website is managed from here.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-lg border border-border bg-card p-5 transition hover:border-gov-blue"
          >
            <p className="text-3xl font-semibold text-gov-blue">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recently published
          </h2>
          <ul className="mt-4 space-y-4">
            {data.contents.slice(0, 6).map((c) => (
              <li key={c.id} className="border-l-2 border-gov-blue pl-3">
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {CATEGORY_TITLES[c.category] ?? c.category} · {c.date}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Content by category
          </h2>
          <ul className="mt-4 space-y-3">
            {byCategory.map(([cat, count]) => (
              <li key={cat} className="flex items-center gap-3 text-sm">
                <span className="w-56 shrink-0 truncate">{CATEGORY_TITLES[cat] ?? cat}</span>
                <span className="h-2 flex-1 rounded bg-muted">
                  <span
                    className="block h-2 rounded bg-gov-blue"
                    style={{ width: `${Math.min(100, count * 14)}%` }}
                  />
                </span>
                <span className="w-6 text-right text-muted-foreground">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
