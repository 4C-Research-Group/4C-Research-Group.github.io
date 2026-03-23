export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  status: "active" | "completed" | "upcoming";
  startDate: string;
  endDate?: string;
  images: string[];
  tags: string[];
  link?: string;
  funding?: string;
  objectives?: string[];
  teamMembers?: TeamMember[];
  publications?: {
    title: string;
    link: string;
    date: string;
  }[];
  additionalInfo?: string;
}

export const projects: Project[] = [
  {
    id: "nuanced",
    title: "NuANCEd",
    description:
      "Nurse-led Advanced Neuromonitoring in Critically ill children with Encephalopathy",
    longDescription: `NuANCEd is an integrated knowledge translation project that brings together implementation science, quality improvement and research. The project focuses on developing and implementing a nurse-led processed EEG (qEEG) based seizure screening program to minimize delays in seizure diagnosis and treatment. This is a four-phase project and we are currently in the pre-implementation phase wherein we are collecting baseline data regarding time lag between seizure occurrence, detection and treatment.`,
    category: "Implementation Science",
    status: "active",
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    images: [
      "/images/project-1.png",
      "/images/Graphic_image_of_patient_with_confusion_memory_.original.jpg",
      "/images/placeholder.jpg",
    ],
    tags: [
      "Neuromonitoring",
      "EEG",
      "Seizure Detection",
      "Pediatric Critical Care",
    ],
    link: undefined,
    funding: "AMOSO Opportunities Fund",
    objectives: [
      "Develop a nurse-led qEEG-based seizure screening program",
      "Reduce time to seizure detection and treatment",
      "Establish baseline data on current seizure detection practices",
      "Improve outcomes for critically ill children with encephalopathy",
    ],
    teamMembers: [
      { name: "Dr. Ganesan", role: "Principal Investigator" },
      { name: "LHSC Team", role: "Clinical Partners" },
    ],
  },
  {
    id: "transience",
    title: "TraNSIEnCe",
    description:
      "Tracking Neurocognitive States In Encephalopathic Critically ill children",
    longDescription: `This study aims to characterize functional and effective brain connectivity in critically ill children at varying degrees of risk for delirium. As part of this study, we enroll critically ill children at low-risk and high-risk for PICU delirium. We track their neurocognitive state using clinical behavioral scores, electroencephalography (EEG) and optical neuroimaging (fNIRS) techniques to identify objective predictors and signatures of delirium in critically ill children.`,
    category: "Clinical Research",
    status: "active",
    startDate: "2023-05-15",
    endDate: "2026-06-30",
    images: [
      "/images/project-2.jpg",
      "/images/Graphic_image_of_patient_with_confusion_memory_.original.jpg",
      "/images/placeholder.jpg",
    ],
    tags: [
      "Brain Connectivity",
      "Delirium",
      "Pediatric Critical Care",
      "EEG",
      "fNIRS",
      "Neuroimaging",
    ],
    link: undefined,
    funding: "Brain Canada Future Leaders in Brain Research Award",
    objectives: [
      "Characterize brain connectivity patterns in children at risk for PICU delirium",
      "Identify objective neurophysiological markers of delirium",
      "Develop early detection methods using EEG and fNIRS",
      "Improve understanding of delirium pathophysiology in critically ill children",
    ],
    teamMembers: [
      { name: "Dr. Ganesan", role: "Principal Investigator" },
      { name: "LHSC Team", role: "Clinical Partners" },
    ],
  },
  {
    id: "predict-abi",
    title: "PREDICT ABI",
    description:
      "Predicting outcomes in critically ill children with acquired brain injury",
    longDescription: `This pilot prospective observational study will use functional neuroimaging (high density EEG, functional MRI and functional near-infrared spectroscopy) to help improve the accuracy and precision of predicting neurological outcomes in unresponsive critically ill children with moderate-severe acquired brain injury. This study is currently awaiting REB approval and will roll out soon.`,
    category: "Clinical Research",
    status: "upcoming",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    images: [
      "/images/project-3.png",
      "/images/Graphic_image_of_patient_with_confusion_memory_.original.jpg",
      "/images/placeholder.jpg",
    ],
    tags: [
      "Acquired Brain Injury",
      "Outcome Prediction",
      "Neuroimaging",
      "EEG",
      "fMRI",
      "fNIRS",
      "Pediatric Critical Care",
    ],
    link: undefined,
    funding: "AMOSO Innovation Fund",
    objectives: [
      "Develop accurate outcome prediction models for children with ABI",
      "Utilize multimodal neuroimaging for comprehensive assessment",
      "Identify early biomarkers of neurological recovery",
      "Improve prognostic accuracy in unresponsive pediatric patients",
    ],
    teamMembers: [
      { name: "Dr. Ganesan", role: "Principal Investigator" },
      { name: "LHSC Team", role: "Clinical Partners" },
    ],
  },
  {
    id: "above",
    title: "ABOVE",
    description:
      "Advancing Brain Outcomes in paediatric critically ill patients sedated with Volatile Anesthetic Agents",
    longDescription: `ABOVE is a pilot, multicenter, vanguard randomized controlled trial (RCT) to assess the feasibility of accruing patients, delivering inhaled anesthetics, and ascertaining outcomes in preparation for a definitive trial. This definitive trial will evaluate if inhaled anesthetics (intervention), compared to IV sedative agents (comparator), improves delirium in mechanically ventilated children. This trial will run for 36 months and aims to recruit a total of 60 patients between 2 sites.`,
    category: "Clinical Trial",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2026-12-31",
    images: [
      "/images/project-4.jpeg",
      "/images/placeholder.jpg",
      "/images/placeholder.jpg",
    ],
    tags: [
      "Clinical Trial",
      "Delirium",
      "Mechanical Ventilation",
      "Inhaled Anesthetics",
      "Pediatric Critical Care",
      "Multicenter Study",
    ],
    link: undefined,
    funding: "Investigator Initiated Trial",
    objectives: [
      "Assess feasibility of patient accrual and intervention delivery",
      "Compare effectiveness of inhaled anesthetics vs. IV sedatives",
      "Evaluate impact on delirium in mechanically ventilated children",
      "Establish protocols for definitive multicenter trial",
    ],
    teamMembers: [
      { name: "Dr. Ganesan", role: "Co-Principal Investigator" },
      {
        name: "Dr. Angela Jerath",
        role: "Principal Investigator (Sunnybrook)",
      },
      { name: "SickKids Team", role: "Collaborating Site" },
      { name: "Sunnybrook Team", role: "Lead Site" },
    ],
    additionalInfo:
      "This is an Investigator Initiated Trial with Sunnybrook as the lead site (Dr. Angela Jerath) and SickKids as the other participating site.",
  },
  {
    id: "norse",
    title: "NORSE",
    description: "New Onset Refractory Status Epilepticus Registry",
    longDescription: `This study aims to collect health related data and biological samples that will enable researchers to understand the cause of cryptogenic new-onset refractory status epilepticus (NORSE), to identify the key determinants of outcome and to determine the best management strategy.`,
    category: "Clinical Research",
    status: "active",
    startDate: "2023-03-01",
    endDate: "2026-03-31",
    images: [
      "/images/project-5.jpeg",
      "/images/placeholder.jpg",
      "/images/placeholder.jpg",
    ],
    tags: [
      "Epilepsy",
      "Status Epilepticus",
      "Biomarkers",
      "Registry",
      "Multicenter Study",
      "North American Collaboration",
    ],
    link: undefined,
    funding: "Yale University (Lead Site)",
    objectives: [
      "Understand the causes of cryptogenic NORSE",
      "Identify key determinants of patient outcomes",
      "Determine optimal management strategies",
      "Collect and analyze biological samples for research",
    ],
    teamMembers: [
      { name: "Dr. Lawrence Hirsch", role: "Principal Investigator (Yale)" },
      { name: "UH Team", role: "Canadian Site" },
      { name: "VH Team", role: "Canadian Site" },
      { name: "International Consortium", role: "26 Participating Sites" },
    ],
    additionalInfo:
      "Yale is the lead site (Dr. Lawrence Hirsch) with 26 participating sites within Canada and US (UH and VH only from Canada).",
    publications: [
      // Add any relevant publications here when available
    ],
  },
];
