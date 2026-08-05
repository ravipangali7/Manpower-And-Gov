import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, type SiteSettings } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";
import { invalidatePublicQueries } from "@/lib/public-cache";

export const Route = createFileRoute("/admin/site-settings")({
  ssr: false,
  component: AdminSiteSettingsPage,
});

type TextFields = Omit<
  SiteSettings,
  | "id"
  | "updated_at"
  | "logo_url"
  | "favicon_url"
  | "og_image_url"
  | "stats_background_url"
  | "testimonials_background_url"
>;

const empty: TextFields = {
  company_name: "",
  short_name: "",
  address: "",
  primary_email: "",
  po_box: "",
  notice_text: "",
  tagline: "",
  map_embed_url: "",
  business_hours: "",
  cv_download_url: "",
  license_number: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  partner_cta_heading: "Partner With Us",
  partner_cta_body: "",
  partner_cta_button_label: "Contact Us",
  partner_cta_button_path: "/contact",
  hiring_enabled: true,
  hiring_heading: "WE ARE HIRING!",
  hiring_subheading: "Open Positions",
  hiring_button_label: "APPLY NOW",
  hiring_button_path: "/online-registration",
  ethic_heading: "Ethical Recruitment",
  ethic_eyebrow: "What we do",
  ethic_body: "",
  ethic_button_label: "Learn More",
  ethic_button_path: "/ethical-recruitment",
  motto_heading: "Our Motto",
  motto_intro: "",
  expertise_heading: "Our Expertise",
  expertise_intro: "",
  expertise_button_label: "Learn More",
  expertise_button_path: "/services",
  testimonials_heading: "Testimonial",
  membership_heading: "Membership",
  clients_heading: "PROUD TO WORK WITH",
  partnership_form_heading: "Partner With Us",
  partnership_form_success: "Thank you — we received your message and will reply shortly.",
  partnership_form_submit_label: "Submit",
  partnership_form_sending_label: "Sending…",
  partnership_form_name_label: "Full name",
  partnership_form_phone_label: "Phone",
  partnership_form_email_label: "Email",
  partnership_form_message_label: "Message",
};

type MediaKey = "logo" | "favicon" | "og_image" | "stats_background" | "testimonials_background";

const MEDIA_FIELDS: {
  key: MediaKey;
  urlKey: keyof SiteSettings;
  label: string;
}[] = [
  { key: "logo", urlKey: "logo_url", label: "Logo" },
  { key: "favicon", urlKey: "favicon_url", label: "Favicon" },
  { key: "og_image", urlKey: "og_image_url", label: "OG image" },
  { key: "stats_background", urlKey: "stats_background_url", label: "Stats background" },
  {
    key: "testimonials_background",
    urlKey: "testimonials_background_url",
    label: "Testimonials background",
  },
];

function AdminSiteSettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: () => adminApi.siteSettings.get(),
  });
  const [form, setForm] = useState<TextFields>(empty);
  const [files, setFiles] = useState<Partial<Record<MediaKey, File | null>>>({});
  const [clearFlags, setClearFlags] = useState<Partial<Record<MediaKey, boolean>>>({});

  useEffect(() => {
    if (!data) return;
    setForm({
      company_name: data.company_name,
      short_name: data.short_name || "",
      address: data.address,
      primary_email: data.primary_email,
      po_box: data.po_box || "",
      notice_text: data.notice_text || "",
      tagline: data.tagline || "",
      map_embed_url: data.map_embed_url || "",
      business_hours: data.business_hours || "",
      cv_download_url: data.cv_download_url || "",
      license_number: data.license_number || "",
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      meta_keywords: data.meta_keywords || "",
      partner_cta_heading: data.partner_cta_heading || "Partner With Us",
      partner_cta_body: data.partner_cta_body || "",
      partner_cta_button_label: data.partner_cta_button_label || "Contact Us",
      partner_cta_button_path: data.partner_cta_button_path || "/contact",
      hiring_enabled: data.hiring_enabled !== false,
      hiring_heading: data.hiring_heading || "WE ARE HIRING!",
      hiring_subheading: data.hiring_subheading || "Open Positions",
      hiring_button_label: data.hiring_button_label || "APPLY NOW",
      hiring_button_path: data.hiring_button_path || "/online-registration",
      ethic_heading: data.ethic_heading || "Ethical Recruitment",
      ethic_eyebrow: data.ethic_eyebrow || "What we do",
      ethic_body: data.ethic_body || "",
      ethic_button_label: data.ethic_button_label || "Learn More",
      ethic_button_path: data.ethic_button_path || "/ethical-recruitment",
      motto_heading: data.motto_heading || "Our Motto",
      motto_intro: data.motto_intro || "",
      expertise_heading: data.expertise_heading || "Our Expertise",
      expertise_intro: data.expertise_intro || "",
      expertise_button_label: data.expertise_button_label || "Learn More",
      expertise_button_path: data.expertise_button_path || "/services",
      testimonials_heading: data.testimonials_heading || "Testimonial",
      membership_heading: data.membership_heading || "Membership",
      clients_heading: data.clients_heading || "PROUD TO WORK WITH",
      partnership_form_heading: data.partnership_form_heading || "Partner With Us",
      partnership_form_success:
        data.partnership_form_success ||
        "Thank you — we received your message and will reply shortly.",
      partnership_form_submit_label: data.partnership_form_submit_label || "Submit",
      partnership_form_sending_label: data.partnership_form_sending_label || "Sending…",
      partnership_form_name_label: data.partnership_form_name_label || "Full name",
      partnership_form_phone_label: data.partnership_form_phone_label || "Phone",
      partnership_form_email_label: data.partnership_form_email_label || "Email",
      partnership_form_message_label: data.partnership_form_message_label || "Message",
    });
    setFiles({});
    setClearFlags({});
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const hasFiles = MEDIA_FIELDS.some((m) => files[m.key] || clearFlags[m.key]);
      if (hasFiles) {
        const fd = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (typeof value === "boolean") {
            fd.append(key, value ? "true" : "false");
          } else {
            fd.append(key, value == null ? "" : String(value));
          }
        });
        for (const m of MEDIA_FIELDS) {
          const file = files[m.key];
          if (file) {
            fd.append(m.key, file);
          } else if (clearFlags[m.key]) {
            fd.append(m.key, "");
          }
        }
        return adminApi.siteSettings.update(fd, !data?.id);
      }
      return adminApi.siteSettings.update(form, !data?.id);
    },
    onSuccess: () => {
      toast.success("Site settings saved");
      void qc.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) {
    return <p className="text-sm text-destructive">Could not load site settings.</p>;
  }

  function textField(key: keyof TextFields, label: string, multiline = false) {
    const value = form[key];
    return (
      <div className="space-y-1.5" key={key}>
        <Label htmlFor={key}>{label}</Label>
        {multiline ? (
          <Textarea
            id={key}
            rows={3}
            value={String(value ?? "")}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          />
        ) : (
          <Input
            id={key}
            value={String(value ?? "")}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Site settings</h1>
        <p className="text-sm text-muted-foreground">
          Company, SEO, branding, partner CTA, hiring widget and home sections — all editable
          without code.
        </p>
      </div>
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Company
          </h2>
          {textField("company_name", "Company name")}
          {textField("short_name", "Short name")}
          {textField("tagline", "Tagline")}
          {textField("address", "Address")}
          {textField("primary_email", "Primary email")}
          {textField("po_box", "PO box")}
          {textField("license_number", "License number")}
          {textField("business_hours", "Business hours")}
          {textField("map_embed_url", "Map embed URL")}
          {textField("cv_download_url", "CV download URL")}
          {textField("notice_text", "Notice text", true)}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Branding & media
          </h2>
          {MEDIA_FIELDS.map((m) => {
            const currentUrl = data?.[m.urlKey] as string | null | undefined;
            return (
              <div className="space-y-2" key={m.key}>
                <Label htmlFor={m.key}>{m.label}</Label>
                {currentUrl && !clearFlags[m.key] && !files[m.key] ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUrl}
                      alt={m.label}
                      className="h-12 max-w-[160px] object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setClearFlags((c) => ({ ...c, [m.key]: true }));
                        setFiles((f) => ({ ...f, [m.key]: null }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : null}
                <Input
                  id={m.key}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setFiles((f) => ({ ...f, [m.key]: file }));
                    if (file) setClearFlags((c) => ({ ...c, [m.key]: false }));
                  }}
                />
              </div>
            );
          })}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Default SEO
          </h2>
          {textField("meta_title", "Meta title")}
          {textField("meta_description", "Meta description", true)}
          {textField("meta_keywords", "Meta keywords")}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Home ethic block
          </h2>
          {textField("ethic_eyebrow", "Eyebrow")}
          {textField("ethic_heading", "Heading")}
          {textField("ethic_body", "Body", true)}
          {textField("ethic_button_label", "Button label")}
          {textField("ethic_button_path", "Button path")}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Home section titles & copy
          </h2>
          {textField("motto_heading", "Motto heading")}
          {textField("motto_intro", "Motto intro", true)}
          {textField("expertise_heading", "Expertise heading")}
          {textField("expertise_intro", "Expertise intro", true)}
          {textField("expertise_button_label", "Expertise button label")}
          {textField("expertise_button_path", "Expertise button path")}
          {textField("testimonials_heading", "Testimonials heading")}
          {textField("membership_heading", "Membership heading")}
          {textField("clients_heading", "Clients heading")}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Home partnership form
          </h2>
          {textField("partnership_form_heading", "Form heading")}
          {textField("partnership_form_success", "Success message", true)}
          {textField("partnership_form_submit_label", "Submit label")}
          {textField("partnership_form_sending_label", "Sending label")}
          {textField("partnership_form_name_label", "Name field label")}
          {textField("partnership_form_phone_label", "Phone field label")}
          {textField("partnership_form_email_label", "Email field label")}
          {textField("partnership_form_message_label", "Message field label")}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Partner CTA
          </h2>
          {textField("partner_cta_heading", "Heading")}
          {textField("partner_cta_body", "Body", true)}
          {textField("partner_cta_button_label", "Button label")}
          {textField("partner_cta_button_path", "Button path")}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Hiring widget
          </h2>
          <div className="flex items-center justify-between">
            <Label>Enabled</Label>
            <Switch
              checked={form.hiring_enabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, hiring_enabled: v }))}
            />
          </div>
          {textField("hiring_heading", "Heading")}
          {textField("hiring_subheading", "Subheading")}
          {textField("hiring_button_label", "Button label")}
          {textField("hiring_button_path", "Button path")}
        </section>

        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
