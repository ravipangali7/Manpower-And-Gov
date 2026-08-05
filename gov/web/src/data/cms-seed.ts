import { CITIZEN_CHARTER_PAGES } from "@/data/citizen-charter";
import {
  CONTACT_SECTIONS,
  GALLERY,
  NOTICES,
  OFFICIALS,
  SERVICES,
  TEAM,
} from "@/data/site";

export type Content = {
  id: string;
  title: string;
  category: string;
  date: string;
  /** Optional last-updated display string from CMS */
  updatedAt?: string;
  summary: string;
  body: string;
  fileUrl: string;
  featured: boolean;
  /** Optional SEO overrides (aligned with Django Content.meta_title / meta_description). */
  metaTitle?: string;
  metaDescription?: string;
};

export type Agency = {
  id: string;
  type: string;
  name: string;
  license: string;
  address: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended" | "Expired";
};

export type Service = {
  id: string;
  title: string;
  href: string;
  description: string;
};

export type Official = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type TeamMember = {
  id: string;
  name: string;
  designation: string;
  division: string;
  section: string;
  phone: string;
  email: string;
  photoUrl: string;
};

export type StaticPage = {
  id: string;
  slug: string;
  title: string;
  body: string;
  /** Optional SEO override (aligned with Django StaticPage.meta_description). */
  metaDescription?: string;
  /**
   * Optional flipbook document (Citizen Charter, org chart scans, etc.).
   * Stored as JSON string so the admin ResourceManager can edit it in a textarea.
   * Shape: CharterDocumentPage[] from `@/data/citizen-charter`.
   */
  documentPagesJson?: string;
};

export type Album = {
  id: string;
  title: string;
  count: number;
  type: "Photographs" | "Audio Visual";
  date: string;
};

export type ContactSection = {
  id: string;
  no: string;
  name: string;
  rows: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  country: string;
  vacancies: number;
  salary: string;
  contract: string;
  deadline: string;
  status: "Open" | "Closed";
};

export type Settings = {
  siteName: string;
  ministry: string;
  address: string;
  phone: string;
  tollFree: string;
  email: string;
  adminUser: string;
  adminPassword: string;
  /** Optional SEO fields aligned with Django SiteSettings. */
  siteUrl?: string;
  ogImageUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  gscVerification?: string;
};

const id = (p: string, i: number) => `${p}-${i + 1}`;

const LONG_BODY =
  "As per the decision of the Department of Foreign Employment, all concerned licensed recruitment agencies, orientation centres, insurance companies and workers going for foreign employment are hereby informed of the following arrangement. The arrangement takes effect from the date of publication of this notice.\n\nAll concerned parties are requested to comply with the provisions of the Foreign Employment Act, 2064 and the Foreign Employment Rules, 2064. Failure to comply may result in action as prescribed by law.\n\nFor further information please contact the concerned section of the Department during office hours, or call the toll free number 1140.";

