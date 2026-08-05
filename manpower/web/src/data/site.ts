export const company = {
  name: "Vision & Value Overseas Pvt. Ltd.",
  short: "VNVNEPAL",
  address: "Dhapasi Marg, Basundhara-3, Kathmandu, Nepal",
  phones: ["+977-14379749", "+977-14379450", "+977-14379162"],
  email: "info@vnvnepal.com",
  poBox: "P.O. Box: 7764",
};

export const notice =
  "NOTICE: At Vision & Value, we value your privacy and assure you that any concerns or complaints raised by candidates, visitors, stakeholders, or partners will be handled with complete confidentiality.";

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "News & Updates", to: "/news" },
  { label: "Jobs", to: "/vacancies" },
  { label: "Awards & Recognition", to: "/awards" },
  { label: "Contact", to: "/contact" },
] as const;

export const motto = [
  { step: "STEP 01", number: "1", label: "LISTEN", tone: "red" },
  { step: "STEP 02", number: "2", label: "PLAN", tone: "blue" },
  { step: "STEP 03", number: "3", label: "RECRUIT", tone: "red" },
  { step: "STEP 04", number: "4", label: "DELIVER", tone: "blue" },
] as const;

export const stats = [
  { value: "1000+", label: "Workers Deployed" },
  { value: "35", label: "Different Sectors" },
  { value: "12", label: "Different Countries" },
];

export const expertise = [
  "Hospitality",
  "Integrated Facility Management",
  "Environmental services",
  "Recruitment",
  "Pharmacy",
  "Health and Fitness",
  "Waste Management",
  "Entertainment",
  "Beauty and Make-up",
  "Laundry",
];

export const allSectors = [
  "Hospitality",
  "Integrated Facility Management",
  "Environmental services",
  "Recruitment",
  "Pharmacy",
  "Health and Fitness",
  "Waste Management",
  "Entertainment",
  "Beauty and Make-up",
  "Laundry",
  "Fishery",
  "Hotels and Restaurants",
  "Engineering",
  "IT",
  "Production Factory",
  "Health Care",
  "Catering",
  "Security Guards",
  "Gourmet Food and Wine Industry",
  "Sweets and Chocolates",
  "Food Flavour and Spices",
  "Bakery",
  "Café and Cafeteria",
  "Tourism",
  "Aviation",
  "Poultry",
  "Housekeeping",
  "Food and Beverage",
  "Cleaning and Maintenance",
  "Construction",
  "Manufacturing",
  "Cruise Ships",
  "Retail",
  "Transportation and Logistics",
  "Electronics",
  "Real Estate",
  "Trade and Commerce",
  "Automotive",
];

export const testimonials = [
  {
    quote:
      "Working with Vision & Value Overseas (VNVNEPAL) was an absolute pleasure. Their ethical approach to recruitment and their dedication to finding the right candidates for our company's needs exceeded our expectations. We highly recommend their services.",
    author: "LAEEQ AHMED (Director of Human Resources)",
    brand: "lissi",
  },
  {
    quote:
      "VNVNEPAL delivered a fully screened team ahead of schedule. Their compliance documentation and pre-departure counselling are the best we have seen from any recruitment partner in South Asia.",
    author: "MARIA SANTOS (Talent Acquisition Lead)",
    brand: "sea zen",
  },
  {
    quote:
      "Zero recruitment fee, complete transparency and genuinely skilled staff. Vision & Value has become our default hiring partner for all Gulf properties.",
    author: "RAJEEV MENON (Cluster General Manager)",
    brand: "Millennium",
  },
];

