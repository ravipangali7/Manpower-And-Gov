import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  ORG_STRUCTURE,
  ORG_STRUCTURE_META,
  collectDescendantIds,
  findOrgNode,
  flattenOrg,
  type OrgNode,
} from "@/data/org-structure";
import { cn } from "@/lib/utils";

type OrgChartProps = {
  textScale?: number;
  root?: OrgNode;
};

function allExpandableIds(node: OrgNode): string[] {
  const ids: string[] = [];
  if (node.children?.length) {
    ids.push(node.id);
    for (const child of node.children) ids.push(...allExpandableIds(child));
  }
  return ids;
}

export function OrgChart({ textScale = 1, root = ORG_STRUCTURE }: OrgChartProps) {
  const expandable = useMemo(() => allExpandableIds(root), [root]);
  const flat = useMemo(() => flattenOrg(root), [root]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(expandable));
  const [selectedId, setSelectedId] = useState<string | null>(root.id);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(1);

  const selected = selectedId ? findOrgNode(root, selectedId) : null;

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const ids = new Set<string>();
    for (const n of flat) {
      const hay = `${n.title} ${n.titleEn ?? ""} ${n.code ?? ""} ${n.description ?? ""}`.toLowerCase();
      if (hay.includes(q)) ids.add(n.id);
    }
    return ids;
  }, [flat, query]);

  // Auto-expand ancestors of search matches
  useEffect(() => {
    if (!matchIds || matchIds.size === 0) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      for (const n of flat) {
        if (!matchIds.has(n.id)) continue;
        // walk up via tree search of parents by re-checking children ownership
        let cursor: OrgNode | null = root;
        const path: string[] = [];
        const walk = (node: OrgNode, target: string, trail: string[]): boolean => {
          if (node.id === target) {
            path.push(...trail);
            return true;
          }
          for (const c of node.children ?? []) {
            if (walk(c, target, [...trail, node.id])) return true;
          }
          return false;
        };
        walk(cursor, n.id, []);
        for (const id of path) next.add(id);
      }
      return next;
    });
  }, [matchIds, flat, root]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(expandable));
  const collapseAll = () => setExpanded(new Set([root.id]));

  return (
    <div className="space-y-4" style={{ fontSize: `${textScale}rem` }}>
      <p className="text-center font-[Noto_Sans_Devanagari,Jost,sans-serif] text-[1.05em] font-semibold text-gov-ink">
        {ORG_STRUCTURE_META.documentTitle}
      </p>

      <div className="flex flex-col gap-3 rounded border border-border bg-gov-surface/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search section / शाखा…"
            className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:border-gov-blue focus:ring-1 focus:ring-gov-blue"
            aria-label="Search organization structure"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToolbarButton label="Expand all" onClick={expandAll}>
            <Maximize2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton label="Collapse all" onClick={collapseAll}>
            <Minimize2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.1).toFixed(2)))}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </ToolbarButton>
          <span className="min-w-12 text-center text-xs tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <ToolbarButton
            label="Zoom in"
            onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>
      </div>

      {matchIds && (
        <p className="text-xs text-muted-foreground">
          {matchIds.size === 0
            ? "No matching sections."
            : `${matchIds.size} matching section${matchIds.size === 1 ? "" : "s"} highlighted.`}
        </p>
      )}

      <div className="overflow-x-auto rounded border border-border bg-white p-4 md:p-6">
        <div
          className="mx-auto origin-top transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            width: zoom < 1 ? `${100 / zoom}%` : "100%",
          }}
        >
          <OrgTree
            node={root}
            expanded={expanded}
            onToggle={toggle}
            selectedId={selectedId}
            onSelect={setSelectedId}
            matchIds={matchIds}
            isRoot
          />
        </div>
      </div>

      {selected && (
        <aside
          className="rounded border border-gov-blue/30 bg-gov-blue-light/50 p-4"
          aria-live="polite"
        >
          <p className="text-xs font-semibold tracking-wide text-gov-blue uppercase">
            Selected unit
          </p>
          <h2 className="mt-1 font-[Noto_Sans_Devanagari,Jost,sans-serif] text-lg font-semibold text-gov-ink">
            {selected.title}
          </h2>
          {selected.titleEn && (
            <p className="text-sm text-muted-foreground">{selected.titleEn}</p>
          )}
          {selected.code && (
            <p className="mt-2 whitespace-pre-line text-xs text-gov-ink/80">{selected.code}</p>
          )}
          {selected.description && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{selected.description}</p>
          )}
          {selected.children && selected.children.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {selected.children.length} direct sub-unit
              {selected.children.length === 1 ? "" : "s"} ·{" "}
              {collectDescendantIds(selected).length - 1} total under this node
            </p>
          )}
        </aside>
      )}

      <p className="text-center text-[0.7em] text-muted-foreground">{ORG_STRUCTURE_META.note}</p>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-background text-gov-ink hover:border-gov-blue hover:text-gov-blue"
    >
      {children}
    </button>
  );
}

