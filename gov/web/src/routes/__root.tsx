import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AccessibilityButton } from "@/components/accessibility-button";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/seo/analytics";
import { Toaster } from "@/components/ui/sonner";
import { siteSeo } from "@/config/site-seo";
import { CmsProvider } from "@/lib/cms-store";
import { organizationGraph } from "@/lib/schema";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    // Site-wide defaults only — no path-specific canonical / og:url (child routes set those).
    const gsc = siteSeo.gscVerification;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: `${siteSeo.name}, Nepal` },
        { property: "og:site_name", content: siteSeo.name },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(gsc ? [{ name: "google-site-verification", content: gsc }] : []),
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap",
        },
        { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "512x512" },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" },
        { rel: "apple-touch-icon", href: "/nepal-emblem.png", sizes: "512x512" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-NP">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <CmsProvider>
        <div className="flex min-h-screen flex-col">
          {!isAdmin && <JsonLd id="org-office-jsonld" data={organizationGraph()} />}
          {isAdmin ? <AdminBar /> : <SiteHeader />}
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          {!isAdmin && <SiteFooter />}
          {!isAdmin && <AccessibilityButton />}
          {!isAdmin && <Analytics />}
          <Toaster />
        </div>
      </CmsProvider>
    </QueryClientProvider>
  );
}

function AdminBar() {
  return (
    <header className="gov-header-pattern">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 text-primary-foreground md:px-8">
        <div className="leading-tight">
          <p className="text-xs">Government of Nepal</p>
          <p className="text-base font-semibold">Department of Foreign Employment — Admin Panel</p>
        </div>
        <Link to="/" className="rounded border border-primary-foreground/40 px-3 py-1.5 text-sm">
          View website
        </Link>
      </div>
    </header>
  );
}
