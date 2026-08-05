/** Dummy multi-page Citizen Charter (नागरिक बडापत्र) for the document viewer. */

export type CharterRow = {
  sn: string;
  service: string;
  documents: string;
  fee: string;
  duration: string;
  responsible: string;
  remarks?: string;
};

export type CharterDocumentPage = {
  id: string;
  pageNo: number;
  rows: CharterRow[];
};

const SERVICES: Omit<CharterRow, "sn">[] = [
  {
    service: "व्यक्तिगत श्रम स्वीकृति (Individual Labour Approval)",
    documents: "पासपोर्ट, भिसा, स्वास्थ्य परीक्षण, अभिमुखीकरण प्रमाणपत्र, बीमा",
    fee: "रू. २,०००",
    duration: "सोही दिन",
    responsible: "व्यक्तिगत अनुमति शाखा",
    remarks: "FEIMS मार्फत आवेदन",
  },
  {
    service: "संस्थागत श्रम स्वीकृति / स्टिकर (Institutional Labour Approval)",
    documents: "माग पत्र, करार, पासपोर्ट सूची, अभिमुखीकरण, बीमा",
    fee: "निर्धारित शुल्क",
    duration: "सोही दिन",
    responsible: "वैदेशिक रोजगार स्वीकृति शाखा",
  },
  {
    service: "भर्ना अनुमति नवीकरण (Recruitment Agency Licence Renewal)",
    documents: "नवीकरण फारम, बैंक ग्यारेन्टी, लेखापरीक्षण प्रतिवेदन",
    fee: "ऐन/नियम अनुसार",
    duration: "३ कार्य दिन",
    responsible: "संगठन दर्ता शाखा",
  },
  {
    service: "नयाँ भर्ना एजेन्सी इजाजतपत्र (New Agency Licence)",
    documents: "कम्पनी दर्ता, पूँजी प्रमाण, कार्यालय विवरण, बैंक ग्यारेन्टी",
    fee: "ऐन/नियम अनुसार",
    duration: "१५ कार्य दिन",
    responsible: "संगठन दर्ता शाखा",
  },
  {
    service: "माग पत्रको पूर्व-स्वीकृति (Demand Letter Pre-approval)",
    documents: "माग पत्र, रोजगारदाता विवरण, करारको मस्यौदा",
    fee: "निःशुल्क",
    duration: "७ कार्य दिन",
    responsible: "स्वीकृति शाखा",
  },
  {
    service: "अभिमुखीकरण केन्द्र अनुमति (Orientation Centre Permit)",
    documents: "भवन विवरण, प्रशिक्षक सूची, पाठ्यक्रम",
    fee: "निर्धारित",
    duration: "१० कार्य दिन",
    responsible: "अनुगमन शाखा",
  },
  {
    service: "बीमा कम्पनी सूचीकरण (Insurance Company Listing)",
    documents: "इजाजतपत्र, बीमा उत्पादन विवरण",
    fee: "निःशुल्क",
    duration: "७ कार्य दिन",
    responsible: "अनुगमन शाखा",
  },
  {
    service: "उजुरी दर्ता (Complaint Registration)",
    documents: "नागरिकता, करार, भुक्तानी रसिद, सम्बन्धित प्रमाण",
    fee: "निःशुल्क",
    duration: "सोही दिन",
    responsible: "मुद्दा तथा अनुसन्धान शाखा",
    remarks: "ujuri.dofe.gov.np",
  },
  {
    service: "मुद्दा अनुसन्धान / कारबाही (Case Investigation)",
    documents: "उजुरी फाइल, प्रमाण कागजात",
    fee: "निःशुल्क",
    duration: "ऐन अनुसार",
    responsible: "मुद्दा तथा अनुसन्धान शाखा",
  },
  {
    service: "राहत तथा उद्धार समन्वय (Relief & Rescue Coordination)",
    documents: "पासपोर्ट प्रतिलिपि, घटना विवरण, सम्पर्क",
    fee: "निःशुल्क",
    duration: "आवश्यकता अनुसार",
    responsible: "राहत तथा उद्धार शाखा",
  },
  {
    service: "G2G / EPS सम्बन्धित सेवा (G2G / EPS Services)",
    documents: "योग्यता प्रमाण, पासपोर्ट, स्वास्थ्य जाँच",
    fee: "कार्यक्रम अनुसार",
    duration: "कार्यक्रम तालिका अनुसार",
    responsible: "EPS / G2G शाखा",
  },
  {
    service: "श्रम डेस्क सेवा — TIA (Labour Desk — Airport)",
    documents: "श्रम स्वीकृति, पासपोर्ट, टिकट",
    fee: "निःशुल्क",
    duration: "सोही समय",
    responsible: "श्रम डेस्क, त्रिभुवन विमानस्थल",
  },
  {
    service: "इजाजतपत्र निलम्बन / रद्द सिफारिस",
    documents: "अनुगमन प्रतिवेदन, उजुरी अभिलेख",
    fee: "निःशुल्क",
    duration: "१५ कार्य दिन",
    responsible: "अनुगमन शाखा",
  },
  {
    service: "सूचना / प्रमाणित प्रतिलिपि जारी",
    documents: "निवेदन, नागरिकता, सम्बन्धित दर्ता नं.",
    fee: "रू. १० प्रति पृष्ठ",
    duration: "३ कार्य दिन",
    responsible: "प्रशासन शाखा",
  },
  {
    service: "FEIMS खाता / प्राविधिक सहयोग",
    documents: "एजेन्सी इजाजतपत्र, आधिकारिक निवेदन",
    fee: "निःशुल्क",
    duration: "२ कार्य दिन",
    responsible: "सूचना प्रविधि शाखा",
  },
  {
    service: "स्वास्थ्य संस्था सूचीकरण",
    documents: "स्वास्थ्य मन्त्रालय अनुमति, उपकरण विवरण",
    fee: "निःशुल्क",
    duration: "१० कार्य दिन",
    responsible: "अनुगमन शाखा",
  },
  {
    service: "करार प्रमाणीकरण सहयोग",
    documents: "करारको प्रति, पासपोर्ट, एजेन्सी पत्र",
    fee: "निःशुल्क",
    duration: "सोही दिन",
    responsible: "स्वीकृति शाखा",
  },
  {
    service: "शाखा कार्यालय सिफारिस (Butwal / Biratnagar / Pokhara / Surkhet)",
    documents: "स्थानीय निवेदन, सम्बन्धित कागजात",
    fee: "निःशुल्क",
    duration: "५ कार्य दिन",
    responsible: "श्रम तथा रोजगार कार्यालय",
  },
  {
    service: "सार्वजनिक सूचना / प्रेस विज्ञप्ति प्रकाशन",
    documents: "आन्तरिक स्वीकृति",
    fee: "—",
    duration: "आवश्यकता अनुसार",
    responsible: "सूचना अधिकारी",
  },
  {
    service: "अभिलेख हेर्ने / प्रतिलिपि माग",
    documents: "निवेदन, परिचय प्रमाण",
    fee: "रू. ५–२०",
    duration: "३ कार्य दिन",
    responsible: "प्रशासन शाखा",
  },
];

