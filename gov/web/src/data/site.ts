export type NavLeaf = { label: string; to?: string; href?: string; items?: NavLeaf[] };
export type NavItem = { label: string; to?: string; items: NavLeaf[] };

export const NAV: NavItem[] = [
  {
    label: "About Us",
    items: [
      { label: "Aim and Vision", to: "/pages/aim-and-vision" },
      { label: "Official and Staff", to: "/our-team" },
      { label: "Citizen Charter", to: "/pages/citizen-charter" },
      { label: "Background", to: "/pages/background" },
      { label: "Major Scope of Works", to: "/pages/major-scope-of-works" },
      { label: "Functions of Divisions/Sections", to: "/pages/functions-of-divisions-sections" },
      { label: "Organization Structure", to: "/pages/structure" },
    ],
  },
  { label: "Services", to: "/services-list", items: [] },
  { label: "Jobs", to: "/jobs", items: [] },
  { label: "Gallery", to: "/gallery", items: [] },
  { label: "Contact Us", to: "/contact-us", items: [] },
  {
    label: "Agencies",
    items: [
      { label: "Recruiting Agencies", to: "/category/recruitment" },
      { label: "Orientation Centre", to: "/category/orientation" },
      { label: "Insurance Company", to: "/category/insurance" },
      { label: "Banks", to: "/category/banks" },
      { label: "Medical Centre", to: "/category/medical" },
      { label: "Agent", to: "/category/agent" },
      { label: "RA branch Offices", to: "/category/ra-branch" },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        label: "Acts and Regulations",
        items: [
          { label: "Act", to: "/category/act" },
          { label: "Regulations", to: "/category/regulations" },
          { label: "Policy", to: "/category/policy" },
        ],
      },
      {
        label: "Publications",
        items: [
          { label: "Office Related Statistics", to: "/category/publications" },
          { label: "Annual Policies, Programs and Plans", to: "/category/yearly" },
          { label: "Plan", to: "/category/plan" },
          { label: "Budgets", to: "/category/budget" },
        ],
      },
      {
        label: "Reports / Progress Report",
        items: [
          { label: "Yearly Progress Report", to: "/category/yearly" },
          { label: "Report List", to: "/category/report-list" },
        ],
      },
      { label: "Directorate", to: "/category/directorate" },
      { label: "Reports", to: "/category/report-list" },
    ],
  },
  {
    label: "Notice",
    items: [
      {
        label: "Notices",
        items: [
          { label: "Notice", to: "/category/notices" },
          { label: "Publications", to: "/category/publications" },
          { label: "Press Release", to: "/category/press-release" },
          { label: "Bulletin", to: "/category/bulletin" },
          { label: "Tenders", to: "/category/tenders" },
          { label: "G to G", to: "/category/ji-to-ji" },
          { label: "Case", to: "/category/case-case" },
        ],
      },
      {
        label: "PublicInfo",
        items: [
          { label: "Right to Information", to: "/category/rightinfo" },
          { label: "Public Important", to: "/pages/public-important" },
        ],
      },
      { label: "Dispatch", to: "/category/dispatch" },
      { label: "Journal/Magazine", to: "/category/bulletin" },
    ],
  },
  {
    label: "Downloads",
    items: [
      { label: "Forms", to: "/category/forms" },
      { label: "Labour Approval", to: "/category/labour-approval" },
      { label: "Pre Approval", to: "/category/preapproval" },
      { label: "Recognized Country", to: "/pages/recognized-country" },
      { label: "Reports", to: "/category/report-list" },
    ],
  },
];


export const SERVICES = [
  { title: "Online Labour Approval (FEIMS)", href: "https://feims.dofe.gov.np" },
  { title: "Foreign Employment Search", href: "https://feims.dofe.gov.np/search" },
  { title: "Labour approval Search (Sticker Search)", href: "https://feims.dofe.gov.np/sticker" },
  { title: "PrePermission", href: "https://feims.dofe.gov.np/prepermission" },
  { title: "Grievance and Case Management System", href: "https://ujuri.dofe.gov.np" },
  { title: "Dofe Old Website", href: "https://old.dofe.gov.np" },
] as const;

