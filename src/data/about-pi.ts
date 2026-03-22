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
    "Pediatric Critical Care Physician | Neurocritical Care Specialist",
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
    "I am a pediatric critical care physician with clinical and research expertise in Paediatric Neurocritical Care. I hold the following appointments: Assistant Professor in the Department of Paediatrics and the Dept. of Physiology & Pharmacology at the Schulich School of Medicine (Western University), Associate Scientist at the Lawson Health Research Institute, Associate Scientist at the Children’s Health Research Institute, Associate Member of the Brain & Mind Institute (Western University), Hospital Donation Physician (TGLN), and Interim Program Director (PCCM Sub-specialty residency program).",
    "My research program aims to improve the long-term cognitive and functional outcomes in critically ill children through the development, validation and implementation of electrical neuroimaging-based monitoring tools that provide real-time information regarding brain states. This program would enable bedside critical care providers to identify evolving brain pathologies quickly, deliver neuroprotective or neurorestorative interventions in a timely manner and determine prognosis objectively in high-risk critically ill children. This inter-disciplinary research program sits at the intersection of computational neuroscience, artificial intelligence and functional neuroimaging.",
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
      title: "Clinical-research fellowship",
      subtitle:
        "Pediatric Critical Care Medicine Residency Program, University of Toronto (2017–2018)",
    },
    {
      title: "Advanced fellowship",
      subtitle: "Pediatric Neurocritical Care, University of Toronto (2016–2017)",
    },
    {
      title: "Doctorate in Medicine (D.M.), Pediatric Critical Care",
      subtitle: "PGIMER, Chandigarh, India (2013–2016)",
      note: "Outstanding — Best resident — Bronze medal",
    },
    {
      title: "M.D., Pediatrics Residency Program",
      subtitle: "PGIMER, Chandigarh, India (2010–2012)",
      note: "Outstanding — Best resident — Bronze medal",
    },
    {
      title: "MBBS, Medicine",
      subtitle: "JIPMER, Puducherry (2004–2009)",
      note: "Outstanding — Best outgoing graduate\nPresident, JIPMER Students Association (2007); Secretary, JSA-RDA joint committee for Student Rights; President, Consortium of Medical Students Against Reservation",
    },
  ] satisfies PiTitleSubtitle[],

  professionalExperience: [
    {
      title: "Assistant Professor",
      subtitle: "Western University (Aug 2019 – Present)",
    },
    {
      title: "Program Director",
      subtitle: "Western University (Jun 2020 – Aug 2022)",
    },
    {
      title: "Paediatric Intensivist",
      subtitle: "London Health Sciences Centre (Aug 2019 – Present)",
    },
    {
      title: "Assistant Staff Physician",
      subtitle: "The Hospital for Sick Children, Toronto (Sep 2018 – Jun 2019)",
    },
    {
      title:
        "Clinical Neurocritical Care Fellow & RESTRACOMP/C-BMH Integrative Research Fellow",
      subtitle: "SickKids, Toronto (Jul 2017 – Sep 2018)",
    },
    {
      title: "Neurocritical Care Specialty Fellow",
      subtitle: "SickKids, Toronto (Jul 2016 – Jun 2017)",
    },
    {
      title: "Critical Care Fellow",
      subtitle: "PGIMER, Chandigarh (Jul 2013 – Jun 2016)",
    },
    {
      title: "Senior Resident Physician in Pediatric Emergency Medicine",
      subtitle: "PGIMER, Chandigarh (Jan 2013 – Jun 2013)",
    },
    {
      title: "Resident Physician",
      subtitle: "PGIMER, Chandigarh (Jan 2010 – Dec 2012)",
    },
    {
      title: "Internship",
      subtitle: "JIPMER, Puducherry (Jan 2009 – Dec 2009)",
    },
  ] satisfies PiTitleSubtitle[],

  researchAwards: [
    {
      title: "Research focus",
      subtitle:
        "Early identification and mitigation of neurological insults in critically ill children, quantitative EEG, systems neuroscience, and improving long-term quality of life in ICU survivors.",
    },
    {
      title: "Publication",
      subtitle:
        "Published research on healthcare associated infections in critically ill children, including a validated risk score (Journal of Critical Care).",
    },
    {
      title: "Awards",
      subtitle:
        "Recipient of the S. T. Achar award, IJP Best Thesis award, and Global Health award for research excellence.",
    },
    {
      title: "Teaching",
      subtitle:
        "Consistently evaluated as a ‘teacher par excellence’ by trainees.",
    },
  ] satisfies PiTitleSubtitle[],

  skillCategories: [
    {
      category: "Industry knowledge",
      skills: [
        "Pediatric Intensive Care",
        "Neurocritical Care",
        "Teacher Mentoring",
        "Procedural Sedation",
        "Pediatric Critical Care Outreach",
        "Pediatrics",
        "Critical Care",
        "Innovation",
        "Public Health",
        "Medical Education",
        "Medical Research",
        "Clinical Research",
        "Clinical Trials",
        "Neuroscience",
        "Medical Diagnostics",
        "Critical care neurophysiology",
        "Brain focused ICU care",
        "Medicine",
        "Acute Care",
        "Research",
        "Resident Education",
        "Fellow Education",
      ],
    },
    {
      category: "Tools & technologies",
      skills: [
        "Python (Programming Language)",
        "SPSS",
        "Quantitative EEG",
        "Electroencephalography",
        "Machine Learning",
        "Medical Writing",
        "Quality & Safety",
      ],
    },
    {
      category: "Other skills",
      skills: [
        "Systems Neuroscience",
        "Medical Diagnostics",
        "Medical Research",
        "Clinical Research",
        "Resident Education",
        "Fellow Education",
      ],
    },
  ] satisfies PiSkillCategory[],

  volunteering: [
    {
      role: "MD Admissions Interviewer",
      organization: "University of Toronto",
      period: "Jan 2018 – Dec 2019 · 2 yrs",
      description:
        "Interviewed and rated applicants for the MD program at University of Toronto.",
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
      issued: "",
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
  ] satisfies PiOrganization[],

  publicationHighlights: [
    {
      title:
        "Airway Pressure Release Ventilation in Pediatric Acute Respiratory Distress Syndrome. A Randomized Controlled Trial",
      journal: "American Journal of Respiratory & Critical Care Medicine (AJRCCM)",
      date: "Nov 1, 2018",
      summary:
        "A randomized controlled trial comparing APRV and conventional low–tidal volume ventilation in children with ARDS. The trial was terminated early due to higher mortality in the intervention arm. Ventilator-free days were similar, but APRV showed a trend toward higher mortality. Limitations should be considered while interpreting these results.",
    },
    {
      title:
        "Clinical profile of scrub typhus in children and its association with hemophagocytic lymphohistiocytosis.",
      journal: "Indian Pediatrics",
      date: "Aug 1, 2014",
      summary:
        "Study of children with scrub typhus and its association with hemophagocytic lymphohistiocytosis. Scrub typhus is a common cause of unexplained fever in children in northern India, and HLH can occasionally complicate scrub typhus.",
    },
    {
      title:
        "Hyperactivity, Unexplained Speech Delay, and Coarse Facies—Is It Sanfilippo Syndrome?",
      journal: "Journal of Child Neurology",
      date: "Jun 12, 2013",
      summary:
        "Case report of a girl with mucopolysaccharidosis-IIIB (Sanfilippo-B syndrome), highlighting the need to consider this diagnosis in children with unexplained speech delay and hyperactivity.",
    },
    {
      title:
        "Non-pharmacological Interventions in Hypertension: A Community-based Cross-over Randomized Controlled Trial",
      journal: "Indian Journal of Community Medicine",
      date: "Jul 1, 2011",
      summary:
        "Community-based cross-over RCT testing physical exercise, salt reduction, and yoga for controlling hypertension in young adults. All interventions were effective, with exercise being most effective.",
    },
    {
      title:
        "Community-based randomized controlled trial of non-pharmacological interventions in prevention and control of hypertension among young adults",
      journal: "Indian Journal of Community Medicine",
      date: "Oct 1, 2009",
      summary:
        "RCT measuring the efficacy of physical exercise, salt reduction, and yoga in lowering BP among young pre-hypertensives and hypertensives. All interventions were effective; exercise was most effective.",
    },
  ] satisfies PiPublicationHighlight[],
};
