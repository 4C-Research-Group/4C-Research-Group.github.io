/** Default copy for `/collaborate`. CMS payload merges on top. */

export const COLLABORATE_OPPORTUNITY_ICON_KEYS = [
  "brain",
  "eye",
  "users",
  "handshake",
  "microscope",
  "building",
  "award",
  "lightbulb",
  "globe",
  "target",
  "zap",
] as const;

export type CollaborateOpportunityIconKey =
  (typeof COLLABORATE_OPPORTUNITY_ICON_KEYS)[number];

export const COLLABORATE_CARD_COLORS = [
  "brand",
  "cognition",
  "consciousness",
  "care",
] as const;

export type CollaborateCardColorKey = (typeof COLLABORATE_CARD_COLORS)[number];

export type CollaborateOpportunity = {
  title: string;
  description: string;
  icon: CollaborateOpportunityIconKey | string;
  color: CollaborateCardColorKey | string;
  benefits: string[];
};

export type CollaboratePartner = {
  name: string;
  type: string;
  link: string;
  imageSrc: string;
};

export type CollaborateFunder = {
  name: string;
  type: string;
  amount: string;
  link: string;
  imageSrc: string;
};

export type CollaboratePagePayload = {
  heroBadgeIcon: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  heroPill1Icon: string;
  heroPill1: string;
  heroPill2Icon: string;
  heroPill2: string;
  heroPill3Icon: string;
  heroPill3: string;
  focusTitle: string;
  focusSubtitle: string;
  detectionCardIcon: string;
  detectionTitle: string;
  detectionLead: string;
  detectionBullets: string[];
  predictionCardIcon: string;
  predictionTitle: string;
  predictionLead: string;
  predictionBullets: string[];
  partnershipTitle: string;
  partnershipSubtitle: string;
  opportunities: CollaborateOpportunity[];
  partnersTitle: string;
  partnersSubtitle: string;
  partnersVisitLabel: string;
  partners: CollaboratePartner[];
  fundingBadgeIcon: string;
  fundingBadge: string;
  fundingTitle: string;
  fundingSubtitle: string;
  funders: CollaborateFunder[];
  funderAmountCaption: string;
  funderButtonLabel: string;
  contactPillIcon: string;
  contactPill: string;
  contactTitle: string;
  contactBody: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  getInTouchTitle: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  contactLocationLabel: string;
  researchAreasTitle: string;
  researchAreas: string[];
  connectTitle: string;
  connectSubtitle: string;
  googleScholarLabel: string;
  googleScholarUrl: string;
  researchGateLabel: string;
  researchGateUrl: string;
  explorePartnershipButtonText: string;
};

