import { api } from "./api";

export type SiteSettings = {
  id: number;
  company_name: string;
  short_name: string;
  address: string;
  primary_email: string;
  po_box: string;
  notice_text: string;
  tagline: string;
  map_embed_url: string;
  business_hours: string;
  cv_download_url: string;
  license_number: string;
  logo_url: string | null;
  favicon_url: string | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image_url: string | null;
  partner_cta_heading: string;
  partner_cta_body: string;
  partner_cta_button_label: string;
  partner_cta_button_path: string;
  hiring_enabled: boolean;
  hiring_heading: string;
  hiring_subheading: string;
  hiring_button_label: string;
  hiring_button_path: string;
  ethic_heading: string;
  ethic_eyebrow: string;
  ethic_body: string;
  ethic_button_label: string;
  ethic_button_path: string;
  motto_heading?: string;
  motto_intro?: string;
  expertise_heading?: string;
  expertise_intro?: string;
  expertise_button_label?: string;
  expertise_button_path?: string;
  testimonials_heading?: string;
  membership_heading?: string;
  clients_heading?: string;
  stats_background_url?: string | null;
  testimonials_background_url?: string | null;
  partnership_form_heading?: string;
  partnership_form_success?: string;
  partnership_form_submit_label?: string;
  partnership_form_sending_label?: string;
  partnership_form_name_label?: string;
  partnership_form_phone_label?: string;
  partnership_form_email_label?: string;
  partnership_form_message_label?: string;
  contact_numbers: { id: number; label: string; number: string; order: number }[];
  offices: {
    id: number;
    title: string;
    office_name: string;
    address: string;
    email: string;
    phone: string;
    order: number;
  }[];
  social_links: SocialLink[];
  career_openings: CareerOpening[];
};

export type SocialLink = {
  id: number;
  platform: string;
  label: string;
  url: string;
  order: number;
};

export type CareerOpening = {
  id: number;
  title: string;
  description: string;
  apply_path: string;
  order: number;
};

export type NavChild = {
  id: number;
  label: string;
  path: string;
  order: number;
  open_in_new_tab?: boolean;
};

export type NavLink = NavChild & {
  children?: NavChild[];
};

export type NavigationData = {
  navigation: NavLink[];
  footer_links: { id: number; label: string; path: string; order: number }[];
  quick_links: { id: number; label: string; path: string; order: number }[];
  social_links: SocialLink[];
  cms_pages: { title: string; slug: string; order: number }[];
};

export type HeroSlide = {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  background_image_url: string | null;
  cta_primary_label: string;
  cta_primary_path: string;
  cta_secondary_label: string;
  cta_secondary_path: string;
  rating: string;
};

export type HomeSections = {
  motto: { heading: string; intro: string };
  expertise: {
    heading: string;
    intro: string;
    button_label: string;
    button_path: string;
  };
  testimonials: { heading: string; background_image_url: string | null };
  membership: { heading: string };
  clients: { heading: string };
  stats: { background_image_url: string | null };
  partnership_form: {
    heading: string;
    success_message: string;
    submit_label: string;
    sending_label: string;
    name_label: string;
    phone_label: string;
    email_label: string;
    message_label: string;
  };
};

export type HomePageData = {
  hero_slides: HeroSlide[];
  hero: HeroSlide | null;
  ethic: {
    eyebrow: string;
    heading: string;
    body: string;
    button_label: string;
    button_path: string;
  } | null;
  sections?: HomeSections;
  motto: {
    id: number;
    step_label: string;
    number: number;
    title: string;
    icon: string;
    tone: string;
    order: number;
  }[];
  stats: { id: number; value: string; label: string; icon?: string; order: number }[];
  expertise: { id: number; name: string; description: string; image_url?: string | null }[];
  testimonials: {
    id: number;
    quote: string;
    author: string;
    brand: string;
    photo_url?: string | null;
    order: number;
  }[];
  memberships: { id: number; title: string; logo_url?: string | null; url?: string; order: number }[];
  clients: { id: number; name: string; logo_url?: string | null; url?: string; order: number }[];
};

export type ContentBlock = {
  id: number;
  key: string;
  page: string;
  label: string;
  heading: string;
  subheading: string;
  body: string;
  body_2: string;
  body_3: string;
  image_url?: string | null;
  video_url?: string;
  cta_label?: string;
  cta_path?: string;
  order: number;
};

export type AboutPageData = {
  why_choose_us: { id: number; number: string; title: string; body: string; order: number }[];
  accordion: { id: number; title: string; body: string; order: number }[];
  content_blocks?: ContentBlock[];
};

export type ServiceSector = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image_url?: string | null;
  is_featured?: boolean;
  order: number;
};

export type ServicesPageData = {
  sectors: ServiceSector[];
  recruitment_steps: { id: number; title: string; body: string; order: number }[];
  content_blocks?: ContentBlock[];
};