const ROWS_PER_PAGE = 4;

function chunkRows(): CharterDocumentPage[] {
  const pages: CharterDocumentPage[] = [];
  for (let i = 0; i < SERVICES.length; i += ROWS_PER_PAGE) {
    const slice = SERVICES.slice(i, i + ROWS_PER_PAGE);
    const pageNo = pages.length + 1;
    pages.push({
      id: `charter-page-${pageNo}`,
      pageNo,
      rows: slice.map((row, idx) => ({
        ...row,
        sn: String(i + idx + 1),
      })),
    });
  }
  // Pad to 15 pages like the live portal viewer (1/15)
  while (pages.length < 15) {
    const pageNo = pages.length + 1;
    const base = SERVICES[(pageNo - 1) % SERVICES.length]!;
    pages.push({
      id: `charter-page-${pageNo}`,
      pageNo,
      rows: [
        {
          ...base,
          sn: String(SERVICES.length + pageNo),
          service: `${base.service} (परिशिष्ट ${pageNo})`,
          remarks: "नमूना / dummy page",
        },
      ],
    });
  }
  return pages;
}

export const CITIZEN_CHARTER_PAGES: CharterDocumentPage[] = chunkRows();

export const CITIZEN_CHARTER_META = {
  titleNe: "नागरिक बडापत्र",
  titleEn: "Citizen Charter",
  office: "वैदेशिक रोजगार विभाग",
  ministry: "युवा तथा खेलकुद मन्त्रालय / श्रम, रोजगार तथा सामाजिक सुरक्षा",
  address: "टाहाचल, काठमाडौं",
};
