import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import emblem from "@/assets/nepal-emblem.png";
import { PageBar } from "@/components/site-header";
import { AGENCY_TITLES, CATEGORY_TITLES } from "@/data/cms-seed";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const title = CATEGORY_TITLES[params.slug] ?? AGENCY_TITLES[params.slug] ?? "Notices";
    return buildPageMeta({
      title: `${title} — Department of Foreign Employment`,
      description: `${title} published by the Department of Foreign Employment, Ministry of Youth, Labour and Employment, Nepal.`,
      path: `/category/${params.slug}`,
    });
  },
  component: CategoryPage,
});

const PAGE_SIZE = 8;

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useCms();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const isAgency = slug in AGENCY_TITLES;
  const title = CATEGORY_TITLES[slug] ?? AGENCY_TITLES[slug] ?? "Notices";

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (isAgency) {
      return data.agencies
        .filter((a) => a.type === slug)
        .filter((a) => !q || `${a.name} ${a.license} ${a.address}`.toLowerCase().includes(q));
    }
    return data.contents
      .filter((c) => c.category === slug)
      .filter((c) => !q || c.title.toLowerCase().includes(q));
  }, [data, slug, isAgency, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const related = data.contents.filter((c) => c.category !== slug).slice(0, 4);

  return (
    <div>
      <PageBar
        label={title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: title, path: `/category/${slug}` },
        ]}
      />
      <section className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        <h1 className="gov-section-title text-lg">{title}</h1>

        <div className="mt-6 rounded border border-border p-6">
          <div className="flex justify-end gap-2">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              aria-label={`Search ${title}`}
              className="w-64 rounded border border-border px-3 py-2 text-sm outline-none focus:border-gov-blue"
            />
            <button aria-label="Search" className="rounded bg-gov-blue-dark p-2.5 text-primary-foreground">
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            {isAgency ? (
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-3 font-medium">S.No.</th>
                    <th className="py-3 font-medium">Name</th>
                    <th className="py-3 font-medium">Licence No.</th>
                    <th className="py-3 font-medium">Address</th>
                    <th className="py-3 font-medium">Phone</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((a, i) => {
                    const row = a as (typeof data.agencies)[number];
                    return (
                      <tr key={row.id} className="border-b border-border">
                        <td className="py-3">{(current - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="py-3 font-medium">{row.name}</td>
                        <td className="py-3">{row.license}</td>
                        <td className="py-3 text-muted-foreground">{row.address}</td>
                        <td className="py-3 text-muted-foreground">{row.phone}</td>
                        <td className="py-3">
                          <span
                            className={
                              row.status === "Active"
                                ? "rounded bg-gov-blue-light px-2 py-0.5 text-xs text-gov-blue"
                                : "rounded bg-muted px-2 py-0.5 text-xs text-gov-red"
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-3 text-left font-medium">S.No.</th>
                    <th className="py-3 text-center font-medium">Title</th>
                    <th className="py-3 text-right font-medium">Published Date and Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c, i) => {
                    const row = c as (typeof data.contents)[number];
                    return (
                      <tr key={row.id} className="border-b border-border">
                        <td className="py-3">{(current - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="py-3 text-center font-medium">
                          <Link to="/content/$id" params={{ id: row.id }} className="hover:text-gov-blue">
                            {row.title}
                          </Link>
                        </td>
                        <td className="py-3 text-right text-muted-foreground">{row.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {visible.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No records published in this category yet.
              </p>
            )}
          </div>

          {pageCount > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={
                    p === current
                      ? "h-8 w-8 rounded-full bg-gov-blue text-xs text-primary-foreground"
                      : "h-8 w-8 rounded-full border border-gov-blue text-xs text-gov-blue"
                  }
                >
                  {p}
                </button>
              ))}
              <button
                aria-label="Next page"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="h-8 w-8 rounded-full border border-gov-blue text-gov-blue"
              >
                →
              </button>
            </div>
          )}
        </div>

        <h2 className="gov-section-title mt-12 text-lg">Related</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((n) => (
            <Link key={n.id} to="/content/$id" params={{ id: n.id }} className="group text-center">
              <div className="flex h-64 items-center justify-center bg-muted">
                <img
                  src={emblem}
                  alt="Emblem of Nepal"
                  loading="lazy"
                  width={160}
                  height={160}
                  className="h-40 w-40"
                />
              </div>
              <p className="mt-4 text-sm font-semibold group-hover:text-gov-blue">{n.title}</p>
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {n.date}
              </p>
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gov-blue">
                <Download className="h-3 w-3" /> View detail
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
