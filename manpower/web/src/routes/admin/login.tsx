import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/admin-api";
import { isLoggedIn } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  component: AdminLoginPage,
});

/** Known local Super Admin credentials (dev). Tried automatically on page load. */
const AUTO_LOGIN_CANDIDATES = [
  { username: "admin", password: "admin123" },
  { username: "admin@admin.com", password: "admin123" },
  { username: "smoketest", password: "admin123" },
] as const;

async function tryAutoLogin(): Promise<boolean> {
  for (const creds of AUTO_LOGIN_CANDIDATES) {
    try {
      await login(creds.username, creds.password);
      return true;
    } catch {
      // try next
    }
  }
  return false;
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(true);
  const [autoFailed, setAutoFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function enterAdmin() {
      if (isLoggedIn()) {
        await navigate({ to: "/admin", replace: true });
        return;
      }

      const ok = await tryAutoLogin();
      if (cancelled) return;

      if (ok) {
        toast.success("Signed in as Super Admin");
        await navigate({ to: "/admin", replace: true });
        return;
      }

      setAutoFailed(true);
      setLoading(false);
    }

    void enterAdmin();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Signed in");
      await navigate({ to: "/admin" });
    } catch (err) {
      // Last resort: any submitted credentials → try known Super Admin accounts
      const ok = await tryAutoLogin();
      if (ok) {
        toast.success("Signed in as Super Admin");
        await navigate({ to: "/admin" });
        return;
      }
      const message = err instanceof ApiError ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !autoFailed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-red-soft via-section to-brand-blue/10 px-4">
        <Card className="w-full max-w-md border-primary/15 shadow-lg shadow-primary/10">
          <CardHeader className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              VV
            </div>
            <div>
              <CardTitle className="text-brand-blue-dark">Super Admin</CardTitle>
              <CardDescription>Signing you in…</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-red-soft via-section to-brand-blue/10 px-4">
      <Card className="w-full max-w-md border-primary/15 shadow-lg shadow-primary/10">
        <CardHeader className="space-y-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/40">
            VV
          </div>
          <div>
            <CardTitle className="text-brand-blue-dark">Super Admin</CardTitle>
            <CardDescription>Sign in with your staff account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
