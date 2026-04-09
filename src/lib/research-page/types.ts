export const RESEARCH_THEME_ICONS = ["Brain", "Activity", "Eye", "Users"] as const;
export type ResearchThemeIcon = (typeof RESEARCH_THEME_ICONS)[number];

export type ResearchProjectPublication = { title: string; link: string };

export type ResearchProject = {
  title: string;
  description: string;
  status: string;
  funder?: string;
  publications?: ResearchProjectPublication[];
  team?: string[];
};

export type ResearchTheme = {
  title: string;
  description: string;
  icon: ResearchThemeIcon;
  gradient: string;
  projects: ResearchProject[];
};

export type ResearchCollaboration = {
  title: string;
  description: string;
  role: string;
  link: string;
  funder?: string;
};

export type ResearchPageDocument = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    intro: string;
    pillars: [string, string, string];
  };
  themesSection: { title: string; intro: string };
  themes: ResearchTheme[];
  collaborationsSection: { badge: string; title: string; intro: string };
  collaborations: ResearchCollaboration[];
  cta: {
    badge: string;
    title: string;
    intro: string;
    primary: { href: string; label: string };
    secondary: { href: string; label: string };
  };
};
