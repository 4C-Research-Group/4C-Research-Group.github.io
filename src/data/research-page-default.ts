import type {
  ResearchCollaboration,
  ResearchPageDocument,
  ResearchTheme,
} from "@/lib/research-page/types";

const defaultThemes: ResearchTheme[] = [
  {
    title:
      "Neuroprognostication in Acute Disorder of Consciousness after Acquired Brain Injury",
    description:
      "Developing and validating advanced methods to predict outcomes in patients with acquired brain injury and disorders of consciousness through systematic reviews, neuroimaging, and standardized protocols",
    icon: "Brain",
    gradient: "linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",
    projects: [
      {
        title: "Systematic Reviews on Neuroprognostication",
        description:
          "Comprehensive meta-analyses on prediction of neurological outcomes after pediatric cardiac arrest and brain injury",
        status: "Published",
        publications: [
          {
            title:
              "Prediction of good neurological outcome after return of circulation following paediatric cardiac arrest: A systematic review and meta-analysis",
            link: "https://www.sciencedirect.com/science/article/pii/S030095722400858X",
          },
        ],
      },
      {
        title: "PREDICT ABI Project",
        description:
          "Evaluating functional neuroimaging (fNIRS, hdEEG and fMRI) as a tool to detect covert consciousness and improve accuracy of outcome prediction in children with acquired brain injury",
        funder: "AMOSO",
        status: "Ongoing",
        team: ["Dr. Karen", "Research Team"],
      },
      {
        title: "Common Data Elements for Disorders of Consciousness",
        description:
          "Developing standardized data collection protocols for pediatric disorders of consciousness research to improve multicenter collaboration",
        status: "Active",
        publications: [
          {
            title:
              "Common Data Elements for Disorders of Consciousness: Recommendations from the Working Group in the Pediatric Population",
            link: "https://link.springer.com/article/10.1007/s12028-023-01870-7",
          },
        ],
      },
      {
        title: "Ethics of Research in Disorders of Consciousness",
        description:
          "Exploring ethical considerations and frameworks for conducting research in patients with severe disorders of consciousness",
        status: "In Progress",
      },
      {
        title: "GERMINAL Project",
        description:
          "Quality improvement project to improve caregiver satisfaction and reduce moral distress around complex decision making in children with devastating brain injuries",
        funder:
          "Radboud-Western Collaboration Fund & Dept. of Paediatrics Summer Studentship",
        status: "Active",
        team: ["Dr. Femke Bekius", "Research Team"],
      },
      {
        title:
          "Book Chapter: Approach to Child with Reduced Level of Consciousness",
        description:
          "Comprehensive clinical guide for assessing and managing children with altered consciousness",
        status: "Published",
        publications: [
          {
            title: "Approach to the Child with Reduced Level of Consciousness",
            link: "https://link.springer.com/chapter/10.1007/978-3-031-67951-3_49",
          },
        ],
      },
    ],
  },
  {
    title: "ICU Delirium & Sleep Deprivation",
    description:
      "Investigating brain connectivity changes, cognitive impacts, and detection methods for delirium and sleep deprivation in critical care settings using advanced neuroimaging and machine learning approaches",
    icon: "Activity",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #059669 100%)",
    projects: [
      {
        title: "TraNSIENCE",
        description:
          "Tracking brain connectivity in children at risk of delirium using advanced neuroimaging techniques. Over 70 children enrolled with multiple conference presentations",
        funder: "Brain Canada",
        status: "Active (70+ enrolments)",
        team: ["Srinidhi", "Brian", "Bobbi", "Research Team"],
      },
      {
        title: "Systematic Review: Functional Connectivity Changes in Delirium",
        description:
          "Comprehensive analysis of brain connectivity alterations associated with delirium in critically ill patients",
        status: "Manuscript in Preparation",
        team: ["Karen", "Research Team"],
      },
      {
        title:
          "Systematic Review: Functional Connectivity Changes in Acute Sleep Deprivation",
        description:
          "Analysis of brain connectivity changes associated with acute sleep deprivation in healthcare providers",
        status: "Accepted for Publication",
        publications: [
          {
            title:
              "Functional connectivity changes associated with acute sleep deprivation (Neurological Sciences)",
            link: "#",
          },
        ],
      },
      {
        title: "BrainCASH Study",
        description:
          "Brain connectivity in Acutely Sleep deprived Health care providers - investigating cognitive and neurological impacts",
        status: "Published Abstracts",
        team: ["Dr. Stephanie Hosang", "Research Team"],
      },
      {
        title: "BrainCASH-2 Study",
        description:
          "Cognitive function assessment in Acutely Sleep deprived healthcare providers - resident research project",
        status: "Underway",
        team: ["Dr. Sunny Kim", "Resident Research Project"],
      },
      {
        title:
          "EEG-based Machine Learning Framework for Acute Sleep Deprivation",
        description:
          "Developing automated detection systems for acute sleep deprivation using quantitative EEG and machine learning algorithms",
        status: "Under Review",
        publications: [
          {
            title:
              "EEG-based machine learning framework for diagnosis of acute sleep deprivation (Frontiers in Physiology)",
            link: "#",
          },
        ],
        team: ["Daya Kumar", "Dr. Narayan's IDSL Lab"],
      },
    ],
  },
  {
    title: "Quantitative EEG Guided Enhanced Neuromonitoring",
    description:
      "Advanced EEG monitoring and quantitative analysis for seizure detection, delirium assessment, and neuromonitoring in critically ill children using innovative nurse-led protocols",
    icon: "Eye",
    gradient: "linear-gradient(135deg, #0284c7 0%, #059669 100%)",
    projects: [
      {
        title: "NuANCEd: Nurse-led Advanced Monitoring",
        description:
          "Nurse-led advanced monitoring for non-convulsive seizures in encephalopathic critically ill children",
        funder: "AMOSO Opportunities",
        status: "Ongoing",
      },
      {
        title: "Quantitative EEG in PICU Delirium",
        description:
          "Evaluating qEEG metrics such as ADR (Amplitude-integrated EEG Derivative Ratio) and RAV (Relative Alpha Variability) in children with and without PICU delirium",
        status: "Active",
        team: ["Hiruthika Ravi", "Research Team"],
      },
    ],
  },
  {
    title: "Pain and Comfort in Critical Care",
    description:
      "Optimizing sedation, analgesia, and comfort management for pediatric critically ill patients through multicenter trials and international surveys of neurocritical care practices",
    icon: "Users",
    gradient: "linear-gradient(135deg, #059669 0%, #0284c7 100%)",
    projects: [
      {
        title: "ABOVE Trial",
        description:
          "Advancing Brain Outcomes in pediatric critically ill patients sedated with Volatile Anesthetic Agents: A pilot multicentre randomized controlled trial",
        funder: "CIHR",
        status: "Pilot Phase",
        team: [
          "Angela Jerath",
          "Nicole McKinnon",
          "Brian Cuthbertson",
          "Marat Slessarev",
        ],
        publications: [
          {
            title:
              "Volatile gas scavenging in the paediatric intensive care unit: Occupational health and safety assessment",
            link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11189165/",
          },
          {
            title:
              "Inhaled volatiles for status asthmaticus (Critical Care Explorations)",
            link: "https://journals.lww.com/ccejournal/fulltext/2024/02000/inhaled_volatiles_for_status_asthmaticus.17.aspx",
          },
          {
            title:
              "Analogsedative drug use in burn ICU patients (Critical Care Medicine)",
            link: "https://journals.lww.com/ccmjournal/fulltext/2024/01001/966__analgosedative_drug_use_in_burn_icu_patients.911.aspx",
          },
        ],
      },
      {
        title: "In-SYNCC",
        description:
          "International survey of neurocritical care practices in pediatric ICUs - Series of surveys focusing on sedation, analgesia, delirium detection, TBI management and neuroprognostication in brain-injured critically ill children",
        status: "Ongoing",
      },
    ],
  },
];

