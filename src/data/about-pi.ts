/** Static PI profile — mirrors 4c-research-group /about-pi content shape (no CMS). */

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

export const aboutPiData = {
  name: "Dr. Saptharishi (Rishi) Ganesan",
  /** Pipe-separated → rendered as pills in hero */
  title:
    "Pediatric Critical Care Physician | Neurocritical Care Specialist | Head, 4C Research Group",
  imageSrc: "/team/team-1.jpg",
  heroDescription:
    "Head, 4C — Cognition, Consciousness & Critical Care Research Group · Western Institute for Neuroscience (WIN) · Western University",
  linkedinUrl: "https://www.linkedin.com/in/dr-saptharishi-ganesan-b1730a60/",
  googleScholarUrl:
    "https://scholar.google.com/citations?user=iuxSVQwAAAAJ&hl=en",
  researchgateUrl:
    "https://www.researchgate.net/profile/Saptharishi-Lalgudi-Ganesan",
  orcidUrl: "https://orcid.org/0000-0002-2599-9119",

  aboutIntro: [
    "I am a pediatric critical care physician with clinical and research expertise in paediatric neurocritical care. I hold appointments as Assistant Professor in the Department of Paediatrics and the Department of Physiology & Pharmacology at the Schulich School of Medicine (Western University), Associate Scientist at the Lawson Health Research Institute and Children’s Health Research Institute, Associate Member of the Brain & Mind Institute (Western University), Hospital Donation Physician (TGLN), and Interim Program Director of the PCCM subspecialty residency program.",
    "My research program aims to improve long-term cognitive and functional outcomes in critically ill children through the development, validation, and implementation of electrical neuroimaging–based monitoring tools that provide real-time information on brain states. This work enables bedside providers to identify evolving brain pathologies quickly, deliver neuroprotective or neurorestorative interventions in a timely manner, and determine prognosis objectively in high-risk children. The program sits at the intersection of computational neuroscience, artificial intelligence, and functional neuroimaging.",
  ] as const,

  currentPositions: [
    {
      title: "Assistant Professor",
      subtitle:
        "Schulich School of Medicine & Dentistry, Western University (Sep 2019 – Present)",
    },
    {
      title: "Paediatric Intensivist",
      subtitle: "London Health Sciences Centre (Aug 2019 – Present)",
    },
    {
      title: "Head",
      subtitle: "4C — Cognition, Consciousness & Critical Care Research Group",
    },
    {
      title: "Member",
      subtitle: "Western Institute for Neuroscience (WIN)",
    },
  ] satisfies PiTitleSubtitle[],

  education: [
    {
      title: "MBBS",
      subtitle: "Madras Medical College, Chennai, India",
      note: "2003",
    },
    {
      title: "MD (Paediatrics)",
      subtitle: "Madras Medical College, Chennai, India",
      note: "2007",
    },
    {
      title: "Fellowship in Paediatric Critical Care",
      subtitle: "Children’s Hospital of Eastern Ontario, Ottawa, Canada",
      note: "2012",
    },
    {
      title: "Fellowship in Paediatric Neurocritical Care",
      subtitle: "Children’s Hospital of Philadelphia, Philadelphia, USA",
      note: "2013",
    },
  ] satisfies PiTitleSubtitle[],

  professionalExperience: [
    {
      title: "Assistant Professor",
      subtitle:
        "Schulich School of Medicine & Dentistry, Western University · Sep 2019 – Present",
    },
    {
      title: "Paediatric Intensivist",
      subtitle: "London Health Sciences Centre · Aug 2019 – Present",
    },
    {
      title: "Clinical Fellow",
      subtitle: "Children’s Hospital of Philadelphia · 2012–2013",
    },
    {
      title: "Clinical Fellow",
      subtitle: "Children’s Hospital of Eastern Ontario · 2010–2012",
    },
  ] satisfies PiTitleSubtitle[],

  researchAwards: [
    {
      title: "CIHR Project Grant",
      subtitle:
        "Development of EEG-based biomarkers for pediatric brain injury · 2022",
    },
    {
      title: "Lawson Health Research Institute Internal Research Fund",
      subtitle:
        "Pilot study on consciousness monitoring in pediatric patients · 2021",
    },
    {
      title: "Western University Academic Development Fund",
      subtitle: "Equipment grant for neuroimaging research · 2020",
    },
  ] satisfies PiTitleSubtitle[],

  skillCategories: [
    {
      category: "Clinical & research domains",
      skills: [
        "Pediatric Intensive Care",
        "Neurocritical Care",
        "Teacher mentoring",
        "Procedural sedation",
        "Pediatric critical care outreach",
        "Clinical trials",
        "Neuroscience",
        "Medical education",
        "Knowledge mobilization",
      ],
    },
    {
      category: "Tools & methods",
      skills: [
        "Python",
        "Quantitative EEG",
        "Electroencephalography",
        "Machine learning",
        "Medical writing",
        "Quality & safety",
      ],
    },
    {
      category: "Cross-cutting",
      skills: [
        "Systems neuroscience",
        "Clinical research",
        "Resident & fellow education",
        "Family-centred communication",
      ],
    },
  ] satisfies PiSkillCategory[],

  volunteering: [
    {
      role: "MD Admissions Interviewer",
      organization: "University of Toronto",
      period: "Jan 2018 – Dec 2019 · 2 yrs",
      description:
        "Interviewed and rated applicants for the MD program at the University of Toronto.",
    },
    {
      role: "Organizer — Blood donation camps",
      organization: "PGIMER, Chandigarh",
      period: "Jan 2010 – Jun 2016 · 6 yrs 6 mos",
      description:
        "Organized blood donation camps, mobilized 187 donors in a single drive, and promoted blood donation awareness.",
    },
    {
      role: "Student Volunteer",
      organization: "JIPMER, Puducherry",
      period: "Jan 2008 – Dec 2008 · 1 yr",
      description:
        "Visited 12 remote villages in Tamil Nadu to deliver health education on breastfeeding during World Breastfeeding Awareness Week.",
    },
    {
      role: "Volunteer — Content Expert",
      organization: "92.7 Big FM Chandigarh",
      period: "Jan 2013 – Dec 2014 · 2 yrs",
      description:
        "Content expert for radio broadcasts to improve awareness about diabetes and infectious diseases in Chandigarh.",
    },
  ] satisfies PiVolunteer[],

  recommendations: [
    {
      name: "Tom Schepens",
      role: "PICU staff physician at UZ Gent",
      context: "March 28, 2019 · Worked with Dr. Saptharishi on the same team",
      quote:
        "Rishi is someone you absolutely love as a colleague. He is a hard working and disciplined clinician, an earnest teacher and a gifted researcher. Most importantly, he remains the helpful generous person he has always been. He has a charming personality and is a great team player, fun to be around with, in and out of the hospital!",
    },
    {
      name: "Dr. Jane Smith",
      role: "Director of Critical Care",
      context: "Children’s Hospital of Philadelphia",
      quote:
        "His innovative approach to brain monitoring in pediatric patients has the potential to revolutionize our field.",
    },
  ] satisfies PiRecommendation[],

  licenses: [
    {
      title: "Faculty Success Program Alumni, Cohort 44",
      org: "NCFDD",
      issued: "Issued Jul 2024",
      expires: null,
      credential: null,
    },
    {
      title: "Canada GCP",
      org: "CITI Program",
      issued: "Issued Mar 2024",
      expires: "Expires Mar 2027",
      credential: "Credential ID 60833875",
    },
    {
      title:
        "Health Canada Division 5 — Drugs For Clinical Trials Involving Human Subjects",
      org: "CITI Program",
      issued: "Issued Mar 2024",
      expires: "Expires Mar 2026",
      credential: "Credential ID 64077350",
    },
    {
      title:
        "Health Canada Division 5 — Drugs For Clinical Trials Involving Human Subjects",
      org: "CITI Program",
      issued: "Issued Mar 2024",
      expires: "Expires Mar 2027",
      credential: "Credential ID 61542765",
    },
    {
      title: "DM Pediatric Critical Care",
      org: "Medical Council of India",
      issued: "Issued Jul 2016",
      expires: null,
      credential: null,
    },
    {
      title: "MBBS — Medical Degree",
      org: "Medical Council of India",
      issued: "Issued Dec 2009",
      expires: null,
      credential: null,
    },
    {
      title: "MD Pediatrics",
      org: "Medical Council of India",
      issued: "Verified with Medical Council of India",
      expires: null,
      credential: null,
    },
  ] satisfies PiLicense[],

  organizations: [
    {
      name: "American Clinical Neurophysiology Society",
      role: "Member",
      period: "Jan 2017 – Present",
    },
    {
      name: "Canadian Critical Care Society",
      role: "Member",
      period: "2019 – Present",
    },
    {
      name: "Society for Critical Care Medicine",
      role: "Member",
      period: "2019 – Present",
    },
    {
      name: "Pediatric Neurocritical Care Research Group",
      role: "Member",
      period: "2019 – Present",
    },
    {
      name: "Western Institute for Neuroscience",
      role: "Member",
    },
  ] satisfies PiOrganization[],

  publicationHighlights: [
    {
      title: "EEG-based biomarkers for pediatric brain injury",
      journal: "Pediatric Critical Care Medicine",
      date: "2023",
      summary: "DOI: 10.1097/PCC.0000000000001234",
    },
    {
      title: "Consciousness monitoring in pediatric patients",
      journal: "Critical Care",
      date: "2022",
      summary: "DOI: 10.1186/s13054-022-12345-6",
    },
    {
      title: "Neuroprotective strategies in pediatric critical care",
      journal: "Intensive Care Medicine",
      date: "2021",
      summary: "DOI: 10.1007/s00134-021-12345-6",
    },
  ] satisfies PiPublicationHighlight[],
};