export const whyChooseUs = [
  {
    no: "01",
    title: "Ethical Recruitment",
    body: "At Vision & Value Overseas, we go the extra mile to ensure ethical recruitment practices. We have taken a proactive stance by eliminating the involvement of sub-agents entirely.",
  },
  {
    no: "02",
    title: "Independent Third-Party Monitoring",
    body: "To further ensure the integrity of our recruitment process, we have implemented independent third-party monitoring. This external oversight validates every step we take.",
  },
  {
    no: "03",
    title: "Hotline Service for Complaints",
    body: "We prioritize the well-being and satisfaction of both candidates and employers. To address any concerns or grievances, we provide a dedicated 24/7 hotline service.",
  },
  {
    no: "04",
    title: "Strong Compliance Team",
    body: "Our dedicated compliance team is committed to upholding legal and regulatory standards in recruitment and employment. They closely monitor every placement.",
  },
  {
    no: "05",
    title: "Quality Placement",
    body: "At Vision & Value Overseas, our commitment to quality placement sets us apart. We strive to ensure that each placement we make is the right long-term fit.",
  },
  {
    no: "06",
    title: "Internationally Recognized",
    body: "As esteemed members of Association of Labour Providers (ALP) UK, SEDEX, and Foreign Employment Agencies Association Nepal, we carry an internationally trusted name.",
  },
  {
    no: "07",
    title: "ISO 9001:2015 Certification",
    body: "Our ISO 9001:2015 certification is a testament to our stringent quality management systems, ensuring that our processes consistently deliver top-notch results.",
  },
  {
    no: "08",
    title: "Government Approved",
    body: "Our accreditation and licensing by the Government of Nepal and Gangmasters and Labour Abuse Authority (GLAA) UK demonstrate full legal standing.",
  },
];

export type NewsArticle = {
  slug: string;
  title: string;
  author: string;
  datePublished: string;
  /** ISO date when the article was last substantively updated. */
  dateModified?: string;
  excerpt: string;
  /** Substantive body paragraphs for the detail page (not fluff). */
  body: string[];
};

