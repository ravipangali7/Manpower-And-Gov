import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Quote, Star, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionTitle } from "@/components/site/SectionTitle";
import { LogoCarousel } from "@/components/site/LogoCarousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  publicApi,
  type HeroSlide,
  type HomePageData,
  type HomeSections,
} from "@/lib/public-api";
import { ApiError } from "@/lib/api";
import { resolveCmsIcon } from "@/lib/cms-icons";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOMEPAGE_DEFINITION, HOMEPAGE_FAQS } from "@/config/seo";
import { buildFaqPage } from "@/lib/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HOME_SEO = {
  title: "VNVNEPAL | Ethical Manpower & Overseas Recruitment Agency Nepal",
  description:
    "Vision & Value Overseas Pvt. Ltd. is an ethical recruitment agency in Nepal, deploying skilled workers across Asia, the Middle East and Europe.",
  path: "/",
  ogTitle: "VNVNEPAL | Ethical Manpower Agency in Nepal",
} as const;

export const Route = createFileRoute("/")({
  loader: () => loadPageSeo("/"),
  head: ({ loaderData }) => seoFromCms(loaderData, HOME_SEO),
  component: HomePage,
});

function HomePage() {
  const homeQuery = useQuery({
    queryKey: ["public", "home"],
    queryFn: () => publicApi.home(),
  });
  const data = homeQuery.data;
  const ready = homeQuery.isSuccess;
  const sections = data?.sections;

  if (homeQuery.isError) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-[640px] px-5 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Unable to load content</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The site could not reach the CMS API. Make sure the Django backend is running, then refresh.
          </p>
          <button
            type="button"
            onClick={() => void homeQuery.refetch()}
            className="mt-6 bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Hero data={data} ready={ready} />
      <HomeIntro />
      <WhatWeDo ethic={data?.ethic} form={sections?.partnership_form} />
      <Motto
        steps={ready ? data?.motto ?? [] : undefined}
        heading={sections?.motto.heading}
        intro={sections?.motto.intro}
      />
      <Stats
        items={ready ? data?.stats ?? [] : undefined}
        backgroundUrl={sections?.stats.background_image_url}
      />
      <Expertise
        sectors={ready ? data?.expertise ?? [] : undefined}
        section={sections?.expertise}
      />
      <Testimonials
        items={ready ? data?.testimonials ?? [] : undefined}
        heading={sections?.testimonials.heading}
        backgroundUrl={sections?.testimonials.background_image_url}
      />
      <Membership
        items={ready ? data?.memberships ?? [] : undefined}
        heading={sections?.membership.heading}
      />
      <Clients
        items={ready ? data?.clients ?? [] : undefined}
        heading={sections?.clients.heading}
      />
      <HomeFaq />
    </SiteLayout>
  );
}