export const SEED_CONTENTS: Content[] = [
  ...NOTICES.map((n, i) => ({
    id: id("content", i),
    title: n.title,
    category: "notices",
    date: n.date.replace(/^\w+day, /, ""),
    updatedAt: i === 0 ? "July 29, 2026, 10:00 AM" : undefined,
    summary: n.title,
    body: LONG_BODY,
    fileUrl: "",
    featured: i < 3,
  })),
  {
    id: "content-7",
    title: "Press Note (Regarding the Launch of the Complaint and Case Management System)",
    category: "press-release",
    date: "July 21, 2026, 08:22 PM",
    updatedAt: "July 22, 2026, 09:00 AM",
    summary: "Launch of ujuri.dofe.gov.np, the online complaint and case management system.",
    body: LONG_BODY,
    fileUrl: "",
    featured: true,
  },
  {
    id: "content-8",
    title: "Foreign Employment Act, 2064 (with amendments)",
    category: "act",
    date: "June 12, 2026, 11:00 AM",
    summary: "Full text of the Foreign Employment Act, 2064 including all amendments.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-9",
    title: "Foreign Employment Rules, 2064",
    category: "regulations",
    date: "June 12, 2026, 11:20 AM",
    summary: "Regulations issued under the Foreign Employment Act, 2064.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-10",
    title: "Annual Labour Sanction Statement, Fiscal Year 2082/083",
    category: "publications",
    date: "July 10, 2026, 03:40 PM",
    summary: "Annual statistics of labour approvals issued by the Department.",
    body: LONG_BODY,
    fileUrl: "",
    featured: true,
  },
  {
    id: "content-11",
    title: "Individual Labour Approval Application Form",
    category: "forms",
    date: "May 02, 2026, 10:05 AM",
    summary: "Downloadable application form for individual labour approval.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-12",
    title: "Pre Approval Guidelines for Demand Letters",
    category: "preapproval",
    date: "April 18, 2026, 02:15 PM",
    summary: "Procedure and checklist for pre approval of demand letters.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-13",
    title: "Yearly Progress Report 2081/082",
    category: "yearly",
    date: "March 30, 2026, 04:00 PM",
    summary: "Progress report of the Department for the fiscal year 2081/082.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-14",
    title: "G to G Recruitment Notice — Republic of Korea (EPS)",
    category: "ji-to-ji",
    date: "July 21, 2026, 09:57 AM",
    summary: "EPS-TOPIK 2026 application information for Korea bound workers.",
    body: LONG_BODY,
    fileUrl: "",
    featured: true,
  },
  {
    id: "content-15",
    title: "Invitation for Sealed Quotations for Office Cleaning Services",
    category: "tenders",
    date: "July 14, 2026, 07:11 PM",
    summary: "Sealed quotations invited for office cleaning services.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-16",
    title: "Right to Information — Proactive Disclosure (Chaitra–Ashad 2082)",
    category: "rightinfo",
    date: "July 05, 2026, 01:30 PM",
    summary: "Quarterly proactive disclosure under the Right to Information Act.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-17",
    title: "Departmental Bulletin — Ashad 2082",
    category: "bulletin",
    date: "July 02, 2026, 12:00 PM",
    summary: "Monthly bulletin of the Department of Foreign Employment.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-18",
    title: "Report List of Registered Cases 2082",
    category: "report-list",
    date: "June 28, 2026, 05:10 PM",
    summary: "List of cases registered and decided during 2082.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-19",
    title: "Dispatch Notice for Labour Approval Stickers",
    category: "dispatch",
    date: "June 20, 2026, 09:00 AM",
    summary: "Dispatch schedule for labour approval stickers.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-20",
    title: "Directorate Contact Details 2082",
    category: "directorate",
    date: "June 15, 2026, 10:45 AM",
    summary: "Contact details of the directorates of the Department.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-21",
    title: "Case Decision Summary — Foreign Employment Tribunal",
    category: "case-case",
    date: "June 08, 2026, 03:25 PM",
    summary: "Summary of decisions issued by the Foreign Employment Tribunal.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-22",
    title: "Approved Labour Approval Statistics (RA Wise)",
    category: "labour-approval",
    date: "May 26, 2026, 11:55 AM",
    summary: "Recruitment agency wise labour approval statistics.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-23",
    title: "Annual Policies, Programs and Plans 2082/083",
    category: "plan",
    date: "May 12, 2026, 02:05 PM",
    summary: "Annual policy, programme and plan document of the Department.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
  {
    id: "content-24",
    title: "Approved Budget of the Department 2082/083",
    category: "budget",
    date: "May 10, 2026, 04:35 PM",
    summary: "Approved annual budget of the Department.",
    body: LONG_BODY,
    fileUrl: "",
    featured: false,
  },
];

const AGENCY_NAMES = [
  "Everest Overseas Pvt. Ltd.",
  "Himalaya Manpower Pvt. Ltd.",
  "Annapurna International Pvt. Ltd.",
  "Sagarmatha Recruitment Pvt. Ltd.",
  "Kathmandu Global Services Pvt. Ltd.",
  "Gandaki Employment Pvt. Ltd.",
];

const AGENCY_TYPES = [
  "recruitment",
  "orientation",
  "insurance",
  "banks",
  "medical",
  "agent",
  "ra-branch",
];

export const SEED_AGENCIES: Agency[] = AGENCY_TYPES.flatMap((type, ti) =>
  AGENCY_NAMES.slice(0, 5).map((name, i) => ({
    id: `agency-${ti + 1}-${i + 1}`,
    type,
    name: name.replace("Overseas", type === "medical" ? "Medical Centre" : "Overseas"),
    license: `${1000 + ti * 50 + i}/${2078 + (i % 4)}`,
    address: ["Tahachal, Kathmandu", "Gongabu, Kathmandu", "Sinamangal, Kathmandu", "Lalitpur", "Bhaktapur"][i],
    phone: `01-4${790000 + ti * 111 + i * 7}`.slice(0, 12),
    email: `info${ti}${i}@example.com.np`,
    status: (i === 4 ? "Suspended" : "Active") as Agency["status"],
  })),
);

export const SEED_SERVICES: Service[] = SERVICES.map((s, i) => ({
  id: id("service", i),
  title: s.title,
  href: s.href,
  description: "Online service provided by the Department of Foreign Employment.",
}));

export const SEED_OFFICIALS: Official[] = OFFICIALS.map((o, i) => ({
  id: id("official", i),
  name: o.name,
  role: o.role,
  email: o.email ?? "",
  phone: o.phone ?? "",
}));

export const SEED_TEAM: TeamMember[] = TEAM.map((t, i) => ({
  id: id("team", i),
  name: t.name,
  designation: t.designation,
  division: t.division,
  section: t.section,
  phone: t.phone,
  email: t.email,
  photoUrl: t.photoUrl,
}));

export const SEED_PAGES: StaticPage[] = [
  {
    id: "page-1",
    slug: "aim-and-vision",
    title: "Aim and Vision",
    body:
      "The Department of Foreign Employment, under the Ministry of Youth, Labour and Employment, Government of Nepal, works to make foreign employment safe, managed and dignified by regulating recruitment agencies, orientation centers and insurance companies engaged in foreign employment.\n\nAim: To develop Nepal's human resources as skilled, capable and competitive labour in line with international market demand, and to make their entry into foreign employment safe, managed and dignified.\n\nVision: To make foreign employment safe, managed, dignified and reliable, and to maximise the economic and non-economic benefits of foreign employment for poverty alleviation and the sustainable economic and social development of the nation.\n\nLabour approval is facilitated through FEIMS (https://feims.dofe.gov.np) and grievances may be filed at Ujuri (https://ujuri.dofe.gov.np).",
  },
  {
    id: "page-2",
    slug: "background",
    title: "Background",
    body:
      "The Department of Foreign Employment was established under the Ministry of Youth, Labour and Employment to implement the Foreign Employment Act, 2064 and Foreign Employment Rules, 2064.\n\nThe Department is located at Tahachal, Kathmandu and delivers services through its branches and the Foreign Employment Information Management System (FEIMS).",
  },
  {
    id: "page-3",
    slug: "structure",
    title: "Organization Structure",
    body:
      "The Department is led by the Director General and organised into Administration and Planning, Labour Approval, Relief and Rescue, Investigation and Case, Monitoring and Orientation, and Information Technology & EPS sections.",
    metaDescription:
      "Interactive organization structure (संगठन संरचना) of the Department of Foreign Employment — Director General, Deputy Director General and six main sections.",
  },
  {
    id: "page-3b",
    slug: "organization-structure",
    title: "Organization Structure",
    body:
      "The Department is led by the Director General and organised into Administration and Planning, Labour Approval, Relief and Rescue, Investigation and Case, Monitoring and Orientation, and Information Technology & EPS sections.",
    metaDescription:
      "Interactive organization structure (संगठन संरचना) of the Department of Foreign Employment — Director General, Deputy Director General and six main sections.",
  },
  {
    id: "page-4",
    slug: "citizen-charter",
    title: "Citizen Charter",
    body:
      "Individual labour approval: same day, service fee as prescribed, Individual Permit Section.\n\nInstitutional labour approval (Sticker): same day, Foreign Employment Approval Branch.\n\nRecruitment agency licence renewal: 3 working days, Organization Registration Section.\n\nComplaint registration and case handling: as per the Foreign Employment Act, Case and Investigation Section.",
    metaDescription:
      "Citizen Charter (नागरिक बडापत्र) of the Department of Foreign Employment — service standards, fees, required documents and responsible sections.",
    documentPagesJson: JSON.stringify(CITIZEN_CHARTER_PAGES),
  },
  {
    id: "page-5",
    slug: "major-scope-of-works",
    title: "Major Scope of Works",
    body:
      "The Director General oversees the Department through three divisions: the Administration and Planning Division, the Foreign Employment Approval Division and the Monitoring, Investigation and Case Division.\n\nEach division is divided into sections that handle licence issuance and renewal, individual and institutional labour approval, pre-approval of demands, orientation and insurance monitoring, and complaint investigation.\n\nField level work is carried out through Labour Desks at Tribhuvan International Airport and through Labour and Employment Offices in Butwal, Biratnagar, Pokhara and Surkhet.",
  },
  {
    id: "page-6",
    slug: "functions-of-divisions-sections",
    title: "Functions of Divisions/Sections",
    body:
      "Administration and Planning Division — human resources, procurement, budget, planning and internal administration.\n\nForeign Employment Approval Division — pre-approval of demand letters, institutional labour approval (sticker) and individual labour approval.\n\nMonitoring, Investigation and Case Division — monitoring of recruitment agencies, orientation centres and insurance companies, complaint registration and case filing.\n\nInformation Technology Section — Foreign Employment Information Management System (FEIMS), the online complaint portal and departmental data publication.\n\nRelief and Rescue Section — rescue of stranded workers, compensation claims and coordination with the Foreign Employment Board.",
  },
  {
    id: "page-7",
    slug: "public-important",
    title: "Public Important Information",
    body:
      "Workers must obtain labour approval from the Department before leaving Nepal for foreign employment. Departing without labour approval is illegal and unsafe.\n\nNever pay more than the service charge prescribed by the Government of Nepal, and always take an official receipt from the licensed recruiting agency.\n\nVerify the licence of the recruiting agency and the authenticity of the demand letter on the Department's website before signing any contract.\n\nComplaints can be registered free of cost at the Department or online at ujuri.dofe.gov.np. Toll free number: 1140.",
  },
  {
    id: "page-8",
    slug: "recognized-country",
    title: "Recognized Country",
    body:
      "The Government of Nepal has opened 111 countries for foreign employment. Labour approval is granted only for these recognized destinations.\n\nMajor destinations include Qatar, Malaysia, United Arab Emirates, Saudi Arabia, Kuwait, Bahrain, Oman, Japan, Republic of Korea, Israel, Romania, Poland, Croatia, Cyprus, Malta, Portugal, Mauritius and the Maldives.\n\nThe list of recognized countries is updated by decision of the Government of Nepal and published through notices of this Department.",
  },
];

export const SEED_ALBUMS: Album[] = GALLERY.map((g, i) => ({
  id: id("album", i),
  title: g.title,
  count: g.count,
  type: (i === 2 ? "Audio Visual" : "Photographs") as Album["type"],
  date: "July 12, 2026",
}));

export const SEED_CONTACT_SECTIONS: ContactSection[] = CONTACT_SECTIONS.map((c, i) => ({
  id: id("contact", i),
  no: c.no,
  name: c.name,
  rows: c.rows.join("\n"),
}));

export const SEED_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Construction Helper",
    company: "Al Rayan Contracting W.L.L.",
    country: "Qatar",
    vacancies: 120,
    salary: "QAR 1,200 / month",
    contract: "2 years",
    deadline: "August 20, 2026",
    status: "Open",
  },
  {
    id: "job-2",
    title: "Security Guard",
    company: "Emirates Security Services",
    country: "United Arab Emirates",
    vacancies: 75,
    salary: "AED 1,400 / month",
    contract: "2 years",
    deadline: "August 12, 2026",
    status: "Open",
  },
  {
    id: "job-3",
    title: "Factory Operator",
    company: "Sunrise Industries Sdn Bhd",
    country: "Malaysia",
    vacancies: 200,
    salary: "MYR 1,700 / month",
    contract: "3 years",
    deadline: "September 02, 2026",
    status: "Open",
  },
  {
    id: "job-4",
    title: "Caregiver",
    company: "Shalom Care Ltd.",
    country: "Israel",
    vacancies: 40,
    salary: "ILS 5,300 / month",
    contract: "5 years",
    deadline: "July 30, 2026",
    status: "Closed",
  },
  {
    id: "job-5",
    title: "Agriculture Worker",
    company: "Hanwoo Farms Co.",
    country: "Republic of Korea",
    vacancies: 60,
    salary: "KRW 2,060,000 / month",
    contract: "4 years 10 months",
    deadline: "August 28, 2026",
    status: "Open",
  },
  {
    id: "job-6",
    title: "Hotel Housekeeping",
    company: "Grand Aurora Hotels",
    country: "Malta",
    vacancies: 25,
    salary: "EUR 950 / month",
    contract: "2 years",
    deadline: "September 15, 2026",
    status: "Open",
  },
];

