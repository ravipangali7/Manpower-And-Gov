import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { adminApi, type StaffUser } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: AdminUsersPage,
});

type CreateForm = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
};

const emptyForm: CreateForm = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  is_staff: true,
  is_superuser: false,
  is_active: true,
};

function AdminUsersPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.users.list(),
  });

  const createMutation = useMutation({
    mutationFn: (body: CreateForm) => adminApi.users.create(body),
    onSuccess: () => {
      toast.success("Staff user created");
      setForm(emptyForm);
      setShowForm(false);
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? typeof err.data === "object" && err.data
            ? Object.entries(err.data as Record<string, unknown>)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
                .join("; ") || err.message
            : err.message
          : "Create failed";
      toast.error(message);
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<StaffUser> }) =>
      adminApi.users.update(id, body),
    onSuccess: () => {
      toast.success("User updated");
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.users.remove(id),
    onSuccess: () => {
      toast.success("User deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  });

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      toast.error("Username and password are required");
      return;
    }
    createMutation.mutate({
      ...form,
      username: form.username.trim(),
      email: form.email.trim(),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff users</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage Super Admin accounts for this CMS
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Register staff user"}
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={onCreate}
          className="grid gap-4 rounded-md border bg-background p-4 md:grid-cols-2"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="flex flex-wrap items-center gap-6 md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.is_staff}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_staff: v }))}
              />
              Staff (can sign in)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.is_superuser}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_superuser: v }))}
              />
              Superuser
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
              />
              Active
            </label>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating…" : "Create user"}
            </Button>
          </div>
        </form>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    No staff users yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email || "—"}</TableCell>
                    <TableCell>
                      {[user.first_name, user.last_name].filter(Boolean).join(" ") || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[user.is_staff ? "Staff" : null, user.is_superuser ? "Superuser" : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.is_active}
                        disabled={patchMutation.isPending}
                        onCheckedChange={(is_active) =>
                          patchMutation.mutate({ id: user.id, body: { is_active } })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete staff user “${user.username}”? This cannot be undone.`,
                            )
                          ) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
