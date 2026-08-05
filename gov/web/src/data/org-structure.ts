/**
 * Dummy organisational chart for the Department of Foreign Employment.
 * Mirrors the printed chart layout on dofe.gov.np/pages/structure:
 * DG → DDG → six horizontal sections → vertically stacked units.
 */

export type OrgNode = {
  id: string;
  title: string;
  /** Civil-service grade / post code shown under the title */
  code?: string;
  /** Optional English label for search / detail panel */
  titleEn?: string;
  /** Optional description shown when a node is selected */
  description?: string;
  /** How immediate children are laid out (default: horizontal) */
  childLayout?: "horizontal" | "vertical";
  children?: OrgNode[];
};

export const ORG_STRUCTURE_META = {
  documentTitle: "वैदेशिक रोजगार विभागको संगठन संरचना",
  documentTitleEn: "Organization Structure of the Department of Foreign Employment",
  office: "वैदेशिक रोजगार विभाग",
  ministry: "युवा तथा खेलकुद, श्रम तथा रोजगार मन्त्रालय",
  note: "Dummy organisational data for demonstration — positions and codes are illustrative.",
};

export const ORG_STRUCTURE: OrgNode = {
  id: "dg",
  title: "महानिर्देशक",
  titleEn: "Director General",
  code: "(रा.प.विशिष्ट)-१",
  description:
    "Leads the Department of Foreign Employment and oversees all divisions, sections and labour desks.",
  childLayout: "vertical",
  children: [
    {
      id: "ddg",
      title: "उप-महानिर्देशक",
      titleEn: "Deputy Director General",
      code: "(रा.प.प्रथम)-१",
      description: "Coordinates day-to-day operations across the six main sections under the Director General.",
      childLayout: "horizontal",
      children: [
        {
          id: "admin",
          title: "प्रशासन तथा योजना शाखा",
          titleEn: "Administration and Planning Section",
          code: "(रा.प.प्रथम)-१",
          description: "Human resources, planning, procurement and institutional registration.",
          childLayout: "vertical",
          children: [
            {
              id: "admin-reg",
              title: "संस्था दर्ता तथा समन्वय शाखा",
              titleEn: "Organization Registration & Coordination",
              code: "(रा.प.द्वितीय)-१",
              description: "Licence issuance, renewal and coordination with recruiting agencies.",
            },
            {
              id: "admin-finance",
              title: "आर्थिक प्रशासन शाखा",
              titleEn: "Financial Administration Section",
              code: "(रा.प.द्वितीय)-१",
              description: "Budget, accounts, audit coordination and financial reporting.",
            },
            {
              id: "admin-plan",
              title: "योजना तथा अनुगमन इकाई",
              titleEn: "Planning & Monitoring Unit",
              code: "(रा.प.तृतीय)-२",
              description: "Annual plans, progress reporting and internal performance monitoring.",
            },
            {
              id: "admin-store",
              title: "जिन्सी तथा खरिद इकाई",
              titleEn: "Store & Procurement Unit",
              code: "(रा.प.तृतीय)-२",
              description: "Procurement, store management and logistics support.",
            },
          ],
        },
        {
          id: "permit",
          title: "श्रम स्वीकृति शाखा",
          titleEn: "Labour Approval Section",
          code: "(रा.प.प्रथम)-१",
          description: "Institutional and individual labour approval for foreign employment.",
          childLayout: "vertical",
          children: [
            {
              id: "permit-individual",
              title: "व्यक्तिगत श्रम स्वीकृति शाखा",
              titleEn: "Individual Labour Approval Section",
              code: "(रा.प.द्वितीय)-२",
              description: "Processes individual labour permits through FEIMS.",
            },
          ],
        },
        {
          id: "relief",
          title: "राहत तथा उद्धार शाखा",
          titleEn: "Relief and Rescue Section",
          code: "(रा.प.प्रथम)-१",
          description: "Rescue of stranded workers and relief coordination with the Board and missions.",
          childLayout: "vertical",
          children: [
            {
              id: "relief-rescue",
              title: "उद्धार समन्वय इकाई",
              titleEn: "Rescue Coordination Unit",
              code: "(रा.प.द्वितीय)-१",
              description: "Coordinates rescue with missions, airlines and destination authorities.",
            },
            {
              id: "relief-aid",
              title: "राहत वितरण इकाई",
              titleEn: "Relief Distribution Unit",
              code: "(रा.प.तृतीय)-२",
              description: "Processes compensation and relief claims for workers and families.",
            },
          ],
        },
        {
          id: "case",
          title: "मुद्दा तथा अनुसन्धान शाखा",
          titleEn: "Investigation and Case Section",
          code: "(रा.प.प्रथम)-१",
          description: "Complaint registration, investigation and case filing under the Foreign Employment Act.",
          childLayout: "vertical",
          children: [
            {
              id: "case-complaint",
              title: "उजुरी तथा अनुसन्धान इकाई",
              titleEn: "Complaint & Investigation Unit",
              code: "(रा.प.द्वितीय)-२",
              description: "Handles ujuri.dofe.gov.np complaints and case dossiers.",
            },
          ],
        },
        {
          id: "monitor",
          title: "अनुगमन तथा अभिमुखीकरण शाखा",
          titleEn: "Monitoring and Orientation Section",
          code: "(रा.प.प्रथम)-१",
          description: "Monitors agencies, orientation centres and G2G facilitation.",
          childLayout: "vertical",
          children: [
            {
              id: "monitor-agency",
              title: "संस्था अनुगमन इकाई",
              titleEn: "Institution Monitoring Unit",
              code: "(रा.प.द्वितीय)-१",
              description: "Field monitoring of recruiting agencies and related institutions.",
            },
            {
              id: "monitor-g2g",
              title: "G2G / अभिमुखीकरण इकाई",
              titleEn: "G2G / Orientation Unit",
              code: "(रा.प.द्वितीय)-१",
              description: "G2G (Israel and others) facilitation and orientation oversight.",
            },
          ],
        },
        {
          id: "it-eps",
          title: "सूचना प्रविधि तथा EPS शाखा",
          titleEn: "Information Technology & EPS Section",
          code: "(रा.प.प्रथम)-१",
          description: "FEIMS, departmental IT systems and EPS Korea programme.",
          childLayout: "vertical",
          children: [
            {
              id: "it-feims",
              title: "FEIMS / सूचना प्रविधि इकाई",
              titleEn: "FEIMS / IT Unit",
              code: "(रा.प.द्वितीय)-१",
              description: "Operates FEIMS, websites and departmental databases.",
            },
            {
              id: "eps-korea",
              title: "EPS Korea इकाई",
              titleEn: "EPS Korea Unit",
              code: "(रा.प.द्वितीय)-१",
              description: "EPS-TOPIK, point-based selection and Korea-bound worker facilitation.",
            },
            {
              id: "it-support",
              title: "सहायक तथा सहयोगी कर्मचारी",
              titleEn: "Support Staff Pool",
              code: "(सहायक कम्प्युटर अपरेटर)-३\n(कार्यालय सहयोगी)-४\n(हल्का सवारी चालक)-२\n(माली)-१",
              description: "Shared support posts attached to the IT and EPS section (illustrative).",
            },
          ],
        },
      ],
    },
  ],
};

/** Flatten tree for search / selection lookup */
export function flattenOrg(node: OrgNode, depth = 0): Array<OrgNode & { depth: number }> {
  const self = { ...node, depth };
  const kids = (node.children ?? []).flatMap((c) => flattenOrg(c, depth + 1));
  return [self, ...kids];
}

export function findOrgNode(node: OrgNode, id: string): OrgNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findOrgNode(child, id);
    if (found) return found;
  }
  return null;
}

export function collectDescendantIds(node: OrgNode): string[] {
  const ids = [node.id];
  for (const child of node.children ?? []) {
    ids.push(...collectDescendantIds(child));
  }
  return ids;
}
