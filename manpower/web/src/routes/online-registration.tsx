import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { buildPageMeta } from "@/lib/seo";
import { buildBreadcrumbList } from "@/lib/schema";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/online-registration")({
  head: () =>
    buildPageMeta({
      title: "Online Registration | Apply with VNVNEPAL",
      description:
        "Register online with Vision & Value Overseas to apply for overseas jobs. No recruitment fee, our representative will contact you.",
      path: "/online-registration",
      ogTitle: "Online Registration | VNVNEPAL",
    }),
  component: RegistrationPage,
});

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[13px]" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-input px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
      />
    </div>
  );
}

function RegistrationPage() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ body, cv }: { body: Record<string, string>; cv?: File | null }) =>
      publicApi.forms.registration(body, cv),
    onSuccess: () => {
      setSent(true);
      setFormError(null);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";
      setFormError(message);
      setSent(false);
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const cv = fd.get("cv_file");
    const body: Record<string, string> = {
      first_name: String(fd.get("first_name") || "").trim(),
      last_name: String(fd.get("last_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      contact_number: String(fd.get("contact_number") || "").trim(),
      permanent_address: String(fd.get("permanent_address") || "").trim(),
      temporary_address: String(fd.get("temporary_address") || "").trim(),
      position: String(fd.get("position") || "").trim(),
      preferred_country: String(fd.get("preferred_country") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };
    mutation.mutate({
      body,
      cv: cv instanceof File && cv.size > 0 ? cv : null,
    });
  }

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Online Registration", path: "/online-registration" },
        ])}
      />
      <PageBanner title="Online Registration" crumb="Online Registration" />

      <section className="py-16">
        <div className="mx-auto max-w-[920px] px-5">
          <h2 className="text-center text-3xl font-bold text-brand-blue">Rest assured!!!</h2>
          <p className="mt-3 text-center text-xl font-bold text-foreground">
            Our representative will contact you in due time.
          </p>

          <form className="mt-12 space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="First Name *" name="first_name" placeholder="First Name" />
              <Field label="Last Name *" name="last_name" placeholder="Last Name" />
              <Field label="Email Address *" name="email" placeholder="Email" type="email" />
              <Field label="Contact Number *" name="contact_number" placeholder="Contact Number" />
              <Field
                label="Permanent Address *"
                name="permanent_address"
                placeholder="Permanent Address"
              />
              <Field
                label="Temporary Address *"
                name="temporary_address"
                placeholder="Temporary Address"
                required={false}
              />
              <Field
                label="Job Applying For (Position) *"
                name="position"
                placeholder="Position"
              />
              <Field
                label="Country Applying For *"
                name="preferred_country"
                placeholder="Country"
              />
            </div>
            <div>
              <label className="text-[13px]" htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Message"
                className="mt-1.5 w-full border border-input px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="text-[13px]" htmlFor="cv_file">
                CV / Resume (optional)
              </label>
              <input
                id="cv_file"
                name="cv_file"
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                className="mt-1.5 w-full text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-brand-blue px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? "Submitting…" : "Submit Your Info"}
            </button>
            {sent && (
              <p className="text-xs text-brand-blue">
                Registration received — our representative will contact you in due time.
              </p>
            )}
            {formError && <p className="text-xs text-primary">{formError}</p>}
          </form>

          <p className="mt-10 text-[15px] leading-7 text-foreground">
            You can also download the CV format by clicking the button below and visit the premises
            of Vision &amp; Value from Sunday to Friday between 9:30 AM and 5:30 PM with your CV. We
            are closed on Saturdays. We may open on some public holidays, however, do give us a call
            before a visit.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-block bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request CV format
          </Link>

          <p className="mt-6 text-[15px] text-foreground">
            For more information on the Recruitment Services.{" "}
            <Link to="/services/overseas-recruitment" className="text-primary">
              Click Here
            </Link>
            . Browse{" "}
            <Link to="/vacancies" className="text-primary">
              available openings
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-primary">
              contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
