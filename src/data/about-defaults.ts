/**
 * Default About page content. Supabase `about_page_settings` merges on top.
 */

export type AboutTone = "cognition" | "consciousness" | "care";
export type HeroPillIcon = "brain" | "heart" | "eye";
export type MissionCardIcon = "circleHelp" | "search" | "target";

export type AboutPayload = {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    intro: string;
    pills: { label: string; tone: AboutTone; icon: HeroPillIcon }[];
  };
  missionSection: {
    eyebrow: string;
    title: string;
    cards: {
      icon: MissionCardIcon;
      tone: AboutTone;
      /** Thin top bar gradient index (matches original 3-up rotation). */
      accentSlot: 0 | 1 | 2;
      title: string;
      description: string;
    }[];
  };
  whoWeAre: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    imageSrc: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
  };
  leadership: {
    eyebrow: string;
    title: string;
    subtitle: string;
    piName: string;
    piRole: string;
    piBio: string;
    piImageSrc: string;
    piImageAlt: string;
    educationTitle: string;
    educationBullets: string[];
    researchBoxTitle: string;
    researchBoxBody: string;
    links: {
      label: string;
      href: string;
      external: boolean;
      /** Gradient CTA when internal primary. */
      variant?: "primary" | "outline";
    }[];
  };
  researchFocus: {
    eyebrow: string;
    title: string;
    intro: string;
    keyAreasTitle: string;
    keyAreas: string[];
    approachTitle: string;
    approachParagraphs: string[];
  };
};

const CARD_ACCENTS = [
  "from-cognition via-brand to-consciousness",
  "from-consciousness via-care to-cognition",
  "from-care via-cognition to-brand",
] as const;

export const ABOUT_CARD_ACCENTS = CARD_ACCENTS;

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const ABOUT_DEFAULTS: AboutPayload = {
  hero: {
    badge: "About 4C Research",
    titleLine1: "Advancing Brain Health",
    titleLine2: "Cognition, Consciousness & Critical Care",
    intro:
      "Our dedicated research group focuses on uncovering groundbreaking discoveries in altered cognition and consciousness in critically ill children through innovative neuroimaging and predictive analytics.",
    pills: [
      { label: "Clinical Research", tone: "cognition", icon: "brain" },
      { label: "Patient Care", tone: "consciousness", icon: "heart" },
      { label: "Innovation", tone: "care", icon: "eye" },
    ],
  },
  missionSection: {
    eyebrow: "Mission",
    title: "Our Mission",
    cards: [
      {
        icon: "circleHelp",
        tone: "cognition",
        accentSlot: 0,
        title: "What?",
        description:
          "To improve outcomes for critically ill patients with acute disorders of cognition and consciousness.",
      },
      {
        icon: "search",
        tone: "consciousness",
        accentSlot: 1,
        title: "How?",
        description:
          "Through the development and validation of functional neuroimaging modalities as tools for accurate prediction and timely detection of pathological brain states.",
      },
      {
        icon: "target",
        tone: "care",
        accentSlot: 2,
        title: "Why?",
        description:
          "The long-term consequences of brain injury acquired prior to or during critical illness are debilitating. Our work will improve survival and mitigate morbidity associated with brain injury.",
      },
    ],
  },
  whoWeAre: {
    eyebrow: "Who we are",
    title: "About Us",
    paragraphs: [
      "Our dedicated research group focuses on uncovering groundbreaking discoveries in altered cognition and consciousness in critically ill children.",
      "By understanding the complex neurophysiology underlying these pathological brain states, we can develop tools to predict and detect such neurological problems in a timely manner. Accurate prediction and/or early detection of such conditions would positively impact the long-term functional outcomes of these children.",
      "Our work is driven by our passion for improving the lives of children and their families. Join us on this journey as we strive to make a difference in the world of pediatric survivors of critical illness. Together, we can create a brighter future for our young patients.",
    ],
    imageSrc: "/images/mission.jpg",
    imageAlt: "Our mission in pediatric research",
    ctaLabel: "Meet Our Team",
    ctaHref: "/team/",
  },
  leadership: {
    eyebrow: "Leadership",
    title: "Principal Investigator",
    subtitle:
      "Leading the 4C Research Group at Western University and London Health Sciences Centre",
    piName: "Dr. Rishi Ganesan",
    piRole: "Head of the 4C Research Group",
    piBio:
      "Dr. Rishi Ganesan is a paediatric intensive care physician-researcher with additional expertise in paediatric neurocritical care. He is a physician in the Division of Paediatric Critical Care Medicine at the Children\u2019s Hospital - London Health Sciences Centre, Assistant Professor in the Department of Paediatrics at the Schulich School of Medicine (Western University) and an Associate Scientist at the Lawson Health Research Institute.",
    piImageSrc: "/images/team/team-1.jpg",
    piImageAlt: "Dr. Rishi Ganesan, Principal Investigator",
    educationTitle: "Education & Training",
    educationBullets: [
      "MD and specialist training in paediatric critical care",
      "Advanced expertise in paediatric neurocritical care",
      "Faculty, Schulich School of Medicine & Dentistry",
    ],
    researchBoxTitle: "Research Focus",
    researchBoxBody:
      "Functional neuroimaging, quantitative EEG, covert consciousness detection, and outcome prediction in critically ill children.",
    links: [
      {
        label: "PI biography",
        href: "/about-pi/",
        external: false,
        variant: "primary",
      },
      {
        label: "Schulich profile",
        href: "https://www.schulich.uwo.ca/paediatrics/about_us/people/faculty/ganesan_rishi.html",
        external: true,
      },
      { label: "Full team", href: "/team/", external: false },
    ],
  },
  researchFocus: {
    eyebrow: "Focus",
    title: "Research Focus",
    intro:
      "We integrate clinical paediatric critical care with cutting-edge neuroimaging and computational methods to understand and predict brain function when it matters most.",
    keyAreasTitle: "Key Areas",
    keyAreas: [
      "Covert consciousness and disorders of consciousness in critically ill children",
      "Functional neuroimaging (fNIRS, EEG, fMRI) in the PICU",
      "Neuroprognostication and outcome prediction after brain injury",
      "Machine learning and quantitative signal analysis for brain monitoring",
      "Knowledge mobilization and family-centred communication in neurocritical care",
    ],
    approachTitle: "Our Approach",
    approachParagraphs: [
      "We combine prospective clinical studies, multimodal brain monitoring, and rigorous validation so that new measures can move from the lab to the bedside responsibly.",
      "Collaboration with families, clinicians, and international partners ensures our science stays grounded in real-world needs — from early detection to long-term outcomes for survivors of critical illness.",
    ],
  },
};

