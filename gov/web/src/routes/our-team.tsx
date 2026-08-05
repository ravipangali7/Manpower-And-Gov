import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Search, User } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { PageBar } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/our-team")({
  head: () =>
    buildPageMeta({
      title: "Official and Staff — Department of Foreign Employment",
      description:
        "Officials and staff of the Department of Foreign Employment: Director General, directors, section officers and their divisions and sections.",
      path: "/our-team",
    }),
  component: TeamPage,
});

const PAGE_SIZE = 10;

type SearchField = "name" | "designation" | "division" | "section" | "email";

const SEARCH_FIELDS: { value: SearchField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "designation", label: "Position" },
  { value: "division", label: "Division" },
  { value: "section", label: "Section" },
  { value: "email", label: "Email" },
];

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function TeamPage() {
  const { data } = useCms();
  const [searchField, setSearchField] = useState<SearchField>("name");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [position, setPosition] = useState("all");
  const [division, setDivision] = useState("all");
  const [section, setSection] = useState("all");
  const [page, setPage] = useState(1);

  const positions = useMemo(
    () => uniqueSorted(data.team.map((m) => m.designation)),
    [data.team],
  );
  const divisions = useMemo(
    () => uniqueSorted(data.team.map((m) => m.division ?? "")),
    [data.team],
  );
  const sections = useMemo(
    () => uniqueSorted(data.team.map((m) => m.section ?? "")),
    [data.team],
  );

  const filtered = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    return data.team.filter((m) => {
      if (position !== "all" && m.designation !== position) return false;
      if (division !== "all" && (m.division ?? "") !== division) return false;
      if (section !== "all" && (m.section ?? "") !== section) return false;
      if (!q) return true;
      const haystack = String(m[searchField] ?? "").toLowerCase();
      return haystack.includes(q);
    });
  }, [data.team, appliedQuery, searchField, position, division, section]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function runSearch(e?: FormEvent) {
    e?.preventDefault();
    setAppliedQuery(query);
    setPage(1);
  }

  return (
    <div>
      <PageBar label="Official and Staff" />
      <section className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <h1 className="gov-section-title text-lg">Official and Staff</h1>
        <div className="mt-6 rounded border border-border p-6">
          <form
            onSubmit={runSearch}
            className="flex flex-wrap items-center gap-3"
            role="search"
            aria-label="Filter team members"
          >
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value as SearchField);
                setPage(1);
              }}
              aria-label="Search by field"
              className="rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gov-blue"
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <input
              placeholder="Search..."
              aria-label={`Search by ${SEARCH_FIELDS.find((f) => f.value === searchField)?.label ?? "field"}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-[180px] flex-1 rounded border border-border px-3 py-2 text-sm outline-none focus:border-gov-blue"
            />

            <button
              type="submit"
              aria-label="Search"
              className="rounded bg-gov-blue-dark p-2.5 text-primary-foreground"
            >
              <Search className="h-4 w-4" />
            </button>

            <select
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by position"
              className="rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gov-blue"
            >
              <option value="all">Position</option>
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by division"
              className="rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gov-blue"
            >
              <option value="all">Division</option>
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by section"
              className="rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gov-blue"
            >
              <option value="all">Section</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </form>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-3 font-medium">Name</th>
                  <th className="py-3 font-medium">Designation</th>
                  <th className="py-3 font-medium">Division</th>
                  <th className="py-3 font-medium">Section</th>
                  <th className="py-3 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No team members match your search.
                    </td>
                  </tr>
                ) : (
                  visible.map((m) => (
                    <tr key={m.id} className="border-b border-border">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 border border-border bg-muted">
                            {m.photoUrl ? (
                              <AvatarImage src={m.photoUrl} alt="" className="object-cover" />
                            ) : null}
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              <User className="h-5 w-5" aria-hidden />
                            </AvatarFallback>
                          </Avatar>
                          <span>{m.name}</span>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{m.designation}</td>
                      <td className="py-3 text-muted-foreground">{m.division || "—"}</td>
                      <td className="py-3 text-muted-foreground">{m.section || "—"}</td>
                      <td className="py-3 text-muted-foreground">
                        {[m.phone, m.email].filter(Boolean).join(" · ") || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
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
                type="button"
                aria-label="Next page"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gov-blue text-gov-blue"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