function OrgTree({
  node,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  matchIds,
  isRoot = false,
}: {
  node: OrgNode;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  matchIds: Set<string> | null;
  isRoot?: boolean;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = expanded.has(node.id);
  const layout = node.childLayout ?? "horizontal";
  const isMatch = matchIds?.has(node.id) ?? false;
  const dimmed = matchIds !== null && !isMatch;

  return (
    <div className={cn("flex flex-col items-center", !isRoot && "relative")}>
      <div className={cn(hasChildren && isOpen && "mb-1")}>
        <OrgBox
          node={node}
          selected={selectedId === node.id}
          matched={isMatch}
          dimmed={dimmed}
          hasChildren={hasChildren}
          isOpen={isOpen}
          onSelect={() => onSelect(node.id)}
          onToggle={() => hasChildren && onToggle(node.id)}
        />
      </div>

      {hasChildren && isOpen && (
        <>
          <div className="h-4 w-px bg-gov-ink" aria-hidden />
          {layout === "horizontal" ? (
            <HorizontalChildren
              nodes={node.children!}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              matchIds={matchIds}
            />
          ) : (
            <VerticalChildren
              nodes={node.children!}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              matchIds={matchIds}
            />
          )}
        </>
      )}
    </div>
  );
}

function HorizontalChildren({
  nodes,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  matchIds,
}: {
  nodes: OrgNode[];
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  matchIds: Set<string> | null;
}) {
  return (
    <div className="flex w-full items-start justify-center">
      {nodes.map((child, i) => (
        <div
          key={child.id}
          className="relative flex min-w-[9.5rem] flex-1 flex-col items-center px-1 md:min-w-[10.5rem]"
        >
          {/* Horizontal rail between sibling stubs; outer halves masked on ends */}
          <div className="relative h-px w-full bg-gov-ink" aria-hidden>
            {i === 0 && (
              <div className="absolute top-0 left-0 h-px w-1/2 bg-white" />
            )}
            {i === nodes.length - 1 && (
              <div className="absolute top-0 right-0 h-px w-1/2 bg-white" />
            )}
          </div>
          <div className="h-5 w-px bg-gov-ink" aria-hidden />
          <OrgTree
            node={child}
            expanded={expanded}
            onToggle={onToggle}
            selectedId={selectedId}
            onSelect={onSelect}
            matchIds={matchIds}
          />
        </div>
      ))}
    </div>
  );
}

function VerticalChildren({
  nodes,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  matchIds,
}: {
  nodes: OrgNode[];
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  matchIds: Set<string> | null;
}) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((child, i) => (
        <div key={child.id} className="flex flex-col items-center">
          {i > 0 && <div className="h-4 w-px bg-gov-ink" aria-hidden />}
          <OrgTree
            node={child}
            expanded={expanded}
            onToggle={onToggle}
            selectedId={selectedId}
            onSelect={onSelect}
            matchIds={matchIds}
          />
        </div>
      ))}
    </div>
  );
}

function OrgBox({
  node,
  selected,
  matched,
  dimmed,
  hasChildren,
  isOpen,
  onSelect,
  onToggle,
}: {
  node: OrgNode;
  selected: boolean;
  matched: boolean;
  dimmed: boolean;
  hasChildren: boolean;
  isOpen: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[11.5rem] rounded-sm border-2 bg-white text-center shadow-sm transition-all",
        selected
          ? "border-gov-blue ring-2 ring-gov-blue/25"
          : matched
            ? "border-gov-red ring-1 ring-gov-red/30"
            : "border-gov-ink/80",
        dimmed && "opacity-35",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full px-2 py-2 text-left focus:outline-none"
        aria-pressed={selected}
      >
        <span className="block text-center font-[Noto_Sans_Devanagari,Jost,sans-serif] text-[0.78em] leading-snug font-semibold text-gov-ink">
          {node.title}
        </span>
        {node.code && (
          <span className="mt-1 block whitespace-pre-line text-center font-[Noto_Sans_Devanagari,Jost,sans-serif] text-[0.62em] leading-tight text-gov-ink/75">
            {node.code}
          </span>
        )}
      </button>
      {hasChildren && (
        <button
          type="button"
          aria-label={isOpen ? "Collapse" : "Expand"}
          aria-expanded={isOpen}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="absolute -bottom-3 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-gov-ink/40 bg-white text-gov-ink hover:border-gov-blue hover:text-gov-blue"
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
}