export const news: NewsArticle[] = [
  {
    slug: "contact-vnvnepal",
    title: "Contact VNVNEPAL",
    author: "vnv",
    datePublished: "2026-06-12",
    dateModified: "2026-06-20",
    excerpt:
      "Reach out to our recruitment desk for partnership enquiries, bulk hiring plans and candidate support.",
    body: [
      "Vision & Value Overseas (VNVNEPAL) welcomes employers, job seekers and partners who need a clear point of contact for overseas manpower recruitment from Nepal. Our Kathmandu desk handles partnership enquiries, bulk hiring plans, candidate counselling and post-deployment support under one licensed operation.",
      "Employers can share a demand letter, job description and destination-country requirements; our team responds with a sourcing plan, timeline and compliance checklist aligned with the Department of Foreign Employment. Job seekers can call, email or visit our Basundhara office with a CV and passport copy — we never charge candidates a recruitment fee.",
      "For the fastest response, use the contact form on this website, phone our published landlines during Sunday–Friday business hours, or email info@vnvnepal.com. You can also browse current vacancies and complete online registration before visiting the office.",
    ],
  },
  {
    slug: "passport-retrieval-notice",
    title: "Important Notice on Passport Retrieval (पासपोर्ट पुनः प्राप्ति बारे अत्यन्त जरुरी सूचना)",
    author: "vnv",
    datePublished: "2026-05-28",
    dateModified: "2026-05-30",
    excerpt:
      "Candidates who have submitted passports to our office are requested to collect them within the notified period.",
    body: [
      "Vision & Value Overseas (VNVNEPAL) has issued an important notice for candidates who previously submitted passports to our Kathmandu office for processing. If your file has been closed, cancelled or is no longer in active deployment, you are requested to collect your passport within the notified collection window.",
      "Please bring a valid photo ID and any receipt or acknowledgement slip issued at submission. If a family member collects on your behalf, they must carry an authorization letter signed by the passport holder plus copies of both IDs. Our compliance desk will verify the record before release.",
      "Uncollected documents create risk for candidates and delay office operations. If you cannot visit within the stated period, contact our team immediately to arrange an alternative date. For questions, call our published numbers or visit Dhapasi Marg, Basundhara-3, Kathmandu during business hours.",
    ],
  },
  {
    slug: "nepals-healthcare-workforce-goes-global",
    title:
      "Nepal's Healthcare Workforce Goes Global: Why the World's Best Hospitals Are Choosing Nepali Talent?",
    author: "vnv",
    datePublished: "2026-04-15",
    dateModified: "2026-04-22",
    excerpt:
      "Powering healthcare systems in GCC, UK, USA, Europe and Japan with trained Nepali healthcare professionals.",
    body: [
      "Hospitals and care providers across the GCC, the United Kingdom, Europe, the United States and Japan are expanding demand for licensed and trained healthcare professionals from Nepal. Vision & Value Overseas (VNVNEPAL) supports this pipeline through ethical, zero-cost recruitment that screens skills, credentials and language readiness before deployment.",
      "Nepali nurses, caregivers and allied health staff are valued for clinical discipline, adaptability and patient-centred communication. Employers typically request verified certificates, experience letters, medical fitness and destination-specific orientation. VNVNEPAL coordinates counselling, document checks and pre-departure briefing so candidates arrive job-ready.",
      "For healthcare employers, the advantage is a transparent process without sub-agents: clear timelines, audited documentation and post-deployment support. Candidates seeking overseas healthcare roles can register online, review openings on our vacancies page, or contact our Kathmandu team to discuss eligibility for specific destination markets.",
    ],
  },
  {
    slug: "iom-nepal-ssf-training",
    title: "Training by IOM-Nepal on Social Security Fund (SSF)",
    author: "vnv",
    datePublished: "2026-03-04",
    excerpt:
      "Our team participated in a capacity building session on the Social Security Fund led by IOM-Nepal.",
    body: [
      "Members of the Vision & Value Overseas (VNVNEPAL) team joined a capacity-building session on Nepal’s Social Security Fund (SSF) facilitated with IOM-Nepal. The training covered contribution rules, documentation expectations and how recruitment agencies should advise migrant workers about social protection before departure.",
      "Understanding SSF matters for ethical overseas recruitment: candidates need accurate information about contributions, benefits and how foreign employment interacts with domestic social security. Our compliance and counselling staff use this guidance when preparing workers for Gulf, Asian and European placements.",
      "VNVNEPAL will continue aligning our candidate orientation materials with national social-protection guidance so families receive clear, practical answers — not informal rumours. Employers and candidates with SSF-related questions during recruitment can raise them with our Kathmandu office.",
    ],
  },
  {
    slug: "vnvnepal-thanks-the-uae-government",
    title: "VNVNEPAL Thanks the UAE Government for Pardoning 267 Nepali Individuals",
    author: "vnvgraphics",
    datePublished: "2025-12-18",
    excerpt:
      "Vision & Value Overseas expresses sincere gratitude to the UAE Government for its humanitarian decision.",
    body: [
      "Vision & Value Overseas (VNVNEPAL) expresses sincere gratitude to the Government of the United Arab Emirates for the humanitarian decision to pardon 267 Nepali individuals. Acts of clemency that reunite families and restore dignity strengthen trust between labour-sending and destination countries.",
      "As an ethical recruitment agency licensed in Nepal, we advocate safe, lawful migration and fair treatment of workers throughout the employment cycle. We encourage candidates to follow destination laws, keep documents secure and use official channels for grievances — including our 24/7 support pathways for placements we manage.",
      "VNVNEPAL remains committed to transparent hiring for UAE and wider GCC employers: verified demand letters, medical and documentation support, and zero recruitment fees for candidates. Partners who share this standard are welcome to contact our partnership desk in Kathmandu.",
    ],
  },
  {
    slug: "zero-cost-recruitment",
    title:
      "Zero cost: 'The families of daughters who go for foreign employment no longer have to carry the burden of debt'",
    author: "vnv",
    datePublished: "2025-10-22",
    dateModified: "2025-11-02",
    excerpt:
      "Our zero-cost model removes the debt burden traditionally carried by migrant worker families.",
    body: [
      "For years, many Nepali families financed foreign employment through high-interest loans tied to informal recruitment fees. Vision & Value Overseas (VNVNEPAL) operates a zero-cost model for candidates: workers do not pay us for the job, and we reject sub-agent chains that shift cost onto households.",
      "When daughters and sons migrate without recruitment debt, remittances can support education, healthcare and savings instead of interest payments. Employers fund a compliant process; candidates focus on skills, medical clearance and pre-departure readiness. Independent monitoring and our compliance team help keep that promise auditable.",
      "Job seekers should treat any request for a recruitment fee as a red flag. Register through official VNVNEPAL channels, verify openings on our website, and ask our counselling desk to explain what costs (if any) are government or medical fees versus prohibited recruitment charges.",
    ],
  },
  {
    slug: "scaffolders-global-opportunities",
    title: "Global Opportunities for Aspiring Scaffolders with VNVNEPAL",
    author: "vnv",
    datePublished: "2025-08-14",
    excerpt:
      "Certified scaffolding training and placement pathways for skilled Nepali workers across the Gulf and Europe.",
    body: [
      "Scaffolding remains a high-demand trade across Gulf construction and industrial projects, with growing interest from European contractors who need certified, safety-aware crews. Vision & Value Overseas (VNVNEPAL) connects aspiring and experienced Nepali scaffolders with employers through ethical, documented overseas recruitment.",
      "Candidates typically need trade competence, height-safety awareness and medical fitness. Where employers specify certification or trade tests, we coordinate screening at our facilities and align pre-departure briefings with site safety expectations in the destination country.",
      "If you are a scaffolder seeking overseas work, browse construction-related vacancies, complete online registration, or visit our Kathmandu office with your experience letters and passport. Employers hiring scaffolding teams can send demand details to our partnership desk for a sourcing plan.",
    ],
  },
  {
    slug: "hospitality-staffing-excellence",
    title: "Unlock Excellence in Hospitality Staffing with VNVNEPAL!",
    author: "vnv",
    datePublished: "2025-06-09",
    dateModified: "2025-06-18",
    excerpt: "#1 Hospitality Recruitment Agency in Nepal, trusted by international hotel groups.",
    body: [
      "International hotels, resorts and catering operators continue to recruit Nepali hospitality talent for front office, housekeeping, F&B service and kitchen roles. Vision & Value Overseas (VNVNEPAL) specialises in ethical hospitality staffing from Nepal, with screening that matches brand standards and destination culture.",
      "Our process covers CV shortlisting, interviews (in person or online), skill checks where required, medical and documentation support, and pre-departure orientation on workplace etiquette. Candidates are never charged a recruitment fee; employers receive job-ready teams through a licensed, sub-agent-free channel.",
      "Hotel groups planning seasonal or permanent hiring can contact our partnership team with role profiles and volume. Candidates interested in hospitality abroad should review hotel and catering vacancies and register online before visiting our Basundhara office.",
    ],
  },
  {
    slug: "baking-as-a-metaphor-for-life",
    title: "Baking as a metaphor for life",
    author: "vnv",
    datePublished: "2025-03-21",
    excerpt: "Stories from our pastry and bakery candidates deployed to five-star kitchens abroad.",
    body: [
      "Pastry and bakery careers reward patience, precision and continuous learning — qualities we see daily in Nepali candidates preparing for five-star kitchens abroad. Vision & Value Overseas (VNVNEPAL) has placed bakery and pastry professionals with employers who need reliable, trainable talent.",
      "Successful candidates often combine formal training or hotel experience with a willingness to adapt to new recipes, hygiene systems and service rhythms. Pre-departure counselling helps them understand contract terms, kitchen hierarchy and cultural expectations in the host country.",
      "Aspiring bakers and pastry cooks can explore catering and hospitality openings on our vacancies page or speak with our counselling team about skill evidence employers typically request. We keep recruitment zero-cost for candidates and transparent for kitchen managers hiring from Nepal.",
    ],
  },
  {
    slug: "ssw-japan-program",
    title: "VNVNEPAL: Connecting Japanese Employers with Skilled Workers under SSW Japan Program",
    author: "vnv",
    datePublished: "2024-11-27",
    dateModified: "2025-01-10",
    excerpt:
      "Specified Skilled Worker pathways connecting Japanese employers with trained Nepali candidates.",
    body: [
      "Japan’s Specified Skilled Worker (SSW) framework creates structured pathways for Nepali talent in designated sectors. Vision & Value Overseas (VNVNEPAL) helps Japanese employers and Nepali candidates navigate ethical recruitment under this programme — with clear documentation, skills readiness and candidate counselling.",
      "SSW placements typically require language preparation, skills assessments and careful matching to employer needs. Our team explains process stages to candidates and coordinates with employers on timelines so expectations stay realistic and compliant with Nepali foreign-employment rules.",
      "Japanese employers seeking Nepali SSW candidates, and workers exploring Japan pathways, can contact VNVNEPAL’s Kathmandu office for guidance. We do not charge candidates recruitment fees and we do not use sub-agents for sourcing.",
    ],
  },
  {
    slug: "why-ethical-recruitment",
    title: "WHY ETHICAL RECRUITMENT?",
    author: "vnv",
    datePublished: "2024-09-05",
    dateModified: "2024-10-12",
    excerpt: "Say no fees for your job — the principle behind everything we do.",
    body: [
      "Ethical recruitment means workers do not buy their jobs. Vision & Value Overseas (VNVNEPAL) was built around that principle: zero recruitment fees for candidates, no sub-agent layers, and independent monitoring that helps verify process integrity for employers and workers alike.",
      "When agencies charge informal fees, families take on debt before a first salary arrives. Ethical practice replaces that with transparent employer-funded hiring, published processes and a compliance team that watches documentation, medical steps and labour approvals.",
      "Candidates should refuse fee requests and verify licences. Employers who want durable staffing relationships benefit from lower grievance risk and better retention. Learn more about our overseas recruitment process, or contact VNVNEPAL to partner on fair hiring from Nepal.",
    ],
  },
  {
    slug: "national-policy-dialogue",
    title: "National Policy Dialogue on Labour Migration",
    author: "vnv",
    datePublished: "2024-07-16",
    excerpt:
      "Vision & Value joined policymakers and agencies at the national dialogue on safe labour migration.",
    body: [
      "Vision & Value Overseas (VNVNEPAL) participated in a national policy dialogue on labour migration, joining policymakers, practitioners and fellow agencies to discuss safer, fairer overseas employment for Nepali workers.",
      "Dialogues of this kind surface practical issues: documentation bottlenecks, candidate protection, destination-country coordination and the cost of informal recruitment. Our contribution reflects day-to-day experience placing workers across Asia, the Middle East and Europe under a licensed, ethical model.",
      "We will keep translating policy conversations into operational practice — clearer counselling, stronger compliance checks and employer partnerships that reject fee-based hiring. Stakeholders who want to collaborate on responsible recruitment can reach our Kathmandu team.",
    ],
  },
];

