import { adminApi, type OrderedItem } from "@/lib/admin-api";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "select" | "file";
  options?: { label: string; value: string | number }[];
  required?: boolean;
  accept?: string;
};

export type ResourceConfig = {
  key: string;
  label: string;
  columns: { key: string; label: string }[];
  fields: FieldDef[];
  api: {
    list: (params?: Record<string, string>) => Promise<OrderedItem[]>;
    create: (body: Partial<OrderedItem> | FormData) => Promise<OrderedItem>;
    update: (id: number, body: Partial<OrderedItem> | FormData) => Promise<OrderedItem>;
    remove: (id: number) => Promise<void>;
  };
  defaults: Record<string, unknown>;
  listParams?: Record<string, string>;
  multipart?: boolean;
};

const bool = { type: "boolean" as const };
const num = { type: "number" as const };
const area = { type: "textarea" as const };

export const resourceMap = {
  hero: {
    key: "hero",
    label: "Hero slides",
    columns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "subtitle", label: "Subtitle", ...area },
      { key: "body", label: "Body", ...area },
      { key: "cta_primary_label", label: "Primary CTA label" },
      { key: "cta_primary_path", label: "Primary CTA path" },
      { key: "cta_secondary_label", label: "Secondary CTA label" },
      { key: "cta_secondary_path", label: "Secondary CTA path" },
      { key: "rating", label: "Star rating (0–5)", ...num },
      { key: "background_image", label: "Background image", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.hero,
    defaults: {
      title: "",
      eyebrow: "",
      subtitle: "",
      body: "",
      rating: 4.9,
      order: 0,
      is_active: true,
    },
    multipart: true,
  },
  stats: {
    key: "stats",
    label: "Statistics",
    columns: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" },
      { key: "icon", label: "Icon" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "value", label: "Value", required: true },
      { key: "label", label: "Label", required: true },
      {
        key: "icon",
        label: "Icon",
        type: "select",
        options: [
          { label: "Users", value: "users" },
          { label: "Wrench", value: "wrench" },
          { label: "Globe", value: "globe" },
          { label: "Star", value: "star" },
          { label: "Briefcase", value: "briefcase" },
          { label: "Map pin", value: "map-pin" },
          { label: "Building", value: "building" },
          { label: "Handshake", value: "handshake" },
        ],
      },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.stats,
    defaults: { value: "", label: "", icon: "users", order: 0, is_active: true },
  },
  motto: {
    key: "motto",
    label: "Motto steps",
    columns: [
      { key: "title", label: "Title" },
      { key: "step_label", label: "Step" },
      { key: "tone", label: "Tone" },
    ],
    fields: [
      { key: "step_label", label: "Step label", required: true },
      { key: "number", label: "Number", ...num, required: true },
      { key: "title", label: "Title", required: true },
      {
        key: "icon",
        label: "Icon",
        type: "select",
        options: [
          { label: "Users / Listen", value: "users" },
          { label: "Wrench / Plan", value: "wrench" },
          { label: "Globe / Recruit", value: "globe" },
          { label: "Star / Deliver", value: "star" },
          { label: "Briefcase", value: "briefcase" },
          { label: "Handshake", value: "handshake" },
          { label: "Search", value: "search" },
          { label: "Heart", value: "heart" },
        ],
      },
      {
        key: "tone",
        label: "Tone",
        type: "select",
        options: [
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
        ],
      },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.motto,
    defaults: {
      step_label: "STEP 01",
      number: 1,
      title: "",
      icon: "users",
      tone: "red",
      order: 0,
      is_active: true,
    },
  },
  sectors: {
    key: "sectors",
    label: "Sectors",
    columns: [
      { key: "name", label: "Name" },
      { key: "is_featured", label: "Featured" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "description", label: "Description", ...area },
      { key: "icon", label: "Icon key" },
      { key: "image", label: "Image", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_featured", label: "Featured", ...bool },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.sectors as ResourceConfig["api"],
    defaults: {
      name: "",
      description: "",
      icon: "",
      order: 0,
      is_featured: false,
      is_active: true,
    },
    multipart: true,
  },
  countries: {
    key: "countries",
    label: "Countries",
    columns: [
      { key: "name", label: "Name" },
      { key: "is_active", label: "Active" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "flag_emoji", label: "Flag emoji" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.countries as ResourceConfig["api"],
    defaults: { name: "", flag_emoji: "", order: 0, is_active: true },
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    columns: [
      { key: "author", label: "Author" },
      { key: "brand", label: "Brand" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "quote", label: "Quote", ...area, required: true },
      { key: "author", label: "Author", required: true },
      { key: "brand", label: "Brand" },
      { key: "photo", label: "Photo", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.testimonials,
    defaults: { quote: "", author: "", brand: "", order: 0, is_active: true },
    multipart: true,
  },
  memberships: {
    key: "memberships",
    label: "Memberships",
    columns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "url", label: "URL" },
      { key: "logo", label: "Logo", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.memberships,
    defaults: { title: "", url: "", order: 0, is_active: true },
    multipart: true,
  },
  clients: {
    key: "clients",
    label: "Partners / Clients",
    columns: [
      { key: "name", label: "Name" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "url", label: "URL" },
      { key: "logo", label: "Logo", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.clients,
    defaults: { name: "", url: "", order: 0, is_active: true },
    multipart: true,
  },
  navigation: {
    key: "navigation",
    label: "Navigation",
    columns: [
      { key: "label", label: "Label" },
      { key: "path", label: "Path" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "label", label: "Label", required: true },
      { key: "path", label: "Path", required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
      { key: "open_in_new_tab", label: "New tab", ...bool },
    ],
    api: adminApi.navigation,
    defaults: { label: "", path: "/", order: 0, is_active: true, open_in_new_tab: false },
  },
  "quick-links": {
    key: "quick-links",
    label: "Quick links",
    columns: [
      { key: "label", label: "Label" },
      { key: "path", label: "Path" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "label", label: "Label", required: true },
      { key: "path", label: "Path", required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.quickLinks,
    defaults: { label: "", path: "/", order: 0, is_active: true },
  },
  "footer-links": {
    key: "footer-links",
    label: "Footer links",
    columns: [
      { key: "label", label: "Label" },
      { key: "path", label: "Path" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "label", label: "Label", required: true },
      { key: "path", label: "Path" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.footerLinks,
    defaults: { label: "", path: "", order: 0, is_active: true },
  },
  social: {
    key: "social",
    label: "Social links",
    columns: [
      { key: "platform", label: "Platform" },
      { key: "url", label: "URL" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      {
        key: "platform",
        label: "Platform",
        type: "select",
        options: [
          { label: "Facebook", value: "facebook" },
          { label: "Instagram", value: "instagram" },
          { label: "LinkedIn", value: "linkedin" },
          { label: "YouTube", value: "youtube" },
          { label: "Twitter", value: "twitter" },
          { label: "Other", value: "other" },
        ],
      },
      { key: "label", label: "Label" },
      { key: "url", label: "URL", required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.socialLinks,
    defaults: { platform: "facebook", label: "", url: "", order: 0, is_active: true },
  },
  faqs: {
    key: "faqs",
    label: "FAQs",
    columns: [
      { key: "question", label: "Question" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "question", label: "Question", required: true },
      { key: "answer", label: "Answer", ...area, required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.faqs,
    defaults: { question: "", answer: "", order: 0, is_active: true },
  },
  phones: {
    key: "phones",
    label: "Phone numbers",
    columns: [
      { key: "label", label: "Label" },
      { key: "number", label: "Number" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "label", label: "Label" },
      { key: "number", label: "Number", required: true },
      { key: "order", label: "Order", ...num },
    ],
    api: adminApi.contactNumbers,
    defaults: { label: "", number: "", order: 0 },
  },
  offices: {
    key: "offices",
    label: "Office locations",
    columns: [
      { key: "title", label: "Title" },
      { key: "office_name", label: "Office" },
      { key: "phone", label: "Phone" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "office_name", label: "Office name", required: true },
      { key: "address", label: "Address", required: true },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "order", label: "Order", ...num },
    ],
    api: adminApi.offices,
    defaults: { title: "", office_name: "", address: "", email: "", phone: "", order: 0 },
  },
  demands: {
    key: "demands",
    label: "Demand list",
    columns: [
      { key: "title", label: "Title" },
      { key: "employer", label: "Employer" },
      { key: "positions", label: "Positions" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "employer", label: "Employer" },
      { key: "positions", label: "Positions", ...num },
      { key: "description", label: "Description", ...area },
      { key: "published_at", label: "Published date" },
      { key: "document", label: "Document", type: "file" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.demands,
    defaults: {
      title: "",
      employer: "",
      positions: 1,
      description: "",
      published_at: "",
      order: 0,
      is_active: true,
    },
    multipart: true,
  },
  careers: {
    key: "careers",
    label: "Career openings",
    columns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", ...area },
      { key: "apply_path", label: "Apply path" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.careers,
    defaults: {
      title: "",
      description: "",
      apply_path: "/online-registration",
      order: 0,
      is_active: true,
    },
  },
  certificates: {
    key: "certificates",
    label: "Certificates",
    columns: [
      { key: "title", label: "Title" },
      { key: "tag", label: "Tag" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "tag", label: "Tag" },
      { key: "image", label: "Preview image", type: "file", accept: "image/*" },
      {
        key: "document",
        label: "PDF / document",
        type: "file",
        accept: ".pdf,application/pdf,image/*",
      },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.certificates,
    defaults: { title: "", tag: "CERTIFICATES", order: 0, is_active: true },
    multipart: true,
  },
  why: {
    key: "why",
    label: "Why choose us",
    columns: [
      { key: "number", label: "#" },
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "number", label: "Number", required: true },
      { key: "title", label: "Title", required: true },
      { key: "body", label: "Body", ...area, required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.whyChooseUs,
    defaults: { number: "01", title: "", body: "", order: 0, is_active: true },
  },
  accordion: {
    key: "accordion",
    label: "About accordion",
    columns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "body", label: "Body", ...area, required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.aboutAccordion,
    defaults: { title: "", body: "", order: 0, is_active: true },
  },
  recruitment: {
    key: "recruitment",
    label: "Recruitment steps",
    columns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "body", label: "Body", ...area, required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.recruitmentSteps,
    defaults: { title: "", body: "", order: 0, is_active: true },
  },
  "gallery-albums": {
    key: "gallery-albums",
    label: "Gallery albums",
    columns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", ...area },
      { key: "cover", label: "Cover image", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.galleryAlbums,
    defaults: { title: "", description: "", order: 0, is_active: true },
    multipart: true,
  },
  "gallery-images": {
    key: "gallery-images",
    label: "Gallery images",
    columns: [
      { key: "title", label: "Title" },
      { key: "caption", label: "Caption" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "title", label: "Title" },
      { key: "caption", label: "Caption" },
      { key: "image", label: "Image", type: "file", accept: "image/*", required: true },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.galleryImages,
    defaults: { title: "", caption: "", order: 0, is_active: true },
    multipart: true,
  },
  pages: {
    key: "pages",
    label: "CMS pages",
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "is_published", label: "Published" },
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "excerpt", label: "Excerpt", ...area },
      { key: "content", label: "Content", ...area, required: true },
      { key: "meta_title", label: "SEO title" },
      { key: "meta_description", label: "SEO description", ...area },
      { key: "order", label: "Order", ...num },
      { key: "is_published", label: "Published", ...bool },
      { key: "show_in_nav", label: "Show in nav", ...bool },
    ],
    api: adminApi.pages,
    defaults: {
      title: "",
      excerpt: "",
      content: "",
      meta_title: "",
      meta_description: "",
      order: 0,
      is_published: true,
      show_in_nav: false,
    },
  },
  "content-blocks": {
    key: "content-blocks",
    label: "Page copy blocks",
    columns: [
      { key: "label", label: "Label" },
      { key: "key", label: "Key" },
      { key: "page", label: "Page" },
    ],
    fields: [
      { key: "key", label: "Key", required: true },
      {
        key: "page",
        label: "Page",
        type: "select",
        options: [
          { label: "About Us", value: "about" },
          { label: "Services", value: "services" },
          { label: "Overseas Recruitment", value: "overseas-recruitment" },
          { label: "Ethical Recruitment", value: "ethical-recruitment" },
          { label: "Home", value: "home" },
          { label: "Careers", value: "careers" },
          { label: "Contact", value: "contact" },
          { label: "Awards", value: "awards" },
          { label: "Demands", value: "demands" },
          { label: "Vacancies", value: "vacancies" },
          { label: "Gallery", value: "gallery" },
          { label: "Other", value: "other" },
        ],
      },
      { key: "label", label: "Admin label", required: true },
      { key: "heading", label: "Heading" },
      { key: "subheading", label: "Subheading" },
      { key: "body", label: "Body", ...area },
      { key: "body_2", label: "Body (paragraph 2)", ...area },
      { key: "body_3", label: "Body (paragraph 3)", ...area },
      { key: "video_url", label: "Video URL" },
      { key: "cta_label", label: "CTA label" },
      { key: "cta_path", label: "CTA path" },
      { key: "image", label: "Image", type: "file", accept: "image/*" },
      { key: "order", label: "Order", ...num },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.contentBlocks,
    defaults: {
      key: "",
      page: "about",
      label: "",
      heading: "",
      subheading: "",
      body: "",
      body_2: "",
      body_3: "",
      video_url: "",
      cta_label: "",
      cta_path: "",
      order: 0,
      is_active: true,
    },
    multipart: true,
  },
  seo: {
    key: "seo",
    label: "Page SEO",
    columns: [
      { key: "path", label: "Path" },
      { key: "title", label: "Title" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { key: "path", label: "Path", required: true },
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", ...area },
      { key: "keywords", label: "Keywords" },
      { key: "is_active", label: "Active", ...bool },
    ],
    api: adminApi.pageSeo,
    defaults: { path: "/", title: "", description: "", keywords: "", is_active: true },
  },
} satisfies Record<string, ResourceConfig>;

export type ResourceKey = keyof typeof resourceMap;

export function contentBlocksForPage(page: string): ResourceConfig {
  return {
    ...resourceMap["content-blocks"],
    key: `content-blocks-${page}`,
    label: "Page copy",
    listParams: { section: page },
    defaults: {
      ...resourceMap["content-blocks"].defaults,
      page,
      key: `${page}.`,
    },
  };
}
