import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCms, type CmsData, type CollectionKey } from "@/lib/cms-store";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hideInTable?: boolean;
  width?: string;
  optional?: boolean;
};

type Row = Record<string, unknown> & { id: string };

export function ResourceManager({
  collection,
  title,
  description,
  fields,
  searchKeys,
}: {
  collection: CollectionKey;
  title: string;
  description: string;
  fields: Field[];
  searchKeys: string[];
}) {
  const { data, create, update, remove } = useCms();
  const rows = data[collection] as unknown as Row[];

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, query, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  function openCreate() {
    const blank: Record<string, unknown> = {};
    for (const f of fields)
      blank[f.name] =
        f.type === "checkbox"
          ? false
          : f.type === "number"
            ? 0
            : f.type === "select"
              ? (f.options?.[0]?.value ?? "")
              : "";
    setForm(blank);
    setCreating(true);
  }

  function openEdit(row: Row) {
    setForm({ ...row });
    setEditing(row);
  }

  function submit() {
    const missing = fields.find(
      (f) =>
        !f.optional &&
        f.type !== "checkbox" &&
        f.type !== "number" &&
        !String(form[f.name] ?? "").trim(),
    );
    if (missing) {
      toast.error(`${missing.label} is required`);
      return;
    }
    const payload = { ...form };
    for (const f of fields) if (f.type === "number") payload[f.name] = Number(payload[f.name] ?? 0);
    if (editing) {
      update(collection, editing.id, payload as never);
      toast.success(`${title} updated`);
      setEditing(null);
    } else {
      delete (payload as { id?: string }).id;
      create(collection, payload as never);
      toast.success(`${title} created`);
      setCreating(false);
    }
  }

  const tableFields = fields.filter((f) => !f.hideInTable);
  const open = creating || editing !== null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add new
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">{filtered.length} record(s)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="w-14 px-4 py-3 font-medium">S.No.</th>
                {tableFields.map((f) => (
                  <th key={f.name} className={`px-4 py-3 font-medium ${f.width ?? ""}`}>
                    {f.label}
                  </th>
                ))}
                <th className="w-28 px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3 text-muted-foreground">{(current - 1) * pageSize + i + 1}</td>
                  {tableFields.map((f) => (
                    <td key={f.name} className="px-4 py-3 align-top">
                      {f.type === "checkbox" ? (
                        <span
                          className={
                            row[f.name]
                              ? "rounded bg-gov-blue-light px-2 py-0.5 text-xs text-gov-blue"
                              : "text-xs text-muted-foreground"
                          }
                        >
                          {row[f.name] ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="line-clamp-2">{String(row[f.name] ?? "")}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" aria-label="Edit" onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="Delete"
                        onClick={() => setDeleting(row)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={tableFields.length + 2} className="px-4 py-10 text-center text-muted-foreground">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-border p-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === current ? "default" : "outline"}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            setCreating(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `Create ${title}`}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the record and save your changes." : "Fill the form to add a new record."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    rows={6}
                    className="mt-1.5"
                    placeholder={f.placeholder}
                    value={String(form[f.name] ?? "")}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={String(form[f.name] ?? "")}
                    onValueChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                  >
                    <SelectTrigger id={f.name} className="mt-1.5">
                      <SelectValue placeholder={`Select ${f.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : f.type === "checkbox" ? (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      id={f.name}
                      type="checkbox"
                      className="h-4 w-4"
                      checked={Boolean(form[f.name])}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.checked }))}
                    />
                    <span className="text-sm text-muted-foreground">{f.placeholder ?? "Enabled"}</span>
                  </div>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : "text"}
                    className="mt-1.5"
                    placeholder={f.placeholder}
                    value={String(form[f.name] ?? "")}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={submit}>{editing ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the record from the demo database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) {
                  remove(collection, deleting.id);
                  toast.success(`${title} deleted`);
                }
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function useCollectionCount(key: CollectionKey) {
  const { data } = useCms();
  return (data[key] as unknown as unknown[]).length;
}

export type { CmsData };