export const OFFICIALS = [
  {
    name: "Mira Acharya",
    role: "Director General",
    email: "dg@dofe.gov.np",
  },
  {
    name: "Binda Acharya",
    role: "Spokesperson / Information Officer / Director",
    phone: "9851122435",
  },
  {
    name: "वैदेशिक श्रम स्वीकृति",
    role: "श्रम स्वीकृति शाखा",
    phone: "9768998473",
  },
];

export const HIGHLIGHTS = [
  { title: "Regarding Passport Return", date: "July 28, 2026, 04:13 PM" },
  {
    title: "Report on Final Approved List (New RA Wise) from 2025-07-17 to 2026-07-16",
    date: "July 23, 2026, 12:19 PM",
  },
  { title: "Notice", date: "July 21, 2026, 04:42 PM" },
];

export const NEWS = [
  {
    title:
      "Notice Regarding the Authenticity of Licensed Recruitment Agency Engaged in Foreign Employment-Related Activities",
    date: "July 24, 2026, 05:07 PM",
  },
  {
    title:
      "Press Note (Regarding the Launch of the Complaint and Case Management System – ujuri.dofe.gov.np)",
    date: "July 21, 2026, 08:22 PM",
  },
  {
    title:
      "Urgent Notice Regarding the Filling Out of the Application Form for the First-Phase Korean Language Test (EPS-TOPIK 2026) under the 2026 Point-Based Selection System.",
    date: "July 21, 2026, 09:57 AM",
  },
];

export const DOWNLOADS = [
  { title: "Regarding Passport Return" },
  { title: "Notice" },
  {
    title:
      "Notice Regarding the Authenticity of Licensed Recruitment Agency Engaged in Foreign Employment-Related Activities",
  },
];

export const TABS = ["G to G", "Press Release", "reports", "Case", "Notices"];

export const TAB_ITEMS = [
  { title: "Regarding Passport Return", date: "July 28, 2026, 04:13 PM" },
  { title: "Notice", date: "July 25, 2026, 07:36 PM" },
  { title: "Notice", date: "July 21, 2026, 04:42 PM" },
  {
    title:
      "Urgent Notice Regarding the Filling Out of the Application Form for the First-Phase Korean Language Test (EPS-TOPIK 2026) under the 2026 Point-Based Selection System.",
    date: "July 21, 2026, 09:57 AM",
  },
];

export const PUBLICATIONS = [
  { title: "Press Release" },
  {
    title:
      "Notice Regarding the Listing of Institutions Conducting Health Examinations for Workers Going Abroad for Foreign Employment",
  },
  { title: "Notice regarding coming to sign the contract (Israel Branch) 2082-83" },
  {
    title:
      "Cyber Security Advisory Issued for Information Technology System Users and System Operators",
  },
];

export const GALLERY = [
  {
    title:
      "Courtesy meeting between the Director General of the Department and the Ambassador of Israel.",
    count: 4,
  },
  { title: "Related to Foreign-Employment Offences", count: 11 },
  { title: "Features of FEMIS", count: 0 },
  { title: "Orientation Program (April 1 and 2, 2022)", count: 18 },
  { title: "Various programs through Foreign Employment", count: 10 },
];

export const NOTICES = [
  { title: "Notice", date: "Saturday, July 25, 2026, 07:36 PM" },
  {
    title:
      "Notice Regarding the Authenticity of Licensed Recrutiment Agency Engaged in Foreign Employment-Related Activities",
    date: "Friday, July 24, 2026, 05:07 PM",
  },
  {
    title: "Report on Final Approved List (New RA Wise) from 2025-07-17 to 2026-07-16",
    date: "Thursday, July 23, 2026, 12:19 PM",
  },
  { title: "Notice", date: "Tuesday, July 21, 2026, 04:42 PM" },
  { title: "Notice", date: "Thursday, July 16, 2026, 05:43 PM" },
  {
    title: "Invitation for Sealed Quotations for Office Cleaning Services",
    date: "Tuesday, July 14, 2026, 07:11 PM",
  },
];

