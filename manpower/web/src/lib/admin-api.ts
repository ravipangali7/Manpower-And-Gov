import { api } from "./api";
import type { AdminUser } from "./auth";
import { clearTokens, setTokens } from "./auth";

export type LoginResponse = {
  access: string;
  refresh: string;
  user: AdminUser;
};

export async function login(username: string, password: string): Promise<LoginResponse> {
  const data = await api<LoginResponse>("/auth/token/", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
  setTokens(data.access, data.refresh);
  return data;
}

export async function fetchMe(): Promise<AdminUser> {
  return api<AdminUser>("/auth/me/");
}

export function logout() {
  clearTokens();
}

export type DashboardStats = {
  jobs_total: number;
  jobs_active: number;
  news_total: number;
  news_published: number;
  sectors_total: number;
  demands_total: number;
  gallery_total: number;
  pages_total: number;
  inquiries_open: number;
  contact_open: number;
  partnership_open: number;
  registration_open: number;
  users_total: number;
};

export type Job = {
  id: number;
  title: string;
  company: string;
  sector: number;
  sector_name: string;
  country: number;
  country_name: string;
  vacancies: number;
  salary: string;
  description: string;
  requirements: string;
  deadline: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type NewsArticle = {
  id: number;
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
};

export type Sector = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  order: number;
};

export type Country = {
  id: number;
  name: string;
  flag_emoji: string;
  is_active: boolean;
  order: number;
};

export type SiteSettings = {
  id: number | null;
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
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
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
  partnership_form_heading?: string;
  partnership_form_success?: string;
  partnership_form_submit_label?: string;
  partnership_form_sending_label?: string;
  partnership_form_name_label?: string;
  partnership_form_phone_label?: string;
  partnership_form_email_label?: string;
  partnership_form_message_label?: string;
  logo_url?: string | null;
  favicon_url?: string | null;
  og_image_url?: string | null;
  stats_background_url?: string | null;
  testimonials_background_url?: string | null;
  updated_at: string | null;
};

export type ContactInquiry = {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  phone: string;
  handled: boolean;
  created_at: string;
};

export type PartnershipInquiry = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  handled: boolean;
  created_at: string;
};

export type RegistrationSubmission = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  permanent_address: string;
  temporary_address: string;
  position: string;
  preferred_country: string;
  message: string;
  handled: boolean;
  created_at: string;
};

export type StaffUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined?: string;
  password?: string;
};

type CrudResource<T> = {
  list: (params?: Record<string, string>) => Promise<T[]>;
  get: (id: number) => Promise<T>;
  create: (body: Partial<T> | FormData) => Promise<T>;
  update: (id: number, body: Partial<T> | FormData) => Promise<T>;
  remove: (id: number) => Promise<void>;
};

function crud<T>(base: string): CrudResource<T> {
  return {
    list: (params) => {
      const q = params ? new URLSearchParams(params).toString() : "";
      return api<T[]>(`${base}/${q ? `?${q}` : ""}`);
    },
    get: (id) => api<T>(`${base}/${id}/`),
    create: (body) => api<T>(`${base}/`, { method: "POST", body }),
    update: (id, body) => api<T>(`${base}/${id}/`, { method: "PATCH", body }),
    remove: (id) => api<void>(`${base}/${id}/`, { method: "DELETE" }),
  };
}

export type OrderedItem = {
  id: number;
  order: number;
  is_active: boolean;
  [key: string]: unknown;
};

export const adminApi = {
  dashboard: () => api<DashboardStats>("/admin/dashboard/"),
  jobs: crud<Job>("/admin/jobs"),
  news: crud<NewsArticle>("/admin/news"),
  sectors: crud<Sector>("/admin/sectors"),
  countries: crud<Country>("/admin/countries"),
  hero: crud<OrderedItem>("/admin/hero"),
  stats: crud<OrderedItem>("/admin/stats"),
  motto: crud<OrderedItem>("/admin/motto"),
  testimonials: crud<OrderedItem>("/admin/testimonials"),
  memberships: crud<OrderedItem>("/admin/memberships"),
  clients: crud<OrderedItem>("/admin/clients"),
  whyChooseUs: crud<OrderedItem>("/admin/why-choose-us"),
  aboutAccordion: crud<OrderedItem>("/admin/about-accordion"),
  recruitmentSteps: crud<OrderedItem>("/admin/recruitment-steps"),
  certificates: crud<OrderedItem>("/admin/certificates"),
  navigation: crud<OrderedItem>("/admin/navigation"),
  footerLinks: crud<OrderedItem>("/admin/footer-links"),
  quickLinks: crud<OrderedItem>("/admin/quick-links"),
  faqs: crud<OrderedItem>("/admin/faqs"),
  socialLinks: crud<OrderedItem>("/admin/social-links"),
  contactNumbers: crud<OrderedItem>("/admin/contact-numbers"),
  offices: crud<OrderedItem>("/admin/offices"),
  demands: crud<OrderedItem>("/admin/demands"),
  careers: crud<OrderedItem>("/admin/careers"),
  galleryAlbums: crud<OrderedItem>("/admin/gallery/albums"),
  galleryImages: crud<OrderedItem>("/admin/gallery/images"),
  pageSeo: crud<OrderedItem>("/admin/page-seo"),
  pages: crud<OrderedItem>("/admin/pages"),
  contentBlocks: crud<OrderedItem>("/admin/content-blocks"),
  media: crud<OrderedItem>("/admin/media"),
  users: crud<StaffUser>("/admin/users"),
  siteSettings: {
    get: () => api<SiteSettings>("/admin/site-settings/"),
    update: (body: Partial<SiteSettings> | FormData, create = false) =>
      api<SiteSettings>("/admin/site-settings/", {
        method: create ? "PUT" : "PATCH",
        body,
      }),
  },
  inquiries: {
    contact: {
      list: () => api<ContactInquiry[]>("/admin/inquiries/contact/"),
      patch: (id: number, body: { handled: boolean }) =>
        api<ContactInquiry>(`/admin/inquiries/contact/${id}/`, { method: "PATCH", body }),
    },
    partnership: {
      list: () => api<PartnershipInquiry[]>("/admin/inquiries/partnership/"),
      patch: (id: number, body: { handled: boolean }) =>
        api<PartnershipInquiry>(`/admin/inquiries/partnership/${id}/`, {
          method: "PATCH",
          body,
        }),
    },
    registration: {
      list: () => api<RegistrationSubmission[]>("/admin/inquiries/registration/"),
      patch: (id: number, body: { handled: boolean }) =>
        api<RegistrationSubmission>(`/admin/inquiries/registration/${id}/`, {
          method: "PATCH",
          body,
        }),
    },
  },
};
