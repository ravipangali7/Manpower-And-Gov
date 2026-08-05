import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { SectionTitle } from "@/components/site/SectionTitle";
import { JsonLd } from "@/components/seo/JsonLd";
import { useSiteData } from "@/hooks/use-site-data";
import { publicApi } from "@/lib/public-api";
import { bodyLines, CmsPathLink, getBlock } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList, buildFaqPage } from "@/lib/schema";
import { ApiError } from "@/lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFormValues = {
  full_name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

function validateContactForm(values: ContactFormValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  if (!values.full_name) errors.full_name = "Full name is required.";
  if (!values.email) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.subject) errors.subject = "Subject is required.";
  return errors;
}

export const Route = createFileRoute("/contact")({
  loader: () => loadPageSeo("/contact"),
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Contact Vision & Value Overseas | Kathmandu, Nepal",
      description:
        "Contact VNVNEPAL in Basundhara, Kathmandu — phone, email and enquiry form for employers and job seekers.",
      path: "/contact",
      ogTitle: "Contact VNVNEPAL | Kathmandu, Nepal",
      ogDescription: "Talk to our recruitment team about hiring or working overseas.",
    }),
  component: ContactPage,
});

function ContactPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const { company, settings } = useSiteData();

  const { data, isSuccess, isError, refetch } = useQuery({
    queryKey: ["public", "contact"],
    queryFn: () => publicApi.contact(),
  });

  const phones =
    data?.contact_numbers?.length
      ? data.contact_numbers.map((c) => c.number).filter(Boolean)
      : company.phones;
  const email =
    (data?.site && "primary_email" in data.site && typeof data.site.primary_email === "string"
      ? data.site.primary_email
      : null) || company.email;
  const address =
    (data?.site && "address" in data.site && typeof data.site.address === "string"
      ? data.site.address
      : null) || company.address;
  const poBox =
    (data?.site && "po_box" in data.site && typeof data.site.po_box === "string"
      ? data.site.po_box
      : null) || company.poBox;
  const mapUrl =
    (data?.site && "map_embed_url" in data.site && typeof data.site.map_embed_url === "string"
      ? data.site.map_embed_url
      : null) ||
    settings?.map_embed_url ||
    "";

  const faqs = isSuccess
    ? (data?.faqs ?? []).map((f) => ({ q: f.question, a: f.answer }))
    : [];

  const offices = isSuccess ? data?.offices ?? [] : [];
  const help = getBlock(data?.content_blocks, "contact.help");
  const helpSteps = bodyLines(help?.body_2);

  const mutation = useMutation({
    mutationFn: (body: {
      full_name: string;
      email: string;
      subject: string;
      message?: string;
      phone?: string;
    }) => publicApi.forms.contact(body),
    onSuccess: () => {
      setSent(true);
      setFormError(null);
      setFieldErrors({});
      formRef.current?.reset();
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not send your message. Please try again.";
      setFormError(message);
      setSent(false);
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSent(false);

    const fd = new FormData(e.currentTarget);
    const values: ContactFormValues = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    const errors = validateContactForm(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    mutation.mutate(values);
  }

  const fieldClass = (name: keyof ContactFormValues) =>
    `mt-1.5 w-full border px-3 py-2.5 text-sm outline-none focus:border-brand-blue ${
      fieldErrors[name] ? "border-primary" : "border-input"
    }`;

  return (
    <SiteLayout partner={false}>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ])}
      />
      <JsonLd
        data={buildFaqPage(
          faqs.map((f) => ({
            question: f.q,
            answer: f.a,
          })),
        )}
      />
      <PageBanner title="Contact Us" crumb="Contact Us" />

      {isError && !data ? (
        <div className="mx-auto max-w-[1240px] px-5 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Some contact details could not be loaded.{" "}
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-semibold text-brand-blue underline underline-offset-2"
            >
              Retry
            </button>
          </p>
        </div>
      ) : null}

      <section className="py-16">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 md:grid-cols-3">
          {[
            { icon: Phone, title: "Contact Us", body: phones.join(", ") },
            { icon: Mail, title: "Email Us", body: email },
            {
              icon: MapPin,
              title: "Our Location",
              body: `${address} | ${poBox}`,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="relative mt-10 border border-border border-b-2 border-b-primary bg-white px-6 pb-8 pt-14 text-center"
            >
              <div className="absolute -top-9 left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center rounded-full bg-primary">
                <c.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-bold text-brand-blue">{c.title}</h2>
              <p className="mt-3 text-[13px] leading-6 text-primary">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="flex items-center justify-center px-5 py-14">
          <form
            ref={formRef}
            className="w-full max-w-[600px] space-y-5"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-[13px]" htmlFor="full_name">
                  Full Name *
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  required
                  maxLength={180}
                  autoComplete="name"
                  placeholder="Full Name"
                  aria-invalid={Boolean(fieldErrors.full_name)}
                  className={fieldClass("full_name")}
                />
                {fieldErrors.full_name ? (
                  <p className="mt-1 text-xs text-primary">{fieldErrors.full_name}</p>
                ) : null}
              </div>
              <div>
                <label className="text-[13px]" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  placeholder="Email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={fieldClass("email")}
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-xs text-primary">{fieldErrors.email}</p>
                ) : null}
              </div>
            </div>
            <div>
              <label className="text-[13px]" htmlFor="subject">
                Subject *
              </label>
              <input
                id="subject"
                name="subject"
                required
                maxLength={200}
                placeholder="Subject"
                aria-invalid={Boolean(fieldErrors.subject)}
                className={fieldClass("subject")}
              />
              {fieldErrors.subject ? (
                <p className="mt-1 text-xs text-primary">{fieldErrors.subject}</p>
              ) : null}
            </div>
            <div>
              <label className="text-[13px]" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={5000}
                placeholder="Message"
                className={fieldClass("message")}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {mutation.isPending ? "Sending…" : "Send Message"}
              </button>
              {sent && (
                <p className="mt-3 text-xs text-brand-blue" role="status">
                  Thank you — a member of the team will be in touch soon.
                </p>
              )}
              {formError && (
                <p className="mt-3 text-xs text-primary" role="alert">
                  {formError}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="bg-brand-blue px-8 py-16 text-white md:px-14">
          <p className="text-sm font-bold">{help?.subheading || "Contact Us"}</p>
          <h2 className="mt-2 text-3xl font-bold">{help?.heading || "How can we help?"}</h2>
          {help?.body ? (
            <p className="mt-4 max-w-md text-[14px] leading-6 text-white/90">{help.body}</p>
          ) : null}
          {helpSteps.length > 0 ? (
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-[13px] leading-6 text-white/90">
              {helpSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : null}
          {help?.cta_label && help?.cta_path ? (
            <CmsPathLink
              path={help.cta_path}
              className="mt-6 inline-block border border-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-brand-blue"
            >
              {help.cta_label}
            </CmsPathLink>
          ) : (
            <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
              <Link to="/online-registration" className="underline underline-offset-2 hover:text-white">
                Register online
              </Link>
              <Link to="/vacancies" className="underline underline-offset-2 hover:text-white">
                Current vacancies
              </Link>
              <Link to="/services" className="underline underline-offset-2 hover:text-white">
                Services
              </Link>
            </div>
          )}
          <div className="mt-10">
            {faqs.map((f, i) => (
              <div key={f.q} className="border-b border-white/30">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left text-lg font-bold"
                >
                  {f.q}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                    <Plus className="h-4 w-4 text-brand-blue" />
                  </span>
                </button>
                {open === i && <p className="pb-5 text-[13px] leading-6 text-white/90">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-section py-16">
        <div className="mx-auto max-w-[1240px] px-5">
          <SectionTitle>Office Near You</SectionTitle>
          <div className="mx-auto mt-10 grid max-w-[1000px] gap-6 md:grid-cols-2">
            {offices.map((o) => (
              <div key={o.id} className="border border-border bg-white p-7">
                <h3 className="text-xl font-bold text-brand-blue">{o.title}</h3>
                <p className="mt-4 text-[15px] font-semibold text-brand-blue">{o.office_name}</p>
                <p className="mt-3 text-[13px] text-muted-foreground">{o.address}</p>
                {o.email && <p className="mt-3 text-[13px] text-primary">{o.email}</p>}
                {o.phone && <p className="mt-2 text-[13px] text-primary">{o.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {mapUrl ? (
        <div className="h-[420px] w-full">
          <iframe
            title="Vision & Value Overseas office location"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          />
        </div>
      ) : null}
    </SiteLayout>
  );
}
