import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { useSiteData } from "@/hooks/use-site-data";

const socialIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
};

function SmartLink({
  path,
  className,
  children,
}: {
  path: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (path.startsWith("http")) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={path} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  const { company, settings, navigation } = useSiteData();
  const quickLinks =
    navigation?.quick_links?.map((l) => ({ label: l.label, path: l.path })) ?? [];
  const footerLinks =
    navigation?.footer_links?.map((l) => ({ label: l.label, path: l.path })) ?? [];
  const socials = settings?.social_links?.length
    ? settings.social_links
    : navigation?.social_links || [];
  const openings = settings?.career_openings || [];
  const hiringEnabled = settings?.hiring_enabled !== false;

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">Nepal Office</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <MapPin className="h-4 w-4" /> Address
                </p>
                <p className="mt-1 text-white/85">{company.address}</p>
                {settings?.license_number && (
                  <p className="mt-1 text-xs text-white/70">{settings.license_number}</p>
                )}
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <Phone className="h-4 w-4" /> Phone
                </p>
                <p className="mt-1 text-white/85">{company.phones.join(" ")}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <Mail className="h-4 w-4" /> Email
                </p>
                <p className="mt-1 text-white/85">{company.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="mt-5 space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <SmartLink
                    path={l.path}
                    className="text-white/85 transition-colors hover:text-white"
                  >
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {hiringEnabled && (
              <div className="max-w-[320px] bg-white p-2 text-foreground shadow">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <div className="flex h-8 w-12 items-center justify-center border border-border text-[9px] font-bold text-brand-blue">
                    V&amp;V
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">{company.short || "Vision & Value"}</p>
                    <span className="mt-1 inline-block bg-brand-blue px-2 py-0.5 text-[10px] font-semibold text-white">
                      Follow Page
                    </span>
                  </div>
                </div>
                <div className="mt-2 bg-white p-4">
                  <p className="text-[10px] font-bold tracking-widest text-brand-blue">
                    {company.name.toUpperCase()}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold leading-none text-brand-blue whitespace-pre-line">
                    {settings?.hiring_heading || "WE ARE\nHIRING!"}
                  </p>
                  <p className="mt-3 text-[10px] font-bold uppercase text-primary">
                    {settings?.hiring_subheading || "Open Positions"}
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[10px] text-muted-foreground">
                    {openings.map((o) => (
                      <li key={o.id}>{o.title}</li>
                    ))}
                  </ul>
                  <SmartLink
                    path={settings?.hiring_button_path || "/online-registration"}
                    className="mt-3 inline-block bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground"
                  >
                    {settings?.hiring_button_label || "APPLY NOW"}
                  </SmartLink>
                  <p className="mt-2 text-[9px] text-muted-foreground">
                    Send your CV to career@vnvnepal.com
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex justify-center gap-3">
            {socials.map((s, i) => {
              const Icon = socialIcons[s.platform] || Facebook;
              return (
                <a
                  key={s.id || i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${
                    i === 2 ? "bg-primary" : i === 3 ? "bg-primary/80" : "bg-brand-blue-light"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/85">
            {footerLinks.map((l) => (
              <li key={l.label}>
                <SmartLink path={l.path} className="transition-colors hover:text-white">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-footer-deep">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5 text-xs text-white/80 md:flex-row md:items-center md:justify-between">
          <p className="max-w-lg">
            {company.name} (An Ethical and Fair Recruitment Agency in Nepal) © 2026. All Rights
            Reserved
          </p>
          <p>copyright @ 2024 {company.short || "VNVNEPAL"}</p>
        </div>
      </div>
    </footer>
  );
}
