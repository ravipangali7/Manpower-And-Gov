import {
  ChevronLeft,
  ChevronRight,
  Download,
  Grid3X3,
  Maximize,
  Minimize,
  MoreHorizontal,
  Printer,
  RotateCcw,
  Search,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import emblem from "@/assets/nepal-emblem.png";
import {
  CITIZEN_CHARTER_META,
  type CharterDocumentPage,
} from "@/data/citizen-charter";
import { cn } from "@/lib/utils";

type DocumentViewerProps = {
  pages: CharterDocumentPage[];
  title?: string;
  /** External text scale from A+ / A− controls (1 = default). */
  textScale?: number;
  className?: string;
};

export function DocumentViewer({
  pages,
  title = CITIZEN_CHARTER_META.titleEn,
  textScale = 1,
  className,
}: DocumentViewerProps) {
  const total = pages.length;
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [gridOpen, setGridOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const shellRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  const page = pages[pageIndex] ?? pages[0];
  const q = searchQuery.trim().toLowerCase();

  const searchHits = useMemo(() => {
    if (!q) return [] as number[];
    return pages
      .map((p, i) => {
        const hay = p.rows
          .map((r) =>
            [r.sn, r.service, r.documents, r.fee, r.duration, r.responsible, r.remarks ?? ""].join(
              " ",
            ),
          )
          .join(" ")
          .toLowerCase();
        return hay.includes(q) ? i : -1;
      })
      .filter((i) => i >= 0);
  }, [pages, q]);

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setPageIndex(((next % total) + total) % total);
    },
    [total],
  );

  const prev = useCallback(() => go(pageIndex - 1), [go, pageIndex]);
  const next = useCallback(() => go(pageIndex + 1), [go, pageIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") {
        setGridOpen(false);
        setSearchOpen(false);
        setMoreOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  useEffect(() => {
    function onFs() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  async function toggleFullscreen() {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* fullscreen may be blocked */
    }
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied");
      window.setTimeout(() => setShareMsg(null), 2000);
    } catch {
      setShareMsg("Unable to share");
      window.setTimeout(() => setShareMsg(null), 2000);
    }
  }

  function printDoc() {
    if (typeof window !== "undefined") window.print();
  }

  function downloadText() {
    const lines = pages.flatMap((p) =>
      p.rows.map(
        (r) =>
          `${r.sn}\t${r.service}\t${r.documents}\t${r.fee}\t${r.duration}\t${r.responsible}\t${r.remarks ?? ""}`,
      ),
    );
    const header =
      "S.N.\tService\tDocuments\tFee\tDuration\tResponsible\tRemarks\n";
    const blob = new Blob([header + lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "citizen-charter.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!page || total === 0) {
    return (
      <div className="rounded border border-border bg-muted px-6 py-16 text-center text-sm text-muted-foreground">
        No document pages published yet.
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative overflow-hidden rounded border border-[#5a5a5a] bg-[#6b6b6b] shadow-inner",
        isFullscreen && "fixed inset-0 z-[80] rounded-none border-0",
        className,
      )}
    >
      {/* Stage */}
      <div className="relative flex min-h-[520px] items-center justify-center px-10 py-8 md:min-h-[640px]">
        <button
          type="button"
          aria-label="Previous page"
          onClick={prev}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55 md:left-3"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          aria-label="Next page"
          onClick={next}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55 md:right-3"
        >
          <ChevronRight className="h-7 w-7" />
        </button>

        <div
          className="origin-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <CharterSheet page={page} textScale={textScale} highlight={q} />
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-1 bg-gradient-to-t from-black/70 via-black/45 to-transparent px-3 pb-3 pt-10 text-white">
        <ToolbarBtn label="Previous page" onClick={prev}>
          <ChevronLeft className="h-4 w-4" />
        </ToolbarBtn>
        <span className="min-w-[3.5rem] px-1 text-center text-xs tabular-nums">
          {pageIndex + 1}/{total}
        </span>
        <ToolbarBtn label="Next page" onClick={next}>
          <ChevronRight className="h-4 w-4" />
        </ToolbarBtn>

        <span className="mx-1 h-4 w-px bg-white/30" aria-hidden />

        <ToolbarBtn
          label="Grid view"
          active={gridOpen}
          onClick={() => {
            setGridOpen((v) => !v);
            setSearchOpen(false);
            setMoreOpen(false);
          }}
        >
          <Grid3X3 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Search document"
          active={searchOpen}
          onClick={() => {
            setSearchOpen((v) => !v);
            setGridOpen(false);
            setMoreOpen(false);
          }}
        >
          <Search className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))}>
          <ZoomOut className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)))}>
          <ZoomIn className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </ToolbarBtn>
        <ToolbarBtn label="Share" onClick={share}>
          <Share2 className="h-4 w-4" />
        </ToolbarBtn>
        <div className="relative">
          <ToolbarBtn
            label="More options"
            active={moreOpen}
            onClick={() => {
              setMoreOpen((v) => !v);
              setGridOpen(false);
              setSearchOpen(false);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </ToolbarBtn>
          {moreOpen && (
            <div className="absolute bottom-10 right-0 z-40 min-w-[160px] rounded border border-border bg-background py-1 text-foreground shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gov-blue-light"
                onClick={() => {
                  setZoom(1);
                  setMoreOpen(false);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset zoom
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gov-blue-light"
                onClick={() => {
                  printDoc();
                  setMoreOpen(false);
                }}
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gov-blue-light"
                onClick={() => {
                  downloadText();
                  setMoreOpen(false);
                }}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          )}
        </div>
      </div>

      {shareMsg && (
        <div className="absolute bottom-14 left-1/2 z-40 -translate-x-1/2 rounded bg-gov-blue px-3 py-1.5 text-xs text-primary-foreground shadow">
          {shareMsg}
        </div>
      )}

      {/* Search panel */}
      {searchOpen && (
        <div className="absolute left-1/2 top-4 z-40 w-[min(92%,380px)] -translate-x-1/2 rounded border border-border bg-background p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <label htmlFor={searchId} className="sr-only">
              Search in document
            </label>
            <input
              id={searchId}
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, fees…"
              className="min-w-0 flex-1 rounded border border-border px-3 py-1.5 text-sm outline-none focus:border-gov-blue"
            />
            <button
              type="button"
              aria-label="Close search"
              className="rounded p-1.5 text-muted-foreground hover:bg-muted"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {q ? (
            <ul className="mt-2 max-h-40 overflow-y-auto text-sm">
              {searchHits.length === 0 ? (
                <li className="px-1 py-2 text-muted-foreground">No matches</li>
              ) : (
                searchHits.map((i) => (
                  <li key={pages[i]!.id}>
                    <button
                      type="button"
                      className="w-full rounded px-2 py-1.5 text-left hover:bg-gov-blue-light hover:text-gov-blue"
                      onClick={() => {
                        setPageIndex(i);
                        setSearchOpen(false);
                      }}
                    >
                      Page {i + 1} — {pages[i]!.rows[0]?.service.slice(0, 42)}…
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Type to find text across all pages.</p>
          )}
        </div>
      )}

      {/* Grid thumbnails */}
      {gridOpen && (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-black/75 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between text-white">
            <p className="text-sm font-medium">All pages ({total})</p>
            <button
              type="button"
              aria-label="Close grid"
              className="rounded bg-white/15 p-1.5 hover:bg-white/25"
              onClick={() => setGridOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pages.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPageIndex(i);
                  setGridOpen(false);
                }}
                className={cn(
                  "overflow-hidden rounded border bg-[#f7f4ee] text-left shadow transition hover:ring-2 hover:ring-gov-blue",
                  i === pageIndex ? "ring-2 ring-gov-blue" : "border-white/30",
                )}
              >
                <div className="space-y-1 p-3">
                  <div className="mx-auto h-6 w-6 rounded-full bg-gov-blue/15" />
                  <p className="truncate text-center text-[10px] font-semibold text-gov-blue">
                    नागरिक बडापत्र
                  </p>
                  <div className="space-y-0.5">
                    {p.rows.slice(0, 3).map((r) => (
                      <div key={r.sn} className="h-1.5 rounded-sm bg-[#cfc8b8]/80" />
                    ))}
                  </div>
                </div>
                <span className="block bg-muted px-2 py-1 text-center text-xs text-muted-foreground">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded p-2 transition hover:bg-white/20",
        active && "bg-white/25",
      )}
    >
      {children}
    </button>
  );
}

function highlightText(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200 text-inherit">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function CharterSheet({
  page,
  textScale,
  highlight = "",
}: {
  page: CharterDocumentPage;
  textScale: number;
  highlight?: string;
}) {
  return (
    <article
      className="w-[min(100%,720px)] bg-[#f7f4ee] p-5 text-gov-ink shadow-2xl md:p-7"
      style={{ fontSize: `${0.72 * textScale}rem` }}
    >
      <header className="border-b border-gov-blue/30 pb-3 text-center">
        <img
          src={emblem}
          alt=""
          width={48}
          height={48}
          className="mx-auto h-10 w-10 md:h-12 md:w-12"
        />
        <p className="mt-1 text-[0.95em] font-semibold">{CITIZEN_CHARTER_META.ministry}</p>
        <p className="text-[1.05em] font-bold text-gov-blue">{CITIZEN_CHARTER_META.office}</p>
        <p className="text-[0.85em] text-muted-foreground">{CITIZEN_CHARTER_META.address}</p>
        <h2 className="mt-2 text-[1.15em] font-bold underline decoration-gov-blue/60">
          {CITIZEN_CHARTER_META.titleNe} / {CITIZEN_CHARTER_META.titleEn}
        </h2>
      </header>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-gov-blue text-primary-foreground">
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">क्र.सं.</th>
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">सेवाको विवरण</th>
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">आवश्यक कागजात</th>
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">दस्तुर</th>
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">समय</th>
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">जिम्मेवार</th>
              <th className="border border-gov-blue px-1.5 py-1.5 font-semibold">कैफियत</th>
            </tr>
          </thead>
          <tbody>
            {page.rows.map((row) => (
              <tr key={`${page.id}-${row.sn}`} className="odd:bg-white even:bg-[#efeae0]">
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top tabular-nums">
                  {row.sn}
                </td>
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top font-medium">
                  {highlightText(row.service, highlight)}
                </td>
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top">
                  {highlightText(row.documents, highlight)}
                </td>
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top whitespace-nowrap">
                  {highlightText(row.fee, highlight)}
                </td>
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top whitespace-nowrap">
                  {highlightText(row.duration, highlight)}
                </td>
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top">
                  {highlightText(row.responsible, highlight)}
                </td>
                <td className="border border-[#cfc8b8] px-1.5 py-1.5 align-top text-muted-foreground">
                  {highlightText(row.remarks ?? "—", highlight)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-3 flex items-center justify-between border-t border-gov-blue/20 pt-2 text-[0.8em] text-muted-foreground">
        <span>वैदेशिक रोजगार विभाग · Dummy sample</span>
        <span>
          पृष्ठ {page.pageNo}
        </span>
      </footer>
    </article>
  );
}

/** Font-size controls matching the live portal (A+ / reset / A−). */
export function TextSizeControls({
  scale,
  onChange,
}: {
  scale: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Text size">
      <button
        type="button"
        aria-label="Increase text size"
        onClick={() => onChange(Math.min(1.6, +(scale + 0.1).toFixed(2)))}
        className="rounded bg-gov-blue px-2.5 py-1 text-sm font-semibold text-primary-foreground"
      >
        A+
      </button>
      <button
        type="button"
        aria-label="Reset text size"
        onClick={() => onChange(1)}
        className="rounded bg-gov-blue px-2.5 py-1 text-sm text-primary-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Decrease text size"
        onClick={() => onChange(Math.max(0.8, +(scale - 0.1).toFixed(2)))}
        className="rounded bg-gov-blue px-2.5 py-1 text-sm font-semibold text-primary-foreground"
      >
        A−
      </button>
    </div>
  );
}