function pickArr<T>(def: T[], over: T[] | undefined | null): T[] {
  if (over === undefined || over === null) return clone(def);
  return over.map((item) =>
    item && typeof item === "object" ? { ...item } : item,
  ) as T[];
}

function mergeMissionCards(
  def: AboutPayload["missionSection"]["cards"],
  over: AboutPayload["missionSection"]["cards"] | undefined | null,
): AboutPayload["missionSection"]["cards"] {
  if (over === undefined || over === null) return clone(def);
  if (over.length === 0) return [];
  return over.map((c, i) => {
    const base = def[i] ?? def[def.length - 1]!;
    return {
      ...base,
      ...c,
      accentSlot: (c.accentSlot ?? base.accentSlot ?? (i % 3)) as 0 | 1 | 2,
    };
  });
}

function mergeLeadershipLinks(
  def: AboutPayload["leadership"]["links"],
  over: AboutPayload["leadership"]["links"] | undefined | null,
): AboutPayload["leadership"]["links"] {
  if (over === undefined || over === null) return clone(def);
  return over.map((l, i) => ({
    ...(def[i] ?? {
      label: "",
      href: "/",
      external: false,
      variant: "outline" as const,
    }),
    ...l,
  }));
}

export function mergeAboutPayload(raw: unknown): AboutPayload {
  const d = ABOUT_DEFAULTS;
  if (!raw || typeof raw !== "object") return clone(d);
  const r = raw as Partial<AboutPayload>;

  return {
    hero: {
      ...d.hero,
      ...r.hero,
      pills: pickArr(d.hero.pills, r.hero?.pills),
    },
    missionSection: {
      ...d.missionSection,
      ...r.missionSection,
      cards: mergeMissionCards(
        d.missionSection.cards,
        r.missionSection?.cards,
      ),
    },
    whoWeAre: {
      ...d.whoWeAre,
      ...r.whoWeAre,
      paragraphs: pickArr(d.whoWeAre.paragraphs, r.whoWeAre?.paragraphs),
    },
    leadership: {
      ...d.leadership,
      ...r.leadership,
      educationBullets: pickArr(
        d.leadership.educationBullets,
        r.leadership?.educationBullets,
      ),
      links: mergeLeadershipLinks(d.leadership.links, r.leadership?.links),
    },
    researchFocus: {
      ...d.researchFocus,
      ...r.researchFocus,
      keyAreas: pickArr(d.researchFocus.keyAreas, r.researchFocus?.keyAreas),
      approachParagraphs: pickArr(
        d.researchFocus.approachParagraphs,
        r.researchFocus?.approachParagraphs,
      ),
    },
  };
}