function HomeIntro() {
  return (
    <section className="border-b border-border bg-background py-12">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="sr-only">About Vision & Value Overseas</h2>
        <p className="max-w-4xl text-base leading-relaxed text-foreground md:text-lg">
          {HOMEPAGE_DEFINITION}
        </p>
        <p className="mt-4 text-sm text-muted-foreground md:text-base">
          Learn more about{" "}
          <Link to="/about" className="font-medium text-brand-blue underline-offset-2 hover:underline">
            our company
          </Link>
          ,{" "}
          <Link
            to="/ethical-recruitment"
            className="font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            ethical recruitment
          </Link>
          ,{" "}
          <Link
            to="/services"
            className="font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            overseas recruitment services
          </Link>
          , and current{" "}
          <Link
            to="/vacancies"
            className="font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            job vacancies
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function HomeFaq() {
  return (
    <section className="bg-section py-16" aria-labelledby="home-faq-heading">
      <JsonLd
        id="home-faq-jsonld"
        data={buildFaqPage(
          HOMEPAGE_FAQS.map((f) => ({ question: f.question, answer: f.answer })),
        )}
      />
      <div className="mx-auto max-w-[800px] px-5">
        <h2 id="home-faq-heading" className="text-2xl font-bold text-brand-blue">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-6">
          {HOMEPAGE_FAQS.map((faq, i) => (
            <AccordionItem key={faq.question} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Hero({ data, ready }: { data: HomePageData | undefined; ready: boolean }) {
  const slides: HeroSlide[] = useMemo(() => {
    if (!ready) return [];
    if (data?.hero_slides?.length) return data.hero_slides;
    if (data?.hero) return [data.hero];
    return [];
  }, [data, ready]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const slide = slides[active];
  const bg = slide?.background_image_url || "";
  const rating = Math.max(0, Math.min(5, Number(slide?.rating ?? 0) || 0));
  const filledStars = Math.round(rating);

  return (
    <section className="relative flex min-h-[620px] w-full items-center justify-center overflow-hidden bg-[oklch(0.28_0.04_240)] md:min-h-[680px] lg:min-h-[720px]">
      {bg ? (
        <img
          key={bg}
          src={bg}
          alt={slide?.title || ""}
          width={1920}
          height={900}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      ) : null}
      <div className="hero-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-[960px] flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:pt-32 md:px-8 md:pb-20 md:pt-36">
        {!ready ? (
          <p className="text-sm text-white/80">Loading…</p>
        ) : slide ? (
          <>
            {filledStars > 0 ? (
              <div className="flex items-center justify-center gap-1" aria-label={`${rating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
                      i < filledStars
                        ? "fill-[#f5a623] text-[#f5a623]"
                        : "fill-transparent text-white/40"
                    }`}
                  />
                ))}
              </div>
            ) : null}
            {slide.eyebrow ? (
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:text-xs">
                {slide.eyebrow}
              </p>
            ) : null}
            <h1 className="mt-2 text-balance text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            {slide.subtitle ? (
              <p className="mt-3 text-balance text-xl font-semibold text-white/95 md:text-2xl">
                {slide.subtitle}
              </p>
            ) : null}
            {slide.body ? (
              <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-white/95 md:text-[15px]">
                {slide.body}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {slide.cta_primary_label ? (
                <Link
                  to={slide.cta_primary_path || "/services"}
                  className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {slide.cta_primary_label}
                </Link>
              ) : null}
              {slide.cta_secondary_label ? (
                <Link
                  to={slide.cta_secondary_path || "/about"}
                  className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {slide.cta_secondary_label}
                </Link>
              ) : null}
            </div>
            {slides.length > 1 ? (
              <div className="mt-8 flex justify-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-2 w-2 rounded-full ${i === active ? "bg-primary" : "bg-white/70"}`}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-white/80">No hero slides published yet.</p>
        )}
      </div>
    </section>
  );
}

function WhatWeDo({
  ethic,
  form,
}: {
  ethic:
    | {
        eyebrow: string;
        heading: string;
        body: string;
        button_label: string;
        button_path: string;
      }
    | null
    | undefined;
  form: HomeSections["partnership_form"] | undefined;
}) {
  return (
    <section className="bg-section py-16">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:grid-cols-2">
        <div>
          {ethic?.eyebrow ? (
            <p className="text-sm text-brand-blue">{ethic.eyebrow}</p>
          ) : null}
          {ethic?.heading ? (
            <div className="mt-2 flex items-center gap-2">
              <svg width="16" height="12" viewBox="0 0 18 14" aria-hidden="true">
                <path d="M1 12 L9 1 L13 12 Z" fill="oklch(0.564 0.183 28.5)" />
              </svg>
              <h2 className="text-2xl font-bold text-brand-blue">{ethic.heading}</h2>
              <svg width="16" height="12" viewBox="0 0 18 14" aria-hidden="true">
                <path d="M5 2 L17 2 L11 13 Z" fill="oklch(0.55 0.13 244)" />
              </svg>
            </div>
          ) : null}
          {ethic?.body ? (
            <p className="mt-5 max-w-md text-[13px] leading-6 text-muted-foreground">{ethic.body}</p>
          ) : null}
          {ethic?.button_label ? (
            <Link
              to={ethic.button_path || "/ethical-recruitment"}
              className="mt-7 inline-block bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {ethic.button_label}
            </Link>
          ) : null}
        </div>

        <PartnershipForm form={form} />
      </div>
    </section>
  );
}

function PartnershipForm({ form }: { form: HomeSections["partnership_form"] | undefined }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    full_name: "",
    phone: "",
    email: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: () => publicApi.forms.partnership(values),
    onSuccess: () => {
      setSent(true);
      setError("");
      setValues({ full_name: "", phone: "", email: "", message: "" });
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Submission failed. Please try again.");
    },
  });

  const heading = form?.heading;
  const successMessage = form?.success_message;
  const submitLabel = form?.submit_label || "Submit";
  const sendingLabel = form?.sending_label || "Sending…";

  return (
    <div className="bg-white p-7 shadow-sm">
      {heading ? (
        <div className="flex items-center gap-2">
          <svg width="14" height="11" viewBox="0 0 18 14" aria-hidden="true">
            <path d="M1 12 L9 1 L13 12 Z" fill="oklch(0.564 0.183 28.5)" />
          </svg>
          <h3 className="text-lg font-bold text-brand-blue">{heading}</h3>
        </div>
      ) : null}
      {sent ? (
        <p className="mt-4 text-sm text-muted-foreground">{successMessage}</p>
      ) : (
        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          {(
            [
              ["full_name", form?.name_label || "Full name"],
              ["phone", form?.phone_label || "Phone"],
              ["email", form?.email_label || "Email"],
            ] as const
          ).map(([key, label]) => (
            <input
              key={key}
              required
              type={key === "email" ? "email" : "text"}
              placeholder={label}
              value={values[key]}
              onChange={(e) => setValues((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          ))}
          <textarea
            required
            placeholder={form?.message_label || "Message"}
            rows={4}
            value={values.message}
            onChange={(e) => setValues((f) => ({ ...f, message: e.target.value }))}
            className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
          >
            {mutation.isPending ? sendingLabel : submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}

function Motto({
  steps,
  heading,
  intro,
}: {
  steps:
    | {
        step_label: string;
        number: number;
        title: string;
        icon?: string;
        tone: string;
        order: number;
      }[]
    | undefined;
  heading?: string;
  intro?: string;
}) {
  const motto = useMemo(() => {
    if (!steps) return null;
    return steps.map((s) => ({
      step: s.step_label,
      number: String(s.number),
      label: s.title,
      tone: s.tone,
      icon: s.icon,
    }));
  }, [steps]);

  if (motto && !motto.length) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1240px] px-5">
        {heading ? <SectionTitle>{heading}</SectionTitle> : null}
        {intro ? (
          <p className="mx-auto mt-4 max-w-3xl text-center text-[13px] uppercase tracking-wide text-muted-foreground">
            {intro}
          </p>
        ) : null}

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
          {(motto ?? []).map((m, i) => {
            const red = m.tone === "red";
            const Icon = resolveCmsIcon(m.icon, i);
            return (
              <div key={`${m.label}-${i}`} className={`text-center ${i % 2 ? "sm:mt-16" : ""}`}>
                <p
                  className={`text-[11px] font-bold uppercase tracking-wide ${
                    red ? "text-primary" : "text-brand-blue"
                  }`}
                >
                  {i % 2 ? "" : m.step}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-5xl font-bold ${red ? "text-primary" : "text-brand-blue"}`}>
                    {m.number}
                  </span>
                  <div className="relative h-36 w-32">
                    <svg
                      viewBox="0 0 100 112"
                      className="absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      <polygon
                        points="50,3 96,29 96,83 50,109 4,83 4,29"
                        fill="none"
                        stroke={red ? "oklch(0.564 0.183 28.5)" : "oklch(0.55 0.13 244)"}
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Icon className={`h-8 w-8 ${red ? "text-primary" : "text-brand-blue"}`} />
                      <span
                        className={`mt-2 text-lg font-bold ${
                          red ? "text-primary" : "text-brand-blue"
                        }`}
                      >
                        {m.label}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  className={`mt-1 text-[11px] font-bold uppercase tracking-wide ${
                    red ? "text-primary" : "text-brand-blue"
                  }`}
                >
                  {i % 2 ? m.step : ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stats({
  items,
  backgroundUrl,
}: {
  items: { value: string; label: string; icon?: string }[] | undefined;
  backgroundUrl?: string | null;
}) {
  if (items && !items.length) return null;
  const stats = items ?? [];
  return (
    <section className="relative overflow-hidden bg-[oklch(0.45_0.03_200)] py-20">
      {backgroundUrl ? (
        <img
          src={backgroundUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={700}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-[oklch(0.45_0.03_200)]/70" />
      <div className="relative mx-auto max-w-[1100px] px-5">
        <div className="grid gap-10 text-center sm:grid-cols-3">
          {stats.map((s, i) => {
            const Icon = resolveCmsIcon(s.icon, i);
            return (
              <div key={`${s.label}-${i}`}>
                <Icon className="mx-auto h-9 w-9 text-white" />
                <p className="mt-4 text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm font-semibold text-white/90">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Expertise({
  sectors,
  section,
}: {
  sectors: { id: number; name: string; image_url?: string | null }[] | undefined;
  section: HomeSections["expertise"] | undefined;
}) {
  if (sectors && !sectors.length) return null;
  const expertise = sectors ?? [];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1240px] px-5">
        {section?.heading ? <SectionTitle>{section.heading}</SectionTitle> : null}
        {section?.intro ? (
          <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-6 text-muted-foreground">
            {section.intro}
          </p>
        ) : null}

        <div className="mx-auto mt-12 grid max-w-[1000px] grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
          {expertise.map((e) => (
            <div key={e.id} className="bg-white p-6">
              {e.image_url ? (
                <img
                  src={e.image_url}
                  alt={`${e.name} sector`}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red-soft">
                  <Users className="h-7 w-7 text-primary" />
                </div>
              )}
              <p className="mt-5 text-[13px] font-bold leading-snug text-foreground">{e.name}</p>
            </div>
          ))}
        </div>

        {section?.button_label ? (
          <div className="mt-10 text-center">
            <Link
              to={section.button_path || "/services"}
              className="inline-block bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {section.button_label}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Testimonials({
  items,
  heading,
  backgroundUrl,
}: {
  items:
    | { quote: string; author: string; brand: string; photo_url?: string | null }[]
    | undefined;
  heading?: string;
  backgroundUrl?: string | null;
}) {
  const testimonials = items ?? [];
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback((carousel: CarouselApi) => {
    if (!carousel) return;
    setActive(carousel.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || paused || testimonials.length < 2) return;
    const id = window.setInterval(() => {
      api.scrollNext();
    }, 4000);
    return () => window.clearInterval(id);
  }, [api, paused, testimonials.length]);

  if (items && !items.length) return null;
  if (!testimonials.length) return null;

  return (
    <section
      className="relative overflow-hidden bg-[oklch(0.22_0.02_240)] py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {backgroundUrl ? (
          <img
            src={backgroundUrl}
            alt=""
            width={1920}
            height={800}
            decoding="async"
            className="animate-testimonial-bg absolute inset-y-0 left-0 h-full w-[145%] max-w-none object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-[900px] px-5 text-center">
        {heading ? (
          <div className="[&_h2]:text-white">
            <SectionTitle>{heading}</SectionTitle>
          </div>
        ) : null}

        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: testimonials.length > 1,
            duration: 35,
            skipSnaps: false,
          }}
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-0">
            {testimonials.map((t, i) => (
              <CarouselItem key={`${t.author}-${i}`} className="basis-full pl-0">
                <div className="mx-auto flex max-w-[760px] flex-col items-center px-2">
                  {t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.author}
                      width={72}
                      height={72}
                      loading="lazy"
                      className="mb-5 h-[72px] w-[72px] rounded-full object-cover ring-2 ring-white/40"
                    />
                  ) : null}
                  {t.brand ? (
                    <p className="font-serif text-2xl italic text-white">{t.brand}</p>
                  ) : null}
                  <div className="relative mt-6 w-full">
                    <Quote className="absolute -left-1 -top-1 h-7 w-7 rotate-180 text-white/55 sm:-left-2 sm:-top-2 sm:h-8 sm:w-8" />
                    <p className="px-6 text-[13px] leading-7 text-white sm:px-10 md:text-sm md:leading-8">
                      &quot;{t.quote}&quot;
                    </p>
                    <Quote className="absolute -bottom-3 right-0 h-7 w-7 text-white/55 sm:-bottom-4 sm:h-8 sm:w-8" />
                  </div>
                  <p className="mt-8 text-sm font-bold text-white">– {t.author}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {testimonials.length > 1 ? (
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Testimonial ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === active ? "bg-primary" : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Membership({
  items,
  heading,
}: {
  items: { id: number; title: string; logo_url?: string | null; url?: string }[] | undefined;
  heading?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1240px] px-5">
        {heading ? (
          <div className="flex items-center justify-center gap-3">
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              <path d="M1 12 L9 1 L13 12 Z" fill="oklch(0.564 0.183 28.5)" />
            </svg>
            <h2 className="bg-brand-red px-5 py-2 text-xl font-bold tracking-wide text-white md:text-2xl">
              {heading}
            </h2>
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              <path d="M5 2 L17 2 L11 13 Z" fill="oklch(0.55 0.13 244)" />
            </svg>
          </div>
        ) : null}
        <div className="mt-12">
          <LogoCarousel
            items={items.map((m) => ({
              id: m.id,
              label: m.title,
              logo_url: m.logo_url,
              url: m.url,
            }))}
            itemBasis="basis-1/2 md:basis-1/3"
            imageClassName="max-h-20 max-w-[180px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function Clients({
  items,
  heading,
}: {
  items: { id: number; name: string; logo_url?: string | null; url?: string }[] | undefined;
  heading?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="bg-section py-20">
      <div className="mx-auto max-w-[1240px] px-5">
        {heading ? <SectionTitle>{heading}</SectionTitle> : null}
        <div className="mt-12">
          <LogoCarousel
            items={items.map((c) => ({
              id: c.id,
              label: c.name,
              logo_url: c.logo_url,
              url: c.url,
            }))}
            itemBasis="basis-1/2 sm:basis-1/3 lg:basis-1/6"
            cellClassName="border border-border"
            imageClassName="max-h-14 max-w-[140px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
