import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Briefcase, MapPin, Search, Users } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { PageBar } from "@/components/site-header";
import { useCms } from "@/lib/cms-store";
import { jobPostingsList } from "@/lib/schema";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/jobs")({
  head: () =>
    buildPageMeta({
      title: "Foreign Employment Jobs — Department of Foreign Employment",
      description:
        "Approved foreign employment vacancies with country, employer, salary, contract period and application deadline.",
      path: "/jobs",
    }),
  component: JobsPage,
});

function JobsPage() {
  const { data } = useCms();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  const [view, setView] = useState<"cards" | "table">("cards");

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(data.jobs.map((j) => j.country)))],
    [data.jobs],
  );

  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.jobs
      .filter((j) => country === "All" || j.country === country)
      .filter((j) => !q || `${j.title} ${j.company} ${j.country}`.toLowerCase().includes(q));
  }, [data.jobs, query, country]);

  return (
    <div>
      <JsonLd data={jobPostingsList(data.jobs)} />
      <PageBar label="Jobs" />
      <section className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <h1 className="gov-section-title text-lg">Approved Foreign Employment Vacancies</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          The following demands have been pre-approved by the Department. Always verify the licence of the
          recruiting agency and never pay more than the service charge prescribed by the Government of Nepal.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded border border-border">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job, employer or country..."
              aria-label="Search jobs"
              className="w-72 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <span className="px-2 text-gov-blue">
              <Search className="h-4 w-4" />
            </span>
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Filter by country"
            className="rounded border border-border px-3 py-2 text-sm"
          >
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setView("cards")}
              className={view === "cards" ? "rounded bg-gov-blue px-4 py-2 text-sm text-primary-foreground" : "rounded border border-border px-4 py-2 text-sm"}
            >
              Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={view === "table" ? "rounded bg-gov-blue px-4 py-2 text-sm text-primary-foreground" : "rounded border border-border px-4 py-2 text-sm"}
            >
              Table
            </button>
          </div>
        </div>

        {view === "cards" ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <article key={j.id} className="rounded border border-border p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-gov-blue">{j.title}</h2>
                  <span
                    className={
                      j.status === "Open"
                        ? "rounded bg-gov-blue-light px-2 py-0.5 text-xs text-gov-blue"
                        : "rounded bg-muted px-2 py-0.5 text-xs text-gov-red"
                    }
                  >
                    {j.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{j.company}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gov-blue" /> {j.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gov-blue" /> {j.vacancies} vacancies
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gov-blue" /> {j.salary} · {j.contract}
                  </div>
                </dl>
                <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  Apply before {j.deadline}
                </p>
              </article>
            ))}
            {jobs.length === 0 && (
              <p className="col-span-full py-16 text-center text-sm text-muted-foreground">
                No vacancies match your search.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">S.No.</th>
                  <th className="px-4 py-3 font-medium">Job Title</th>
                  <th className="px-4 py-3 font-medium">Employer</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Vacancies</th>
                  <th className="px-4 py-3 font-medium">Salary</th>
                  <th className="px-4 py-3 font-medium">Deadline</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={j.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{j.title}</td>
                    <td className="px-4 py-3">{j.company}</td>
                    <td className="px-4 py-3">{j.country}</td>
                    <td className="px-4 py-3">{j.vacancies}</td>
                    <td className="px-4 py-3">{j.salary}</td>
                    <td className="px-4 py-3 text-muted-foreground">{j.deadline}</td>
                    <td className="px-4 py-3">{j.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