const defaultCollaborations: ResearchCollaboration[] = [
  {
    title: "POPCORN Project",
    description:
      "Pediatric Outcomes improvement through Coordination of Research Networks - National network improving pediatric critical care outcomes through collaborative research and quality improvement initiatives",
    role: "Scientific Committee Chair, Site PI, SnaCCC Sub-study Lead (Study of Neurological Complications in children with COVID-19 infections)",
    link: "https://www.popcornpediatrics.ca/",
  },
  {
    title: "PROBE Registry",
    description:
      "Pediatric Registry of Brain Death Practices - International registry of over 2000 children who underwent death declaration by neurologic criteria to standardize practices and improve outcomes",
    role: "Collaborating Investigator",
    link: "#",
  },
  {
    title: "BOBBI Trial",
    description:
      "Better Outcomes in Babies with Bacterial meningitis - Multicenter randomized controlled trial for improving outcomes in pediatric bacterial meningitis through optimized treatment protocols",
    role: "Canada Lead Investigator",
    funder: "CIHR",
    link: "#",
  },
];

export function defaultResearchPageDocument(): ResearchPageDocument {
  return {
    hero: {
      badge: "Research Excellence",
      title: "Our Research",
      subtitle: "Advancing Critical Care Neuroscience",
      intro:
        "Exploring the frontiers of neuroprognostication and brain monitoring through innovative research, advanced neuroimaging, and collaborative discovery.",
      pillars: ["Neuroprognostication", "Neuroimaging", "Critical Care"],
    },
    themesSection: {
      title: "Key Research Themes",
      intro:
        "Click on each theme to explore our detailed research projects and findings.",
    },
    themes: defaultThemes,
    collaborationsSection: {
      badge: "Global Impact",
      title: "Multi-center Collaborations",
      intro:
        "Leading and participating in international research networks to advance pediatric critical care worldwide.",
    },
    collaborations: defaultCollaborations,
    cta: {
      badge: "Join Our Mission",
      title: "Collaborate With Us",
      intro:
        "We welcome collaborations from clinicians, researchers, institutions, and industry partners who share our passion for advancing pediatric neurocritical care.",
      primary: { href: "/collaborate", label: "Start Collaboration" },
      secondary: { href: "/contact", label: "Contact Us" },
    },
  };
}
