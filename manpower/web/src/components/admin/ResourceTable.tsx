import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import type { OrderedItem } from "@/lib/admin-api";
import { invalidatePublicQueries } from "@/lib/public-cache";
import type { ResourceConfig } from "./resource-config";

type Props = {
  config: ResourceConfig;
  active?: boolean;
  title?: string;
};

export function ResourceTable({ config, active = true, title }: Props) {
  const qc = useQueryClient();
  const queryKey = ["admin", "content", config.key, config.listParams || {}];
  const query = useQuery({
    queryKey,
    queryFn: () => config.api.list(config.listParams),
    enabled: active,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OrderedItem | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(config.defaults);
  const [files, setFiles] = useState<Record<string, File | null>>({});

  function openCreate() {
    setEditing(null);
    setForm({ ...config.defaults });
    setFiles({});
    setOpen(true);
  }

  function openEdit(row: OrderedItem) {
    setEditing(row);
    const next: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (field.type === "file") continue;
      next[field.key] = row[field.key] ?? config.defaults[field.key];
    }
    setForm(next);
    setFiles({});
    setOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const hasFiles = Object.values(files).some(Boolean);
      if (config.multipart || hasFiles) {
        const fd = new FormData();
        for (const field of config.fields) {
          if (field.type === "file") {
            const file = files[field.key];
            if (file) fd.append(field.key, file);
            continue;
          }
          let value = form[field.key];
          if (field.type === "number") value = Number(value) || 0;
          if (field.type === "boolean") {
            fd.append(field.key, value ? "true" : "false");
          } else if (value !== undefined && value !== null && value !== "") {
            fd.append(field.key, String(value));
          }
        }
        if (editing) return config.api.update(editing.id, fd);
        return config.api.create(fd);
      }

      const body: Record<string, unknown> = {};
      for (const field of config.fields) {
        if (field.type === "file") continue;
        let value = form[field.key];
        if (field.type === "number") value = Number(value) || 0;
        body[field.key] = value;
      }
      if (editing) return config.api.update(editing.id, body);
      return config.api.create(body);
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      setOpen(false);
      void qc.invalidateQueries({ queryKey });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => config.api.remove(id),
    onSuccess: () => {
      toast.success("Deleted");
      void qc.invalidateQueries({ queryKey });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        {title ? <h2 className="text-base font-semibold">{title}</h2> : <div />}
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add {config.label}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(query.data || []).map((row) => (
              <TableRow key={row.id}>
                {config.columns.map((c) => (
                  <TableCell key={c.key}>
                    {typeof row[c.key] === "boolean"
                      ? row[c.key]
                        ? "Yes"
                        : "No"
                      : String(row[c.key] ?? "")}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete this item?")) deleteMutation.mutate(row.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!query.isLoading && !(query.data || []).length && (
              <TableRow>
                <TableCell
                  colSpan={config.columns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  No items yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : "Add"} {config.label}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {config.fields.map((field) => (
              <div key={field.key} className="grid gap-1.5">
                {field.type === "boolean" ? (
                  <div className="flex items-center justify-between">
                    <Label>{field.label}</Label>
                    <Switch
                      checked={Boolean(form[field.key])}
                      onCheckedChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
                    />
                  </div>
                ) : field.type === "file" ? (
                  <>
                    <Label>{field.label}</Label>
                    <Input
                      type="file"
                      accept={field.accept}
                      onChange={(e) =>
                        setFiles((f) => ({
                          ...f,
                          [field.key]: e.target.files?.[0] || null,
                        }))
                      }
                    />
                    {editing && editing[`${field.key}_url` as string] ? (
                      <p className="text-xs text-muted-foreground">
                        Current:{" "}
                        <a
                          href={String(editing[`${field.key}_url` as string])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline-offset-2 hover:underline"
                        >
                          view / download
                        </a>{" "}
                        — upload to replace
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Label>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        rows={4}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      >
                        {(field.options || []).map((o) => (
                          <option key={String(o.value)} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        required={field.required}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SectionPage({
  title,
  description,
  resources,
}: {
  title: string;
  description: string;
  resources: ResourceConfig[];
}) {
  const [tab, setTab] = useState(resources[0]?.key || "");
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {resources.length > 1 ? (
        <div className="flex flex-wrap gap-2 border-b pb-2">
          {resources.map((r) => (
            <Button
              key={r.key}
              size="sm"
              variant={tab === r.key ? "default" : "outline"}
              onClick={() => setTab(r.key)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      ) : null}
      {resources.map((r) =>
        tab === r.key || resources.length === 1 ? (
          <ResourceTable key={r.key} config={r} active title={resources.length === 1 ? r.label : undefined} />
        ) : null,
      )}
    </div>
  );
}