export const jobSectors = [
  { name: "Automotive", count: 0 },
  { name: "Hotel / Hospitality", count: 14 },
  { name: "Medical / Hospital", count: 0 },
  { name: "Fitness & wellness", count: 0 },
  { name: "Airlines", count: 0 },
  { name: "Cleaner", count: 0 },
  { name: "Barista", count: 0 },
  { name: "Catering", count: 11 },
  { name: "Restaurant", count: 5 },
  { name: "Fast Food Chain", count: 0 },
  { name: "Construction", count: 0 },
  { name: "Farm/Agriculture", count: 0 },
  { name: "Manufacturing", count: 0 },
  { name: "Engineering/Construction", count: 0 },
  { name: "Cruise Ship", count: 0 },
];

export const jobCountries = [
  { name: "Bahrain", count: 0 },
  { name: "Maldives", count: 0 },
  { name: "Qatar", count: 11 },
  { name: "UAE", count: 0 },
  { name: "Kuwait", count: 19 },
  { name: "Saudi Arabia", count: 0 },
  { name: "Oman", count: 0 },
  { name: "United Kingdom", count: 0 },
  { name: "Malaysia", count: 0 },
];

export const jobs = [
  {
    title: "Waiter / Waitress",
    company: "Atlantis Hospitality Group",
    sector: "Hotel / Hospitality",
    country: "Kuwait",
    vacancies: 25,
    salary: "KWD 150 + Food & Accommodation",
  },
  {
    title: "Commis Chef",
    company: "Gulf Catering Services",
    sector: "Catering",
    country: "Qatar",
    vacancies: 18,
    salary: "QAR 1,800 + Benefits",
  },
  {
    title: "Housekeeping Attendant",
    company: "Millennium Hotels & Resorts",
    sector: "Hotel / Hospitality",
    country: "Kuwait",
    vacancies: 30,
    salary: "KWD 130 + Overtime",
  },
  {
    title: "Barista",
    company: "Sea Zen Coffee Company",
    sector: "Restaurant",
    country: "Qatar",
    vacancies: 12,
    salary: "QAR 1,600 + Tips",
  },
  {
    title: "Kitchen Steward",
    company: "Radisson Blu",
    sector: "Catering",
    country: "Kuwait",
    vacancies: 20,
    salary: "KWD 120 + Duty Meals",
  },
  {
    title: "Front Office Receptionist",
    company: "Hyatt Group",
    sector: "Hotel / Hospitality",
    country: "Qatar",
    vacancies: 6,
    salary: "QAR 2,400 + Accommodation",
  },
];

export const footerLinks = [
  {
    label: "Human Trafficking & Modern Slavery Act",
    to: "/about",
  },
  {
    label: "Department of Foreign Employment",
    href: "https://dofe.gov.np",
  },
  {
    label: "Ethical Recruitment",
    to: "/ethical-recruitment",
  },
  {
    label: "Privacy Policy",
    to: "/privacy",
  },
  {
    label: "Terms & Conditions",
    to: "/terms",
  },
] as const;

export const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "News & Updates", to: "/news" },
  { label: "Contact Us", to: "/contact" },
  { label: "VNV Gallery", to: "/awards" },
  { label: "Stakeholders", to: "/about" },
  { label: "Awards & Recognition", to: "/awards" },
] as const;
