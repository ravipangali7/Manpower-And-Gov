import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { PageBar } from "@/components/site-header";
import { AGENCY_TITLES, CATEGORY_TITLES } from "@/data/cms-seed";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

type SearchParams = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () =>
    buildPageMeta({
      title: "Search — Department of Foreign Employment",
      description:
        "Search notices, publications, agencies, pages and job vacancies published by the Department of Foreign Employment.",
      path: "/search",
      robots: "noindex,follow",
    }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useCms();
  const [term, setTerm] = useState(q);

  const needle = q.trim().toLowerCase();
  const contents = needle
    ? data.contents.filter((c) => `${c.title} ${c.summary}`.toLowerCase().includes(needle))
    : [];
  const agencies = needle
    ? data.agencies.filter((a) => `${a.name} ${a.license} ${a.address}`.toLowerCase().includes(needle))
    : [];
  const pages = needle
    ? data.pages.filter((p) => `${p.title} ${p.body}`.toLowerCase().includes(needle))
    : [];
  const jobs = needle
    ? data.jobs.filter((j) => `${j.title} ${j.company} ${j.country}`.toLowerCase().includes(needle))
    : [];

  const total = contents.length + agencies.length + pages.length + jobs.length;

  return (
    <div>
      <PageBar label="Search" />
      <section className="mx-auto max-w-[1000px] px-4 py-8 md:px-8">
        <h1 className="gov-section-title text-lg">Search</h1>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: term } });
          }}
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search notices, agencies, pages, jobs..."
            aria-label="Search the website"
            className="flex-1 rounded border border-border px-4 py-2.5 text-sm outline-none focus:border-gov-blue"
          />
          <button className="flex items-center gap-2 rounded bg-gov-blue px-5 py-2.5 text-sm text-primary-foreground">
            <SearchIcon className="h-4 w-4" /> Search
          </button>
        </form>

        {needle && (
          <p className="mt-4 text-sm text-muted-foreground">
            {total} result(s) for “{q}”
          </p>
        )}

        {contents.length > 0 && (
          <div className="mt-8">
            <h2 className="gov-section-title text-base">Notices & publications</h2>
            <ul className="mt-4 space-y-4">
              {contents.map((c) => (
                <li key={c.id} className="border-l-2 border-gov-blue pl-3">
                  <Link to="/content/$id" params={{ id: c.id }} className="text-sm font-medium hover:text-gov-blue">
                    {c.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {CATEGORY_TITLES[c.category] ?? c.category} · {c.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {agencies.length > 0 && (
          <div className="mt-8">
            <h2 className="gov-section-title text-base">Agencies</h2>
            <ul className="mt-4 space-y-3">
              {agencies.map((a) => (
                <li key={a.id} className="text-sm">
                  <Link to="/category/$slug" params={{ slug: a.type }} className="font-medium hover:text-gov-blue">
                    {a.name}
                  </Link>
                  <span className="text-muted-foreground">
                    {" "}
                    — {AGENCY_TITLES[a.type]} · Licence {a.license}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pages.length > 0 && (
          <div className="mt-8">
            <h2 className="gov-section-title text-base">Pages</h2>
            <ul className="mt-4 space-y-3">
              {pages.map((p) => (
                <li key={p.id} className="text-sm">
                  <Link to="/pages/$slug" params={{ slug: p.slug }} className="font-medium hover:text-gov-blue">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="mt-8">
            <h2 className="gov-section-title text-base">Job vacancies</h2>
            <ul className="mt-4 space-y-3">
              {jobs.map((j) => (
                <li key={j.id} className="text-sm">
                  <Link to="/jobs" className="font-medium hover:text-gov-blue">
                    {j.title}
                  </Link>
                  <span className="text-muted-foreground"> — {j.company}, {j.country}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {needle && total === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nothing matched your search. Try a different keyword.
          </p>
        )}
      </section>
    </div>
  );
}
