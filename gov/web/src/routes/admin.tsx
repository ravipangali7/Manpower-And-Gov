import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Phone,
  RotateCcw,
  Settings,
  Briefcase,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCms } from "@/lib/cms-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Department of Foreign Employment" },
      { name: "description", content: "Demo content management panel for the departmental website." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/contents", label: "Notices & Content", icon: Newspaper },
  { to: "/admin/agencies", label: "Agencies", icon: Building2 },
  { to: "/admin/jobs", label: "Job Vacancies", icon: Briefcase },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/officials", label: "Officials", icon: UserRound },
  { to: "/admin/team", label: "Official and Staff", icon: Users },
  { to: "/admin/pages", label: "Static Pages", icon: FileText },
  { to: "/admin/gallery", label: "Gallery Albums", icon: Image },
  { to: "/admin/contacts", label: "Contact Numbers", icon: Phone },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[];

function LoginScreen() {
  const { login, data } = useCms();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demo panel for managing website content.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (login(user, password)) {
              toast.success("Welcome back, administrator");
              setError("");
            } else {
              setError("Invalid username or password");
            }
          }}
        >
          <div>
            <Label htmlFor="user">Username</Label>
            <Input id="user" className="mt-1.5" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 rounded bg-muted p-3 text-xs text-muted-foreground">
          Demo credentials — username: <strong>{data.settings.adminUser}</strong>, password:{" "}
          <strong>{data.settings.adminPassword}</strong>
        </p>
      </div>
    </div>
  );
}

function AdminLayout() {
  const { isAuthed, logout, resetAll } = useCms();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!isAuthed) return <LoginScreen />;

  return (
    <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 md:px-8">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-6 rounded-lg border border-border bg-card p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Content Management
          </p>
          <nav className="mt-1 space-y-1">
            {LINKS.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to as never}
                  className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${
                    active ? "bg-gov-blue text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 space-y-1 border-t border-border pt-3">
            <button
              onClick={() => {
                resetAll();
                toast.success("Demo data restored");
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </button>
            <button
              onClick={() => {
                logout();
                toast.success("Signed out");
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-destructive hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {LINKS.map(({ to, label }) => (
            <Link key={to} to={to as never} className="rounded border border-border px-3 py-1.5 text-xs">
              {label}
            </Link>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