export const collaboratePageDefaults: CollaboratePagePayload = {
  heroBadgeIcon: "eye",
  heroBadge: "FORESEE Research Excellence",
  heroTitle: "Collaborate With Us",
  heroSubtitle: "Predicting the Future of Brain Health",
  heroBody:
    "Join our mission to advance neuroprognostication and critical care research through meaningful partnerships. Together, we can detect what's happening in the brain in real-time and predict future brain function.",
  heroPill1Icon: "brain",
  heroPill1: "Real-time Detection",
  heroPill2Icon: "eye",
  heroPill2: "Future Prediction",
  heroPill3Icon: "zap",
  heroPill3: "Critical Care Impact",
  focusTitle: "Our FORESEE Research Focus",
  focusSubtitle:
    "Two key aspects define our research program: detecting brain pathologies in real-time and predicting future brain function and outcomes.",
  detectionCardIcon: "brain",
  detectionTitle: "Real-time Detection",
  detectionLead: "What is happening in the brain in real-time?",
  detectionBullets: [
    "Detection of brain pathologies in critically ill patients",
    "Covert consciousness identification",
    "Advanced neuroimaging and EEG monitoring",
    "Timely intervention opportunities",
  ],
  predictionCardIcon: "eye",
  predictionTitle: "Future Prediction",
  predictionLead: "What will the brain's function look like in the future?",
  predictionBullets: [
    "Neuroprognostication after brain injury",
    "Outcome prediction models",
    "Machine learning for brain state prediction",
    "Long-term functional outcome forecasting",
  ],
  partnershipTitle: "Partnership Opportunities",
  partnershipSubtitle:
    "We invite collaborators and industry partners interested in advancing disorders of cognition and consciousness research in critical care.",
  opportunities: [
    {
      title: "Clinical Research Partners",
      description:
        "Collaborate with healthcare institutions for patient recruitment and data collection",
      icon: "users",
      color: "brand",
      benefits: [
        "Access to diverse patient populations",
        "Shared expertise in clinical protocols",
        "Joint publications and presentations",
        "Enhanced grant opportunities",
      ],
    },
    {
      title: "Industry Partnerships",
      description:
        "Partner with medical technology and pharmaceutical companies",
      icon: "handshake",
      color: "cognition",
      benefits: [
        "Technology development and validation",
        "Real-world evidence generation",
        "Innovation in patient monitoring",
        "Commercialization opportunities",
      ],
    },
    {
      title: "Academic Collaborations",
      description:
        "Work with research institutions and universities worldwide",
      icon: "users",
      color: "consciousness",
      benefits: [
        "Multi-center research studies",
        "Data sharing and analysis",
        "Student and researcher exchanges",
        "Combined grant applications",
      ],
    },
  ],
  partnersTitle: "Our Institutional Partners",
  partnersSubtitle:
    "Leading institutions supporting our mission to advance brain health research",
  partnersVisitLabel: "Visit Website",
  partners: [
    {
      name: "London Health Sciences Centre Research Institute",
      type: "Research Institute",
      link: "https://www.lhscri.ca/",
      imageSrc: "/images/partners/LHSCRI.png",
    },
    {
      name: "Schulich School of Medicine & Dentistry",
      type: "Academic Partner",
      link: "https://www.schulich.uwo.ca/paediatrics/about_us/people/faculty/ganesan_rishi.html",
      imageSrc: "/images/partners/Schulich.png",
    },
    {
      name: "Western Institute for Neurosciences",
      type: "Research Institute",
      link: "https://win.uwo.ca/",
      imageSrc: "/images/partners/WesternIN.png",
    },
    {
      name: "Children's Health Research Institute",
      type: "Research Institute",
      link: "https://www.childhealthresearch.ca/",
      imageSrc: "/images/partners/childrenHRI.png",
    },
  ],
  fundingBadgeIcon: "award",
  fundingBadge: "Major Funding Support",
  fundingTitle: "Prestigious Funding Recognition",
  fundingSubtitle:
    "We gratefully acknowledge the generous support of our funding partners",
  funders: [
    {
      name: "CIHR",
      type: "Federal Funding Agency",
      amount: "Multiple Grants",
      link: "https://cihr-irsc.gc.ca/e/193.html",
      imageSrc: "/images/partners/CHIR.jpg",
    },
    {
      name: "Brain Canada",
      type: "National Foundation",
      amount: "$2M Future Leaders Award",
      link: "https://braincanada.ca/",
      imageSrc: "/images/partners/Logo_BrainCanada.png",
    },
    {
      name: "AMOSO",
      type: "Regional Foundation",
      amount: "Project Funding",
      link: "https://amosoweb.ca/",
      imageSrc: "/images/partners/amoso-logo.png",
    },
    {
      name: "Radboud-Western Collaboration",
      type: "International Partnership",
      amount: "Collaborative Grant",
      link: "https://www.ru.nl/en",
      imageSrc: "/images/partners/radboud-universiteit-open-graph-logo.png",
    },
  ],
  funderAmountCaption: "Funding",
  funderButtonLabel: "Learn More",
  contactPillIcon: "lightbulb",
  contactPill: "Let's Collaborate",
  contactTitle: "Ready to Shape the Future of Brain Health?",
  contactBody:
    "Join us in our mission to predict and protect brain function in critically ill patients. We welcome collaborations from clinicians, researchers, institutions, and industry partners who share our passion for advancing neurocritical care.",
  contactEmail: "rishi.ganesan@lhsc.on.ca",
  contactPhone: "+1 (519) 685-8500 Ext. 74702",
  contactLocation: "London Health Sciences Centre\nLondon, ON N6A 5W9",
  getInTouchTitle: "Get in Touch",
  contactEmailLabel: "Email",
  contactPhoneLabel: "Phone",
  contactLocationLabel: "Location",
  researchAreasTitle: "Research Focus Areas",
  researchAreas: [
    "Neuroprognostication after brain injury",
    "Covert consciousness detection",
    "ICU delirium and sleep deprivation",
    "Quantitative EEG monitoring",
    "Pediatric critical care research",
    "Machine learning in neurocritical care",
  ],
  connectTitle: "Connect With Our Research",
  connectSubtitle: "Follow our latest discoveries and publications",
  googleScholarLabel: "Google Scholar",
  googleScholarUrl:
    "https://scholar.google.com/citations?user=iuxSVQwAAAAJ&hl=en",
  researchGateLabel: "ResearchGate",
  researchGateUrl:
    "https://www.researchgate.net/profile/Saptharishi-Lalgudi-Ganesan",
  explorePartnershipButtonText: "Explore Partnership",
};
