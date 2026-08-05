import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Briefcase,
  ClipboardList,
  FileText,
  GalleryHorizontal,
  Inbox,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboard(),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
  if (error || !data) {
    return <p className="text-sm text-destructive">Could not load dashboard.</p>;
  }

  const cards = [
    {
      title: "Vacancies",
      value: data.jobs_active,
      hint: `${data.jobs_total} total`,
      to: "/admin/jobs",
      icon: Briefcase,
    },
    {
      title: "News",
      value: data.news_published,
      hint: `${data.news_total} total`,
      to: "/admin/news",
      icon: FileText,
    },
    {
      title: "Open inquiries",
      value: data.inquiries_open,
      hint: `${data.contact_open} contact · ${data.partnership_open} partnership · ${data.registration_open} registration`,
      to: "/admin/inquiries",
      icon: Inbox,
    },
    {
      title: "Demands",
      value: data.demands_total ?? 0,
      hint: "Active demand entries",
      to: "/admin/demands",
      icon: ClipboardList,
    },
    {
      title: "Gallery",
      value: data.gallery_total ?? 0,
      hint: "Gallery images",
      to: "/admin/gallery",
      icon: GalleryHorizontal,
    },
    {
      title: "CMS pages",
      value: data.pages_total ?? 0,
      hint: "Methodology and custom pages",
      to: "/admin/methodology",
      icon: Info,
    },
    {
      title: "Sectors",
      value: data.sectors_total ?? 0,
      hint: "Services sectors",
      to: "/admin/services",
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-primary" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand-blue-dark">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage every public section from the sidebar. Existing website content is already loaded.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.to + card.title} to={card.to} className="block">
            <Card className="border-border/80 transition-all hover:border-primary/30 hover:bg-brand-red-soft/40 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-md bg-brand-red-soft text-primary">
                  <card.icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-brand-blue-dark">{card.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