export const TEAM = [
  {
    name: "Mira Acharya",
    designation: "Director General",
    division: "",
    section: "",
    phone: "",
    email: "dg@dofe.gov.np",
    photoUrl:
      "https://giwmscdnone.gov.np/media/albums/WhatsApp%20Image%202026-03-30%20at%202.01.43%20PM_05aB7WqcB9_q1mcgch.jpeg",
  },
  {
    name: "Binda Acharya",
    designation: "Spokesperson / Information Officer / Director",
    division: "",
    section: "Administration and Planning Section",
    phone: "9851112315",
    email: "",
    photoUrl:
      "https://giwmscdnone.gov.np/media/albums/WhatsApp%20Image%202026-01-09%20at%201.30.55%20PM_bBODYMPpBl_1bhpcon.jpeg",
  },
  {
    name: "Khil Raj Rai",
    designation: "Director",
    division: "",
    section: "Foreign Employment Approval Branch",
    phone: "9768998473",
    email: "",
    photoUrl:
      "https://giwmscdnone.gov.np/media/albums/WhatsApp%20Image%202026-01-06%20at%2010.55.38%20AM_e3oor4cKnN_jhqogzn.jpeg",
  },
  {
    name: "Krishna Kumari Gauli",
    designation: "Director",
    division: "",
    section: "Relief and Rescue Section",
    phone: "9765013774",
    email: "",
    photoUrl: "",
  },
  {
    name: "Purna Prasad Sharma",
    designation: "Director",
    division: "",
    section: "Investigation And Case Section",
    phone: "9765013803",
    email: "",
    photoUrl: "",
  },
  {
    name: "Rajeshwori Khatri Sapkota",
    designation: "Director",
    division: "",
    section: "Monitoring And G2G Facilatation",
    phone: "9765013761",
    email: "",
    photoUrl: "",
  },
  {
    name: "Anup Dhakal",
    designation: "Director",
    division: "",
    section: "EPS Korea",
    phone: "",
    email: "",
    photoUrl: "",
  },
  {
    name: "Giman Thapa Magar",
    designation: "Section Officer",
    division: "",
    section: "Organization Registration Section",
    phone: "9768998476",
    email: "",
    photoUrl: "",
  },
  {
    name: "Ashok Prasad Dahal",
    designation: "Section Officer",
    division: "",
    section: "Individual Permit Section",
    phone: "01-5909665",
    email: "",
    photoUrl: "",
  },
  {
    name: "Radha M.C",
    designation: "Account Officer",
    division: "",
    section: "Financial Administration Section",
    phone: "01-4792710",
    email: "",
    photoUrl: "",
  },
  {
    name: "Samir Tamang",
    designation: "Computer Engineer",
    division: "",
    section: "Information Technology Section/ IT Section",
    phone: "9768998477",
    email: "",
    photoUrl: "",
  },
  {
    name: "Shiva Raj Luitel",
    designation: "Computer Engineer",
    division: "",
    section: "Information Technology Section/ IT Section",
    phone: "",
    email: "",
    photoUrl: "",
  },
  {
    name: "Ramakanta Joshi",
    designation: "Computer Engineer",
    division: "",
    section: "Information Technology Section/ IT Section",
    phone: "9768998477",
    email: "",
    photoUrl: "",
  },
  {
    name: "Abhi Lal Rai",
    designation: "Section Officer",
    division: "",
    section: "Relief And Rescue Section",
    phone: "9768998474",
    email: "",
    photoUrl: "",
  },
  {
    name: "Nirmal Kumar Pun",
    designation: "Section Officer",
    division: "",
    section: "Case and Investigation Section",
    phone: "9745619147",
    email: "",
    photoUrl: "",
  },
  {
    name: "Santosh Kumar Lamichane",
    designation: "Section Officer",
    division: "",
    section: "Individual Permit Section",
    phone: "9768998473",
    email: "",
    photoUrl: "",
  },
  {
    name: "Asalimaya tamang",
    designation: "Section Officer",
    division: "",
    section: "Monitoring Section",
    phone: "",
    email: "",
    photoUrl: "",
  },
  {
    name: "Bhoj Raj Khatiwada",
    designation: "Section Officer",
    division: "",
    section: "EPS Section",
    phone: "",
    email: "",
    photoUrl: "",
  },
  {
    name: "Raj Kishor Shah",
    designation: "Section Officer",
    division: "",
    section: "EPS Section",
    phone: "",
    email: "",
    photoUrl: "",
  },
  {
    name: "Toran Parajuli",
    designation: "Section Officer",
    division: "",
    section: "Case and Investigation Section",
    phone: "",
    email: "",
    photoUrl: "",
  },
];