export type EthicalRecruitmentPageData = {
  page_title: string;
  content_blocks: ContentBlock[];
  comparison: {
    heading: string;
    icon: string;
    intro: string;
    left_header: string;
    right_header: string;
    rows: { left: string; right: string }[];
  } | null;
};

export type VacanciesData = {
  jobs: {
    id: number;
    title: string;
    company: string;
    sector: string;
    country: string;
    vacancies: number;
    salary: string;
    description: string;
    requirements?: string;
    deadline?: string | null;
    is_featured?: boolean;
  }[];
  job_sectors: { id: number; name: string; slug?: string; count: number }[];
  job_countries: { id: number; name: string; count: number }[];
  content_blocks?: ContentBlock[];
};

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  cover_image_url?: string | null;
  published_at: string | null;
  meta_title?: string;
  meta_description?: string;
};

export type ContactPageData = {
  site: SiteSettings | Record<string, unknown>;
  contact_numbers: { id: number; label: string; number: string; order: number }[];
  offices: {
    id: number;
    title: string;
    office_name: string;
    address: string;
    email: string;
    phone: string;
    order: number;
  }[];
  faqs: { id: number; question: string; answer: string; order: number }[];
  content_blocks?: ContentBlock[];
};

export type DemandItem = {
  id: number;
  title: string;
  employer: string;
  country_name: string | null;
  sector_name: string | null;
  positions: number;
  description: string;
  document_url: string | null;
  published_at: string | null;
};

export type GalleryData = {
  albums: {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_url: string | null;
    images: {
      id: number;
      title: string;
      image_url: string | null;
      caption: string;
    }[];
  }[];
  images: {
    id: number;
    title: string;
    image_url: string | null;
    caption: string;
  }[];
};

export type CMSPage = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  banner_image_url: string | null;
  meta_title: string;
  meta_description: string;
};

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  og_image_url?: string | null;
  source?: string;
};

export const publicApi = {
  siteSettings: () => api<SiteSettings>("/site-settings/", { auth: false }),
  navigation: () => api<NavigationData>("/navigation/", { auth: false }),
  seo: (path: string) =>
    api<PageSeo>(`/seo/?path=${encodeURIComponent(path)}`, { auth: false }),
  home: () => api<HomePageData>("/pages/home/", { auth: false }),
  about: () => api<AboutPageData>("/pages/about/", { auth: false }),
  services: () => api<ServicesPageData>("/pages/services/", { auth: false }),
  ethicalRecruitment: () =>
    api<EthicalRecruitmentPageData>("/pages/ethical-recruitment/", { auth: false }),
  contact: () => api<ContactPageData>("/pages/contact/", { auth: false }),
  awards: () =>
    api<{
      certificates: {
        id: number;
        title: string;
        tag: string;
        image_url?: string | null;
        document_url?: string | null;
      }[];
      content_blocks?: ContentBlock[];
    }>("/pages/awards/", { auth: false }),
  gallery: () => api<GalleryData>("/pages/gallery/", { auth: false }),
  careers: () => api<{ openings: CareerOpening[] }>("/pages/careers/", { auth: false }),
  vacancies: (params?: { sector?: string; country?: string; sort?: string }) => {
    const q = new URLSearchParams();
    if (params?.sector) q.set("sector", params.sector);
    if (params?.country) q.set("country", params.country);
    if (params?.sort) q.set("sort", params.sort);
    const qs = q.toString();
    return api<VacanciesData>(`/vacancies/${qs ? `?${qs}` : ""}`, { auth: false });
  },
  demands: () =>
    api<{ demands: DemandItem[]; content_blocks?: ContentBlock[] }>("/demands/", { auth: false }),
  news: {
    list: () => api<NewsItem[]>("/news/", { auth: false }),
    get: (slug: string) => api<NewsItem>(`/news/${slug}/`, { auth: false }),
  },
  cms: {
    list: () => api<CMSPage[]>("/cms-pages/", { auth: false }),
    get: (slug: string) => api<CMSPage>(`/cms-pages/${slug}/`, { auth: false }),
  },
  forms: {
    contact: (body: {
      full_name: string;
      email: string;
      subject: string;
      message?: string;
      phone?: string;
    }) => api("/forms/contact/", { method: "POST", body, auth: false }),
    partnership: (body: {
      full_name: string;
      email: string;
      phone: string;
      message: string;
    }) => api("/forms/partnership/", { method: "POST", body, auth: false }),
    registration: async (body: Record<string, string>, cvFile?: File | null) => {
      if (cvFile) {
        const fd = new FormData();
        Object.entries(body).forEach(([k, v]) => fd.append(k, v));
        fd.append("cv_file", cvFile);
        const API_BASE =
          (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "/api";
        const res = await fetch(`${API_BASE}/forms/registration/`, {
          method: "POST",
          body: fd,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { detail?: string }).detail || "Registration failed");
        }
        return res.json();
      }
      return api("/forms/registration/", { method: "POST", body, auth: false });
    },
  },
};
