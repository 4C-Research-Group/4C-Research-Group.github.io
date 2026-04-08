/** PI profile for /about-pi — built from `dr-ganesan.ts` (CV) with small static extras. */

import { drGanesanData as cv } from "./dr-ganesan";

export interface PiTitleSubtitle {
  title: string;
  subtitle: string;
  note?: string;
}

export interface PiVolunteer {
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface PiRecommendation {
  name: string;
  role: string;
  context: string;
  quote: string;
}

export interface PiLicense {
  title: string;
  org: string;
  issued: string;
  expires?: string | null;
  credential?: string | null;
}

export interface PiOrganization {
  name: string;
  role: string;
  period?: string;
}

export interface PiPublicationHighlight {
  title: string;
  journal: string;
  date: string;
  summary: string;
}

export interface PiSkillCategory {
  category: string;
  skills: string[];
}

export interface PiBiographical {
  legalName: string;
  practiceLines: string[];
  telephone: string;
  fax: string;
  emails: string[];
  administrativeAssistant: string;
  publishedAuthorLines: string[];
}

export interface PiLanguage {
  language: string;
  lines: string[];
}

export interface PiInvitedLecture {
  scope: string;
  year: string;
  title: string;
  detail: string;
}

export interface PiPeerReviewBlock {
  heading: string;
  items: string[];
}

/** Invited talks, languages, networks, and F–J CV text live at root of `drGanesanData`, not under `academicHistory`. */
type InvitedLectureJson = {
  year: number;
  title: string;
  conference?: string;
  role?: string;
  note?: string;
  award?: string;
};

const ah = cv.academicHistory;

function networkUrl(label: string): string | undefined {
  const n = cv.professionalNetworks?.find(
    (x) => x.network.toLowerCase() === label.toLowerCase(),
  );
  return n?.url;
}

function splitResearchStatement(text: string): readonly [string, string] {
  const k = text.indexOf("This inter-disciplinary");
  if (k <= 0) return [text, ""] as const;
  return [text.slice(0, k).trim(), text.slice(k).trim()] as const;
}

function parseVolunteersFromCvSection(cvFj: string): PiVolunteer[] | null {
  const marker = "Volunteer Work";
  const i = cvFj.indexOf(marker);
  if (i < 0) return null;
  let tail = cvFj.slice(i + marker.length).trimStart();
  const lines = tail.split("\n");
  const items: PiVolunteer[] = [];
  let idx = 0;
  while (idx < lines.length) {
    const line = lines[idx];
    const m = line.match(/^(\d{4}(?:\s*-\s*(?:Present|\d{4}))?)\s+/);
    if (!m) {
      idx += 1;
      continue;
    }
    const period = m[1]!.replace(/\s*-\s*/g, " – ");
    let rest = line.slice(m[0]!.length).trim().replace(/\t+/g, "\t");
    const tabParts = rest.split("\t").map((s) => s.trim()).filter(Boolean);
    const role = tabParts[0] ?? rest.slice(0, 120);
    let organization = tabParts.slice(1).join(" · ");
    const descParts: string[] = [];
    idx += 1;
    while (
      idx < lines.length &&
      lines[idx].trim() &&
      !/^\d{4}/.test(lines[idx]!)
    ) {
      descParts.push(lines[idx]!.trim());
      idx += 1;
    }
    const description = descParts.join(" ");
    if (!organization && description) organization = description;
    items.push({
      role,
      organization: organization || "—",
      period,
      description: description || organization || "",
    });
  }
  return items.length > 0 ? items : null;
}

const [aboutPara1, aboutPara2] = splitResearchStatement(ah.researchStatement);
const aboutIntro = [aboutPara1, aboutPara2].filter(Boolean);

const titlePills = [
  ...cv.positions.map((p) => p.title),
  ...(cv.degrees ?? []).slice(0, 2),
].join(" | ");

const heroBits: string[] = [];
for (const p of cv.positions) {
  const loc = "organization" in p ? p.organization : "";
  heroBits.push(loc ? `${p.title}, ${loc}` : p.title);
}
if (cv.crossAppointments?.length) {
  heroBits.push(`Cross appointments: ${cv.crossAppointments.join(", ")}`);
}
for (const a of cv.affiliations ?? []) {
  heroBits.push(`${a.role} — ${a.organization}`);
}

/** One line per role for the hero (easier to scan than a single run-on paragraph). */
const heroLines: readonly string[] = [
  "Head, 4C — Cognition, Consciousness & Critical Care Research Group · Western Institute for Neuroscience (WIN) · Western University",
  ...heroBits,
];

const currentPositions = [
  {
    title: "Head",
    subtitle:
      "4C — Cognition, Consciousness & Critical Care Research Group · Western University",
  },
  ...cv.positions.map((p) => ({
    title: p.title,
    subtitle: [("department" in p && p.department) || "", p.organization]
      .filter(Boolean)
      .join(" — "),
  })),
  ...(cv.crossAppointments?.length
    ? [
        {
          title: "Cross appointments",
          subtitle: cv.crossAppointments.join(", "),
        },
      ]
    : []),
  ...(cv.affiliations ?? []).map((a) => ({
    title: a.role,
    subtitle: a.organization,
  })),
] satisfies PiTitleSubtitle[];

const educationBlock = cv.education;
const education: PiTitleSubtitle[] = [
  ...educationBlock.postgraduateTraining.map((t) => ({
    title: t.title,
    subtitle: [
      t.institution,
      t.location,
      "duration" in t ? t.duration : "year" in t ? t.year : "",
    ]
      .filter(Boolean)
      .join(" · "),
  })),
  ...educationBlock.degrees.map((d) => ({
    title: [
      d.degree,
      "specialization" in d && d.specialization ? `(${d.specialization})` : "",
    ]
      .filter(Boolean)
      .join(" "),
    subtitle: [d.institution, d.location, d.year].filter(Boolean).join(" · "),
  })),
];

function employmentSubtitle(e: {
  duration?: string;
  organization?: string;
  location?: string;
  department?: string;
  details?: string;
}): string {
  const parts = [
    e.duration,
    e.department,
    e.organization,
    e.location,
    e.details,
  ].filter(Boolean);
  return parts.join(" · ");
}

const emp = cv.employment;
const professionalExperience: PiTitleSubtitle[] = [
  ...emp.academicAppointments.map((e) => ({
    title: e.title,
    subtitle: employmentSubtitle(e),
  })),
  ...emp.clinicalAppointments.map((e) => ({
    title: e.title,
    subtitle: employmentSubtitle(e),
  })),
  ...emp.researchAppointments.map((e) => ({
    title: e.role,
    subtitle: [
      "program" in e ? e.program : "",
      e.organization,
      e.location,
      e.duration,
    ]
      .filter(Boolean)
      .join(" · "),
  })),
];

const rec = cv.recognitions;
const researchAwards: PiTitleSubtitle[] = [
  ...rec.research.map((r) => ({
    title: r.title,
    subtitle: [
      "organization" in r ? r.organization : "",
      "details" in r && r.details ? r.details : "",
      "year" in r ? r.year : "duration" in r ? r.duration : "",
    ]
      .filter(Boolean)
      .join(" · "),
  })),
  ...rec.academic.map((r) => ({
    title: r.title,
    subtitle: [r.organization, "year" in r ? r.year : undefined]
      .filter(Boolean)
      .join(" · "),
  })),
];

const traineeScholarAwards: PiTitleSubtitle[] = rec.supervisor.map((s) => ({
  title: s.award,
  subtitle: [
    s.trainee,
    s.level,
    "duration" in s ? s.duration : "year" in s ? String(s.year) : "",
    "organization" in s ? s.organization : "",
  ]
    .filter(Boolean)
    .join(" · "),
}));

const leadershipDevelopmentAwards: PiTitleSubtitle[] = rec.leadership.map(
  (x) => ({
    title: x.title,
    subtitle: [x.year, x.amount, "details" in x ? x.details : ""]
      .filter(Boolean)
      .join(" · "),
  }),
);

type GrantLike = {
  title: string;
  role: string;
  funder: string;
  duration: string;
  type: string;
  amount: string;
  principalInvestigator?: string;
  component?: string;
  /** Full CV-style wording (from source CV); shown in full on About PI. */
  cvNarrative?: string;
};

function grantToCard(g: GrantLike): PiTitleSubtitle {
  if (g.cvNarrative?.trim()) {
    return {
      title: g.title,
      subtitle: "",
      note: g.cvNarrative.trim().replace(/\t/g, " "),
    };
  }
  return {
    title: g.title,
    subtitle: [
      g.role,
      g.funder,
      g.duration,
      g.type,
      g.amount,
      g.principalInvestigator ? `PI: ${g.principalInvestigator}` : "",
      g.component,
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

const grants = ah.researchAwards.peerReviewedGrants;
const grantsOngoing = grants.ongoing.map(grantToCard);
const grantsCompleted = grants.completed.map(grantToCard);

const bio = cv.biographicalInformation;
const biographical: PiBiographical = {
  legalName: bio.legalName,
  practiceLines: [
    bio.practiceLocation.hospital,
    [bio.practiceLocation.address, bio.practiceLocation.room].filter(Boolean).join(", "),
    `${bio.practiceLocation.city}, ${bio.practiceLocation.province} ${bio.practiceLocation.postalCode}`,
  ],
  telephone: bio.contact.telephone,
  fax: bio.contact.fax,
  emails: bio.contact.email,
  administrativeAssistant: `${bio.administrativeAssistant.name} · ${bio.administrativeAssistant.phone}`,
  publishedAuthorLines: bio.publishedAuthorNames.map((a) =>
    "note" in a && a.note
      ? `${a.name} (${a.note})`
      : "year" in a
        ? `${a.name} (${a.year})`
        : a.name,
  ),
};

const languages: PiLanguage[] = cv.languageProficiency.map((l) => ({
  language: l.language,
  lines: l.lines,
}));

function mapInvited(scope: string, e: InvitedLectureJson): PiInvitedLecture {
  return {
    scope,
    year: String(e.year),
    title: e.title,
    detail: [e.conference, e.role, e.note, e.award].filter(Boolean).join(" · "),
  };
}

const il = cv.invitedLecturesAndPresentations;
const invitedLectures: PiInvitedLecture[] = [
  ...il.international.map((e) => mapInvited("International", e)),
  ...il.national.map((e) => mapInvited("National", e)),
  ...il.regionalOrLocal.map((e) => mapInvited("Regional & local", e)),
];

const pr = cv.leadership.peerReview;
const peerReviewBlocks: PiPeerReviewBlock[] = [
  {
    heading: "Grant review",
    items: pr.grantReview.map(
      (x) =>
        `${"year" in x ? x.year : x.duration} · ${x.organization} — ${x.type}`,
    ),
  },
  {
    heading: "Editorial roles",
    items: pr.editorialBoards.map(
      (x) =>
        `${x.duration} · ${x.role} · ${x.journal}`,
    ),
  },
  {
    heading: "Journal peer review",
    items: pr.journalReviewer.map((x) => `${x.year} · ${x.journal}`),
  },
];

function leadershipRowSubtitle(e: {
  duration?: string;
  year?: string;
  role: string;
  committee?: string;
  organization?: string;
  program?: string;
  details?: string;
}): string {
  return [
    e.duration ?? e.year,
    e.role,
    e.committee,
    e.organization,
    e.program,
    e.details,
  ]
    .filter(Boolean)
    .join(" · ");
}

const lead = cv.leadership;
const committeesAndLeadership: PiOrganization[] = [
  ...lead.international.map((e) => ({
    name: [e.committee, e.organization].filter(Boolean).join(" — "),
    role: leadershipRowSubtitle(e),
    period: e.duration,
  })),
  ...lead.national.map((e) => ({
    name: [e.committee, e.organization].filter(Boolean).join(" — ") || "—",
    role: leadershipRowSubtitle(e),
    period: e.duration,
  })),
  ...lead.localRegional.map((e) => ({
    name: [e.committee, e.organization].filter(Boolean).join(" — ") || "—",
    role: leadershipRowSubtitle(e),
    period: e.duration ?? e.year,
  })),
];

const membershipsAll: PiOrganization[] = (lead.memberships ?? []).map((m) => ({
  name: m.organization,
  role: "Member",
  period: m.year,
}));

const cvFullTextSectionsFJ = cv.cvSectionsFThroughJFromTxt;

const skillCategories: PiSkillCategory[] = [
  {
    category: "Clinical & research focus",
    skills: [
      "Paediatric critical care medicine",
      "Paediatric neurocritical care",
      "Quantitative & critical care EEG",
      "Functional neuroimaging (fNIRS, fMRI)",
      "Delirium & disorders of consciousness",
      "Neuroprognostication",
      "Clinical trials methodology",
    ],
  },
  {
    category: "Cross-disciplinary appointments (from CV)",
    skills: cv.crossAppointments ?? [],
  },
  {
    category: "Tools & methods",
    skills: [
      "High-density EEG",
      "Machine learning for neurophysiology",
      "Multimodal neuroimaging integration",
      "Medical research & grant writing",
    ],
  },
];

const volunteering =
  parseVolunteersFromCvSection(cv.cvSectionsFThroughJFromTxt) ?? [
    {
      role: "MD Admissions (interviewer / rater)",
      organization: "Western University · University of Toronto",
      period: "2018 – Present (see CV)",
      description:
        "See leadership & volunteer section on the curriculum vitae for dated roles.",
    },
  ];

const recommendations: PiRecommendation[] = [
  {
    name: "Tom Schepens",
    role: "PICU staff physician at UZ Gent",
    context: "March 28, 2019 · Worked with Dr. Saptharishi on the same team",
    quote:
      "Rishi is someone you absolutely love as a colleague. He is a hard working and disciplined clinician, an earnest teacher and a gifted researcher. Most importantly, he remains the helpful generous person he has always been. He has a charming personality and is a great team player, fun to be around with, in and out of the hospital!",
  },
];

const licenses: PiLicense[] = educationBlock.certifications.map((c) => ({
  title: c.designation,
  org: c.authority,
  issued: c.duration ? `${c.duration}` : "Active",
  expires: null,
  credential: c.licenseNumber ? `Credential: ${c.licenseNumber}` : null,
}));

const organizations: PiOrganization[] = [
  ...committeesAndLeadership,
  ...membershipsAll,
];

/** Peer-reviewed list lives under `academicHistory.publications` in dr-ganesan.ts. */
const pubLines =
  (ah as typeof ah & { publications: { peerReviewed: string[] } }).publications
    ?.peerReviewed ?? [];
const publicationHighlights: PiPublicationHighlight[] = pubLines
  .slice(0, 6)
  .map((citation) => {
    const parts = citation.split(". ").filter(Boolean);
    const title =
      parts.length >= 2
        ? parts.slice(1, -1).join(". ").slice(0, 220) ||
          citation.slice(0, 160)
        : citation.slice(0, 160);
    const tail = parts.length >= 2 ? parts[parts.length - 1]! : "";
    return {
      title: title.length > 200 ? `${title.slice(0, 197)}…` : title,
      journal: tail.length > 120 ? `${tail.slice(0, 117)}…` : tail,
      date: "",
      summary: citation,
    };
  });

export const aboutPiData = {
  name: cv.name,
  title: titlePills,
  imageSrc: "/team/team-1.jpg",
  heroLines,
  linkedinUrl: networkUrl("LinkedIn"),
  googleScholarUrl: networkUrl("Google Scholar"),
  researchgateUrl: networkUrl("ResearchGate"),
  orcidUrl: "https://orcid.org/0000-0002-2599-9119",

  datePrepared: cv.datePrepared,

  biographical,

  aboutIntro,

  currentPositions,

  education,

  professionalExperience,

  researchAwards,

  traineeScholarAwards,

  leadershipDevelopmentAwards,

  grantsOngoing,

  grantsCompleted,

  languages,

  invitedLectures,

  peerReviewBlocks,

  cvFullTextSectionsFJ,

  skillCategories,

  volunteering,

  recommendations,

  licenses,

  committeesAndLeadership,

  membershipsAll,

  /** Committees + memberships (flat); prefer the split lists above for layout. */
  organizations,

  publicationHighlights,
};