export type FooterLink = { label: string; href: string };

/** Important external links — real https URLs (Nepal government / DoFE systems). */
export const FOOTER_LINKS_LEFT: FooterLink[] = [
  { label: "Ministry of Youth, Labour and Employment", href: "https://moless.gov.np/" },
  { label: "Ministry of Foreign Affairs", href: "https://mofa.gov.np/" },
  { label: "Social Security Fund", href: "https://ssf.gov.np/" },
  { label: "Labour and Employment Office, Butwal", href: "https://moless.gov.np/" },
  { label: "Labour and Employment Office, Biratnagar", href: "https://moless.gov.np/" },
  {
    label: "Ministry of Communications and Information Technology",
    href: "https://mocit.gov.np/",
  },
  {
    label: "Integrated Data Management Center (NITC)",
    href: "https://nitc.gov.np/",
  },
  {
    label: "National Natural Resources and Fiscal Commission",
    href: "https://nnrfc.gov.np/",
  },
];

export const FOOTER_LINKS_RIGHT: FooterLink[] = [
  {
    label: "Office of the Prime Minister and Council of Ministers",
    href: "https://www.opmcm.gov.np/en/",
  },
  { label: "Ministry of Education and Sports", href: "https://moest.gov.np/" },
  { label: "E.P.S Online Exam System", href: "https://eps.dofe.gov.np/" },
  { label: "Labour and Employment Office, Pokhara", href: "https://moless.gov.np/" },
  { label: "Labour and Employment Office, Surkhet", href: "https://moless.gov.np/" },
  { label: "Department of Information Technology", href: "https://doit.gov.np/" },
  {
    label: "FEIMS — Online Labour Approval",
    href: "https://feims.dofe.gov.np",
  },
  {
    label: "Ujuri — Grievance and Case Management",
    href: "https://ujuri.dofe.gov.np",
  },
];

export const CONTACT_SECTIONS = [
  {
    no: "१.",
    name: "प्रशासन (प्रशासन, योजना, संस्था दर्ता, लेखा र सूचना प्रविधि)",
    rows: [
      "शाखा प्रमुख/निर्देशक (सूचना अधिकारी) — ९८५११२३२९५",
      "प्रशासन तथा योजना/शाखा अधिकृत — ०१-४७९१५४७९",
      "संस्था दर्ता/शाखा अधिकृत — ९७०६२८१८२७",
    ],
  },
  {
    no: "२.",
    name: "राहत तथा उद्धार",
    rows: ["शाखा प्रमुख/निर्देशक — ९८०७१४२०२४", "राहत, उद्धार/शाखा अधिकृत — ९८४९२१०१२६"],
  },
  {
    no: "३.",
    name: "संस्था अनुगमन तथा जी टु जी सहजीकरण (इजाजतपत्र)",
    rows: ["शाखा प्रमुख/निर्देशक — ९७०५१२३०८१", "संस्था अनुगमन/शाखा अधिकृत — ९७०८४२९१०५"],
  },
  {
    no: "४.",
    name: "अनुसन्धान तथा मुद्दा",
    rows: ["शाखा प्रमुख/निर्देशक — ९७०६३२१०८२"],
  },
  {
    no: "५.",
    name: "वैदेशिक श्रम स्वीकृति",
    rows: ["शाखा प्रमुख/निर्देशक — ९७६८९९८४७३", "व्यक्तिगत श्रम स्वीकृति/शाखा अधिकृत — ९८४३२२३४९५"],
  },
  {
    no: "६.",
    name: "इपिएस (EPS)",
    rows: ["शाखा प्रमुख/निर्देशक — ९७०६२१०५४९"],
  },
];
