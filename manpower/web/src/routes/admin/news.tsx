import { createFileRoute } from "@tanstack/react-router";
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
import { adminApi, type NewsArticle } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";
import { invalidatePublicQueries } from "@/lib/public-cache";

export const Route = createFileRoute("/admin/news")({
  ssr: false,
  component: AdminNewsPage,
});

type NewsForm = {
  title: string;
  author: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  published_at: string;
};

const emptyForm: NewsForm = {
  title: "",
  author: "",
  excerpt: "",
  content: "",
  is_published: true,
  published_at: "",
};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function AdminNewsPage() {
  const qc = useQueryClient();
  const newsQuery = useQuery({ queryKey: ["admin", "news"], queryFn: () => adminApi.news.list() });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<NewsForm>(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(article: NewsArticle) {
    setEditing(article);
    setForm({
      title: article.title,
      author: article.author,
      excerpt: article.excerpt,
      content: article.content || "",
      is_published: article.is_published,
      published_at: toLocalInput(article.published_at),
    });
    setOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        title: form.title,
        author: form.author,
        excerpt: form.excerpt,
        content: form.content,
        is_published: form.is_published,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      };
      if (editing) return adminApi.news.update(editing.id, body);
      return adminApi.news.create(body);
    },
    onSuccess: () => {
      toast.success(editing ? "Article updated" : "Article created");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["admin", "news"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.news.remove(id),
    onSuccess: () => {
      toast.success("Article deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "news"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  });

  const articles = newsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">News</h1>
          <p className="text-sm text-muted-foreground">Publish and edit news articles</p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Add article
        </Button>
      </div>

      {newsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No articles yet.
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{article.is_published ? "Published" : "Draft"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(article)}>
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Delete this article?")) deleteMutation.mutate(article.id);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit article" : "Add article"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Published at</Label>
              <Input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, is_published: checked }))}
              />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saveMutation.isPending || !form.title || !form.author || !form.excerpt}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
