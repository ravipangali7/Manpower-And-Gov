import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  ClipboardList,
  GalleryHorizontal,
  Globe,
  Home,
  Inbox,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Scale,
  Settings,
  Shield,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { isLoggedIn } from "@/lib/auth";
import { logout } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    ],
  },
  {
    label: "Website sections",
    items: [
      { to: "/admin/home", label: "Home", icon: Home },
      { to: "/admin/about", label: "About Us", icon: Info },
      { to: "/admin/methodology", label: "Methodology", icon: Workflow },
      { to: "/admin/services", label: "Services", icon: Building2 },
      { to: "/admin/overseas-recruitment", label: "Overseas Recruitment", icon: Globe },
      { to: "/admin/ethical-recruitment", label: "Ethical Recruitment", icon: Scale },
      { to: "/admin/news", label: "News", icon: Newspaper },
      { to: "/admin/jobs", label: "Vacancies", icon: Briefcase },
      { to: "/admin/demands", label: "Demands", icon: ClipboardList },
      { to: "/admin/registrations", label: "Online Registration", icon: UserPlus },
      { to: "/admin/careers", label: "Careers", icon: Users },
      { to: "/admin/awards", label: "Awards", icon: Award },
      { to: "/admin/gallery", label: "Gallery", icon: GalleryHorizontal },
      { to: "/admin/contact", label: "Contact", icon: Mail },
    ],
  },
  {
    label: "Site",
    items: [
      { to: "/admin/site-settings", label: "Site settings", icon: Settings },
      { to: "/admin/content", label: "Menus & SEO", icon: Menu },
      { to: "/admin/users", label: "Staff users", icon: Shield },
    ],
  },
] as const;

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: ({ location }) => {
    const isLogin = location.pathname === "/admin/login";
    if (!isLogin && !isLoggedIn()) {
      throw redirect({ to: "/admin/login" });
    }
    if (isLogin && isLoggedIn()) {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0 shadow-lg shadow-brand-blue-dark/20">
        <SidebarHeader className="border-b border-sidebar-border/80 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/40">
              VV
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold tracking-tight text-sidebar-foreground">
                Super Admin
              </div>
              <p className="truncate text-xs text-sidebar-foreground/65">Vision & Value</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-2">
          {navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const exact = "exact" in item && item.exact;
                    const active = exact
                      ? pathname === item.to
                      : pathname === item.to || pathname.startsWith(`${item.to}/`);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className={cn(
                            "transition-colors",
                            active &&
                              "bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                          )}
                        >
                          <Link to={item.to}>
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/80 p-2">
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-section">
        <header className="flex h-14 items-center gap-3 border-b border-border/80 bg-background px-4 shadow-sm">
          <div className="h-6 w-1 rounded-full bg-primary" aria-hidden />
          <SidebarTrigger className="text-muted-foreground hover:text-primary" />
          <div className="text-sm font-medium text-foreground/80">Content management</div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="ml-auto border-primary/20 text-primary hover:bg-brand-red-soft hover:text-primary"
          >
            <a href="/" target="_blank" rel="noreferrer">
              View site
            </a>
          </Button>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

function LogoutButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-sidebar-foreground/85 hover:bg-primary hover:text-primary-foreground"
      onClick={() => {
        logout();
        void navigate({ to: "/admin/login" });
      }}
    >
      <LogOut />
      Log out
    </Button>
  );
}
