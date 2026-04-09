/**
 * Default homepage copy and image paths (public/ or absolute URLs).
 * Supabase `homepage_settings` overrides merge on top of this.
 */

export type PillTone = "cognition" | "consciousness" | "care";
export type PillIcon = "brain" | "microscope" | "zap";
export type CtaVariant = "primary" | "outline" | "ghost";
export type StatIcon = "brain" | "book" | "users" | "award";
export type ThemeIcon = "brain" | "activity" | "eye" | "users";
export type ThemeColor = "cognition" | "consciousness" | "care" | "brand";

export type HomepagePayload = {
  hero: {
    badge: string;
    titleHighlight: string;
    titleRest: string;
    tagline: string;
    lead: string;
    partnerBlurb: string;
    heroLogoSrc: string;
    brainPatternSrc: string;
    pills: { label: string; href: string; icon: PillIcon; tone: PillTone }[];
    ctas: { label: string; href: string; variant: CtaVariant; showArrow?: boolean }[];
  };
  heroSnapshots: { src: string; alt: string }[];
  mission: {
    title: string;
    paragraphs: string[];
    imageSrc: string;
    imageAlt: string;
    overlayTitle: string;
    overlaySubtitle: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    viewAllLabel: string;
    viewAllHref: string;
    items: { imageSrc: string; alt: string; span: string }[];
    bottomCtaLabel: string;
    bottomCtaHref: string;
  };
  impact: {
    title: string;
    subtitle: string;
    stats: { value: string; label: string; icon: StatIcon }[];
  };
  researchThemes: {
    title: string;
    subtitle: string;
    themes: {
      title: string;
      description: string;
      icon: ThemeIcon;
      color: ThemeColor;
      projects: string[];
    }[];
  };
  news: {
    title: string;
    articleTitle: string;
    articleBody: string;
    ctaLabel: string;
    ctaHref: string;
    imageSrc: string;
    imageAlt: string;
    badgeLabel: string;
    footerNote: string;
  };
  featured: {
    title: string;
    subtitle: string;
    viewAllLabel: string;
    viewAllHref: string;
  };
  join: {
    title: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  social: {
    title: string;
    eyebrow: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const HOMEPAGE_DEFAULTS: HomepagePayload = {
  hero: {
    badge: "Pediatric neurocritical care research",
    titleHighlight: "4C",
    titleRest: " Research Group",
    tagline: "Cognition · Consciousness · Critical Care",
    lead: "We study brain health in critically ill children—combining neuroimaging, bedside monitoring, and multicenter collaboration to improve outcomes.",
    partnerBlurb:
      "Interested in partnering? We work with clinicians, hospitals, and industry on studies from neuroprognostication to ICU delirium and quantitative EEG.",
    heroLogoSrc: "/logo.png",
    brainPatternSrc: "/images/brain-pattern.svg",
    pills: [
      {
        label: "Cognition",
        href: "/research/",
        icon: "brain",
        tone: "cognition",
      },
      {
        label: "Consciousness",
        href: "/research/",
        icon: "microscope",
        tone: "consciousness",
      },
      {
        label: "Critical care",
        href: "/research/",
        icon: "zap",
        tone: "care",
      },
    ],
    ctas: [
      {
        label: "Explore research",
        href: "/research/",
        variant: "primary",
        showArrow: true,
      },
      { label: "Collaborate", href: "/collaborate/", variant: "outline" },
      { label: "Meet the team", href: "/team/", variant: "ghost" },
    ],
  },
  heroSnapshots: [
    {
      src: "/images/lab-images/20240423_095244.jpg",
      alt: "Researchers collaborating in the lab",
    },
    {
      src: "/images/lab-images/20230214_194648.jpg",
      alt: "Lab workspace and equipment",
    },
    {
      src: "/images/lab-images/20230613_093841.jpg",
      alt: "Team discussion during research",
    },
  ],
  mission: {
    title: "Our Mission",
    paragraphs: [
      "We are dedicated to advancing the understanding and treatment of cognitive and consciousness disorders in critically ill children. Our multidisciplinary team combines expertise in pediatric critical care, neuroscience, and biomedical engineering to develop innovative solutions that improve patient outcomes.",
      "Through cutting-edge research and clinical collaboration, we strive to make a meaningful difference in the lives of children and their families.",
    ],
    imageSrc: "/images/lab.jpg",
    imageAlt: "Medical research team collaborating",
    overlayTitle: "Collaborative Research Excellence",
    overlaySubtitle:
      "Bringing together diverse expertise to transform pediatric care",
  },
  gallery: {
    title: "Gallery",
    subtitle:
      "Moments from our lab — research, collaboration, and breakthroughs.",
    viewAllLabel: "View all",
    viewAllHref: "/gallery/",
    items: [
      {
        imageSrc: "/images/lab-images/20240423_095244.jpg",
        alt: "Lab preview",
        span: "col-span-2 row-span-2",
      },
      {
        imageSrc: "/images/lab-images/20230214_194648.jpg",
        alt: "Lab preview",
        span: "",
      },
      {
        imageSrc: "/images/lab-images/20230613_093841.jpg",
        alt: "Lab preview",
        span: "",
      },
      {
        imageSrc: "/images/lab-images/20231110_125703.jpg",
        alt: "Lab preview",
        span: "row-span-2",
      },
      {
        imageSrc: "/images/lab-images/20240408_120719.jpg",
        alt: "Lab preview",
        span: "",
      },
      {
        imageSrc: "/images/lab-images/20250520_184141.jpg",
        alt: "Lab preview",
        span: "col-span-2",
      },
      {
        imageSrc: "/images/lab-images/IMG-20240829-WA0035.jpg",
        alt: "Lab preview",
        span: "",
      },
    ],
    bottomCtaLabel: "Explore Full Gallery",
    bottomCtaHref: "/gallery/",
  },
  impact: {
    title: "Our Impact",
    subtitle:
      "Driving innovation in pediatric critical care through dedicated research and collaboration",
    stats: [
      { value: "12+", label: "Research Projects", icon: "brain" },
      { value: "90+", label: "Publications", icon: "book" },
      { value: "10+", label: "Team Members", icon: "users" },
      { value: "5+", label: "Institutions", icon: "award" },
    ],
  },
  researchThemes: {
    title: "Research Themes",
    subtitle:
      "Exploring the frontiers of neuroprognostication and brain monitoring in critical care",
    themes: [
      {
        title: "Neuroprognostication",
        description: "Predicting outcomes in acquired brain injury",
        icon: "brain",
        color: "cognition",
        projects: ["PREDICT ABI", "Common Data Elements", "GERMINAL Project"],
      },
      {
        title: "ICU Delirium & Sleep",
        description: "Tracking brain connectivity in at-risk children",
        icon: "activity",
        color: "consciousness",
        projects: ["TraNSIENCE", "BrainCASH", "Sleep Deprivation Studies"],
      },
      {
        title: "EEG Monitoring",
        description: "Quantitative EEG for enhanced neuromonitoring",
        icon: "eye",
        color: "care",
        projects: ["NuANCEd", "qEEG Metrics", "Machine Learning Framework"],
      },
      {
        title: "Pain & Comfort",
        description: "Advancing outcomes in pediatric critical care",
        icon: "users",
        color: "brand",
        projects: ["ABOVE Trial", "In-SYNCC Survey", "Multi-center Studies"],
      },
    ],
  },
  news: {
    title: "Latest Research News",
    articleTitle:
      "Researchers investigate a new method of sedation for paediatric patients",
    articleBody:
      "Scientists at Children\u2019s Health Research Institute (a program of Lawson Health Research Institute), Sunnybrook Research Institute and The Hospital for Sick Children (SickKids) are working together to study the potential benefits of inhaled sedation as an alternative to keep critically ill children sedated and comfortable.",
    ctaLabel: "Read the full article on SickKids",
    ctaHref:
      "https://www.sickkids.ca/en/news/archive/2023/researchers-investigate-a-new-method-of-sedation-for-paediatric-patients/",
    imageSrc:
      "https://images.pexels.com/photos/3845988/pexels-photo-3845988.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    imageAlt: "Medical research collaboration",
    badgeLabel: "Research News",
    footerNote:
      "Stay updated with the latest breakthroughs in pediatric critical care research",
  },
  featured: {
    title: "Featured Projects",
    subtitle: "Highlighting our funded research initiatives and collaborations",
    viewAllLabel: "View All Projects",
    viewAllHref: "/projects/",
  },
  join: {
    title: "Join Our Research Community",
    body: "We are always looking for passionate researchers, students, and collaborators to join us in advancing the frontiers of cognitive science and critical care research.",
    primaryCtaLabel: "Join Our Team",
    primaryCtaHref: "/join-4c-lab/",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaHref: "/contact/",
  },
  social: {
    title: "Stay Connected",
    eyebrow: "Follow Us on Social Media",
    body: "Stay updated with our latest research findings, team updates, and insights into pediatric critical care. Follow us on social media to be part of our research community.",
    buttonLabel: "Follow @Mission_FourC",
    buttonHref: "https://x.com/Mission_FourC",
  },
};

function pickArr<T>(def: T[], over: T[] | undefined | null): T[] {
  if (over === undefined || over === null) return clone(def);
  return over.map((item) =>
    item && typeof item === "object" ? { ...item } : item,
  ) as T[];
}

const EMPTY_THEME: HomepagePayload["researchThemes"]["themes"][number] = {
  title: "Research theme",
  description: "",
  icon: "brain",
  color: "brand",
  projects: [],
};

function mergeThemeList(
  def: HomepagePayload["researchThemes"]["themes"],
  over: HomepagePayload["researchThemes"]["themes"] | undefined | null,
): HomepagePayload["researchThemes"]["themes"] {
  if (!over?.length) return clone(def);
  return over.map((t, i) => {
    const b = def[i] ?? EMPTY_THEME;
    return {
      ...b,
      ...t,
      projects: pickArr(b.projects, t.projects),
    };
  });
}

/** Merge stored JSON over defaults (empty arrays keep defaults). */
export function mergeHomepagePayload(raw: unknown): HomepagePayload {
  const d = HOMEPAGE_DEFAULTS;
  if (!raw || typeof raw !== "object") return clone(d);
  const r = raw as Partial<HomepagePayload>;

  return {
    hero: {
      ...d.hero,
      ...r.hero,
      pills: pickArr(d.hero.pills, r.hero?.pills),
      ctas: pickArr(d.hero.ctas, r.hero?.ctas),
    },
    heroSnapshots: pickArr(d.heroSnapshots, r.heroSnapshots),
    mission: {
      ...d.mission,
      ...r.mission,
      paragraphs: pickArr(d.mission.paragraphs, r.mission?.paragraphs),
    },
    gallery: {
      ...d.gallery,
      ...r.gallery,
      items: pickArr(d.gallery.items, r.gallery?.items),
    },
    impact: {
      ...d.impact,
      ...r.impact,
      stats: pickArr(d.impact.stats, r.impact?.stats),
    },
    researchThemes: {
      ...d.researchThemes,
      ...r.researchThemes,
      themes: mergeThemeList(
        d.researchThemes.themes,
        r.researchThemes?.themes,
      ),
    },
    news: { ...d.news, ...r.news },
    featured: { ...d.featured, ...r.featured },
    join: { ...d.join, ...r.join },
    social: { ...d.social, ...r.social },
  };
}
