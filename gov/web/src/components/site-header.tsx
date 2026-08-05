import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronsRight, Search } from "lucide-react";
import emblem from "@/assets/nepal-emblem.png";
import { JsonLd } from "@/components/seo/json-ld";
import { NAV } from "@/data/site";
import { breadcrumbList, type BreadcrumbItem } from "@/lib/schema";
import { useEffect, useState } from "react";

function useNow() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const t = window.setInterval(tick, 60000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

export function SiteHeader() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const now = useNow();

  return (
    <header>
      <div className="gov-header-pattern">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-6 px-4 py-4 text-primary-foreground md:px-8">
          <div className="flex items-center gap-3">
            <img src={emblem} alt="Emblem of Nepal" width={64} height={64} className="h-14 w-14" />
            <div className="leading-tight">
              <p className="text-xs">Government of Nepal</p>
              <p className="text-xs">Ministry of Youth, Labour and Employment</p>
              <p className="text-base font-semibold">Department of Foreign Employment</p>
              <p className="text-xs">Tahachal, Kathmandu</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">Important Notice</span>
            <span className="opacity-50">|</span>
            <span>Notice</span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-xs">
            <svg viewBox="0 0 30 40" className="h-8 w-6" aria-hidden>
              <path d="M2 2 L26 14 L2 14 L26 30 L2 30 Z" fill="#DC143C" stroke="#003893" strokeWidth="2" />
            </svg>
            <div className="leading-relaxed">
              <p>
                A.D.: <span className="font-semibold">{now || "—"}</span>
              </p>
              <p>
                Nepal Samvat: <span className="font-semibold">1146 DILLATHWA PUNHI - 15</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-1 px-4 py-2 md:px-8">
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              {"to" in item && item.to ? (
                <Link
                  to={item.to}
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium hover:text-gov-blue"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium hover:text-gov-blue">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}
              {item.items.length > 0 && (
                <div className="invisible absolute left-0 top-full z-30 w-72 border-t-2 border-gov-red bg-background py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {item.items.map((sub) =>
                    sub.items && sub.items.length > 0 ? (
                      <div key={sub.label} className="group/sub relative">
                        <span className="flex cursor-default items-center justify-between px-4 py-2 text-sm hover:bg-gov-blue-light hover:text-gov-blue">
                          {sub.label}
                          <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                        </span>
                        <div className="invisible absolute left-full top-0 z-40 w-72 border-t-2 border-gov-red bg-background py-1 opacity-0 shadow-lg transition group-hover/sub:visible group-hover/sub:opacity-100">
                          {sub.items.map((leaf) => (
                            <Link
                              key={leaf.label}
                              to={leaf.to!}
                              className="block px-4 py-2 text-sm hover:bg-gov-blue-light hover:text-gov-blue"
                            >
                              {leaf.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={sub.label}
                        to={sub.to!}
                        className="block px-4 py-2 text-sm hover:bg-gov-blue-light hover:text-gov-blue"
                      >
                        {sub.label}
                      </Link>
                    ),
                  )}
                </div>
              )}

            </div>
          ))}
          <ChevronsRight className="mx-2 h-4 w-4 text-gov-blue" />

          <div className="ml-auto flex items-center gap-3">
            <form
              className="flex items-center rounded border border-border"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/search", search: { q: term } });
              }}
            >
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search..."
                aria-label="Search"
                className="w-48 bg-transparent px-3 py-1.5 text-sm outline-none"
              />
              <button type="submit" aria-label="Search" className="px-2 text-gov-blue">
                <Search className="h-4 w-4" />
              </button>
            </form>
            <Link
              to="/admin"
              className="rounded bg-gov-blue px-3 py-1.5 text-xs text-primary-foreground"
            >
              Admin
            </Link>
            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              ENG <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export type PageBarCrumb = { name: string; path: string };

/**
 * Visible breadcrumb trail + BreadcrumbList JSON-LD for nested pages.
 * Pass `crumbs` for a full trail (Home → … → current). Falls back to Home → label.
 */
export function PageBar({
  label = "Notice",
  crumbs,
}: {
  label?: string;
  /** Full trail including the current page (last item). Each item needs a path for schema. */
  crumbs?: PageBarCrumb[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const trail: PageBarCrumb[] =
    crumbs && crumbs.length > 0
      ? crumbs
      : [
          { name: "Home", path: "/" },
          { name: label, path: pathname || "/" },
        ];

  const schemaItems: BreadcrumbItem[] = trail.map((c) => ({
    name: c.name,
    path: c.path,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-3 md:px-8">
      {schemaItems.length > 1 && (
        <JsonLd id="breadcrumb-jsonld" data={breadcrumbList(schemaItems)} />
      )}
      <nav aria-label="Breadcrumb" className="bg-gov-blue-light px-4 py-3 text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((crumb, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={`${crumb.name}-${i}`} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-border" aria-hidden="true">
                    |
                  </span>
                )}
                {!isLast ? (
                  <a href={crumb.path} className="font-semibold text-gov-blue hover:underline">
                    {crumb.name}
                  </a>
                ) : (
                  <span className="text-muted-foreground" aria-current="page">
                    {crumb.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