export const SEED_SETTINGS: Settings = {
  siteName: "Department of Foreign Employment",
  ministry: "Ministry of Youth, Labour and Employment",
  address: "Tahachal, Kathmandu",
  phone: "01-4792671",
  tollFree: "1140",
  email: "info@dofe.gov.np",
  adminUser: "admin",
  adminPassword: "admin123",
  siteUrl: "https://gov.luckyuser365.com",
  ogImageUrl: "https://gov.luckyuser365.com/og-default.png",
  facebookUrl: "https://www.facebook.com/dofe.np",
  twitterUrl: "https://x.com/baidesik_rojgar",
  gscVerification: "",
};

export const CATEGORY_TITLES: Record<string, string> = {
  notices: "Notices",
  "press-release": "Press Release",
  bulletin: "Bulletin",
  act: "Act",
  regulations: "Regulations",
  policy: "Policy",
  publications: "Publications",
  forms: "Forms",
  "report-list": "Reports",
  yearly: "Annual Policies, Programs and Plans",
  plan: "Plan",
  budget: "Budgets",
  directorate: "Directorate",
  tenders: "Tenders",
  "ji-to-ji": "G to G",
  "case-case": "Case",
  rightinfo: "Right to Information",
  dispatch: "Dispatch",
  "labour-approval": "Labour Approval",
  preapproval: "Pre Approval",
};

export const AGENCY_TITLES: Record<string, string> = {
  recruitment: "Recruiting Agencies",
  orientation: "Orientation Centre",
  insurance: "Insurance Company",
  banks: "Banks",
  medical: "Medical Centre",
  agent: "Agent",
  "ra-branch": "RA branch Offices",
};
