import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useSiteData } from "@/hooks/use-site-data";

const navLinkClass =
  "inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap px-1.5 py-2 text-[11px] font-semibold uppercase tracking-[-0.3px] text-white transition-colors hover:text-white/80 2xl:gap-1 2xl:px-2.5 2xl:text-[12px]";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className={navLinkClass}>
      {label}
    </Link>
  );
}

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div className="group relative shrink-0">
      <button type="button" className={navLinkClass} aria-haspopup="true">
        {label}
        <ChevronDown className="h-3 w-3 shrink-0 opacity-90" strokeWidth={2.5} />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[220px] translate-y-1 border-t-2 border-primary bg-white opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {items.map((i) => (
          <Link
            key={i.label}
            to={i.to}
            className="block border-b border-border px-4 py-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const { notice, navigation } = useSiteData();

  const items = useMemo(() => {
    return (navigation?.navigation ?? []).map((n) => ({
      label: n.label,
      to: n.path,
      children: (n.children || []).map((c) => ({ label: c.label, to: c.path })),
    }));
  }, [navigation]);

  const mobileLinks = useMemo(() => {
    const flat: { label: string; to: string }[] = [];
    for (const item of items) {
      flat.push({ label: item.label, to: item.to });
      for (const child of item.children) {
        flat.push({ label: `— ${child.label}`, to: child.to });
      }
    }
    return flat;
  }, [items]);

  return (
    <>
      {showNotice && notice && (
        <div className="relative z-50 flex h-8 items-center overflow-hidden bg-white">
          <p className="animate-[marquee_28s_linear_infinite] whitespace-nowrap px-4 pr-10 text-xs text-primary">
            <span className="font-bold">NOTICE:</span> {notice.replace(/^NOTICE:\s*/i, "")}
          </p>
          <button
            aria-label="Close notice"
            onClick={() => setShowNotice(false)}
            className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="absolute left-0 right-0 z-40 w-full overflow-visible bg-transparent">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[1fr_auto] items-center gap-3 px-3 py-3 sm:px-5 md:gap-4 md:px-6 md:py-4 xl:grid-cols-[1fr_auto_1fr]">
          <Link
            to="/"
            aria-label="Vision and Value Overseas home"
            className="relative z-10 justify-self-start shrink-0"
          >
            <Logo className="h-12 sm:h-14 md:h-[60px] xl:h-16" height={64} />
          </Link>

          {/* Desktop nav — centered across the header */}
          <nav
            className="hidden min-w-0 items-center justify-center xl:flex"
            aria-label="Main navigation"
          >
            <ul className="m-0 flex list-none flex-nowrap items-center justify-center p-0">
              {items.map((item) =>
                item.children.length > 0 ? (
                  <li key={item.label}>
                    <Dropdown label={item.label} items={item.children} />
                  </li>
                ) : (
                  <li key={item.label}>
                    <NavItem to={item.to} label={item.label} />
                  </li>
                ),
              )}
            </ul>
          </nav>

          <button
            type="button"
            className="relative z-10 justify-self-end shrink-0 p-1 text-white xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {open && (
          <div className="max-h-[min(70vh,560px)] overflow-y-auto border-t border-white/10 bg-[#212529] xl:hidden">
            <nav aria-label="Mobile navigation">
              {mobileLinks.map((l) => (
                <Link
                  key={`${l.label}-${l.to}`}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[-0.5px] text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
