import { defaultResearchPageDocument } from "@/data/research-page-default";
import type {
  ResearchCollaboration,
  ResearchPageDocument,
  ResearchProject,
  ResearchTheme,
  ResearchThemeIcon,
} from "@/lib/research-page/types";
import { RESEARCH_THEME_ICONS } from "@/lib/research-page/types";

const EMPTY_PROJECT: ResearchProject = {
  title: "",
  description: "",
  status: "",
};

function isThemeIcon(s: string): s is ResearchThemeIcon {
  return (RESEARCH_THEME_ICONS as readonly string[]).includes(s);
}

function mergeProject(
  p: Partial<ResearchProject> | undefined,
  fallback: ResearchProject,
): ResearchProject {
  if (!p || typeof p !== "object") return { ...fallback };
  const publications = Array.isArray(p.publications)
    ? p.publications
        .filter((pub) => pub && typeof (pub as { title?: string }).title === "string")
        .map((pub) => {
          const x = pub as { title: string; link?: string };
          return {
            title: x.title,
            link: typeof x.link === "string" ? x.link : "#",
          };
        })
    : undefined;
  const team = Array.isArray(p.team)
    ? p.team.filter((x): x is string => typeof x === "string")
    : undefined;
  return {
    title: typeof p.title === "string" ? p.title : fallback.title,
    description:
      typeof p.description === "string" ? p.description : fallback.description,
    status: typeof p.status === "string" ? p.status : fallback.status,
    funder:
      typeof p.funder === "string" ? p.funder.trim() || undefined : undefined,
    publications: publications?.length ? publications : undefined,
    team: team?.length ? team : undefined,
  };
}

function mergeTheme(
  t: Partial<ResearchTheme> | undefined,
  fallback: ResearchTheme,
): ResearchTheme {
  if (!t || typeof t !== "object") return { ...fallback, projects: [...fallback.projects] };
  const icon =
    typeof t.icon === "string" && isThemeIcon(t.icon) ? t.icon : fallback.icon;
  const projects =
    Array.isArray(t.projects) && t.projects.length > 0
      ? t.projects.map((proj, j) =>
          mergeProject(
            proj as Partial<ResearchProject>,
            fallback.projects[j] ?? EMPTY_PROJECT,
          ),
        )
      : fallback.projects.map((x) => ({ ...x }));
  return {
    title: typeof t.title === "string" ? t.title : fallback.title,
    description:
      typeof t.description === "string" ? t.description : fallback.description,
    icon,
    gradient: typeof t.gradient === "string" ? t.gradient : fallback.gradient,
    projects,
  };
}

function mergeCollaboration(
  c: Partial<ResearchCollaboration> | undefined,
  fallback: ResearchCollaboration,
): ResearchCollaboration {
  if (!c || typeof c !== "object") return { ...fallback };
  return {
    title: typeof c.title === "string" ? c.title : fallback.title,
    description:
      typeof c.description === "string" ? c.description : fallback.description,
    role: typeof c.role === "string" ? c.role : fallback.role,
    link: typeof c.link === "string" ? c.link : fallback.link,
    funder:
      typeof c.funder === "string" ? c.funder.trim() || undefined : undefined,
  };
}

/** Merge API JSON with bundled defaults so partial or older rows stay valid. */
export function mergeResearchPageDocument(
  raw: unknown,
): ResearchPageDocument {
  const def = defaultResearchPageDocument();
  if (!raw || typeof raw !== "object") return def;
  const o = raw as Record<string, unknown>;

  const heroIn = o.hero && typeof o.hero === "object" ? (o.hero as Record<string, unknown>) : null;
  const pillarsRaw = heroIn?.pillars;
  const pillars: [string, string, string] =
    Array.isArray(pillarsRaw) && pillarsRaw.length >= 3
      ? [
          String(pillarsRaw[0]),
          String(pillarsRaw[1]),
          String(pillarsRaw[2]),
        ]
      : def.hero.pillars;

  const hero = {
    badge:
      typeof heroIn?.badge === "string" ? heroIn.badge : def.hero.badge,
    title:
      typeof heroIn?.title === "string" ? heroIn.title : def.hero.title,
    subtitle:
      typeof heroIn?.subtitle === "string" ? heroIn.subtitle : def.hero.subtitle,
    intro:
      typeof heroIn?.intro === "string" ? heroIn.intro : def.hero.intro,
    pillars,
  };

  const tsIn =
    o.themesSection && typeof o.themesSection === "object"
      ? (o.themesSection as Record<string, unknown>)
      : null;
  const themesSection = {
    title:
      typeof tsIn?.title === "string" ? tsIn.title : def.themesSection.title,
    intro:
      typeof tsIn?.intro === "string" ? tsIn.intro : def.themesSection.intro,
  };

  const themes =
    Array.isArray(o.themes) && o.themes.length > 0
      ? o.themes.map((t, i) =>
          mergeTheme(t as Partial<ResearchTheme>, def.themes[i] ?? def.themes[0]),
        )
      : def.themes;

  const csIn =
    o.collaborationsSection && typeof o.collaborationsSection === "object"
      ? (o.collaborationsSection as Record<string, unknown>)
      : null;
  const collaborationsSection = {
    badge:
      typeof csIn?.badge === "string" ? csIn.badge : def.collaborationsSection.badge,
    title:
      typeof csIn?.title === "string" ? csIn.title : def.collaborationsSection.title,
    intro:
      typeof csIn?.intro === "string" ? csIn.intro : def.collaborationsSection.intro,
  };

  const collaborations =
    Array.isArray(o.collaborations) && o.collaborations.length > 0
      ? o.collaborations.map((c, i) =>
          mergeCollaboration(
            c as Partial<ResearchCollaboration>,
            def.collaborations[i] ?? def.collaborations[0],
          ),
        )
      : def.collaborations;

  const ctaIn = o.cta && typeof o.cta === "object" ? (o.cta as Record<string, unknown>) : null;
  const primaryIn =
    ctaIn?.primary && typeof ctaIn.primary === "object"
      ? (ctaIn.primary as Record<string, unknown>)
      : null;
  const secondaryIn =
    ctaIn?.secondary && typeof ctaIn.secondary === "object"
      ? (ctaIn.secondary as Record<string, unknown>)
      : null;
  const cta = {
    badge:
      typeof ctaIn?.badge === "string" ? ctaIn.badge : def.cta.badge,
    title:
      typeof ctaIn?.title === "string" ? ctaIn.title : def.cta.title,
    intro:
      typeof ctaIn?.intro === "string" ? ctaIn.intro : def.cta.intro,
    primary: {
      href:
        typeof primaryIn?.href === "string"
          ? primaryIn.href
          : def.cta.primary.href,
      label:
        typeof primaryIn?.label === "string"
          ? primaryIn.label
          : def.cta.primary.label,
    },
    secondary: {
      href:
        typeof secondaryIn?.href === "string"
          ? secondaryIn.href
          : def.cta.secondary.href,
      label:
        typeof secondaryIn?.label === "string"
          ? secondaryIn.label
          : def.cta.secondary.label,
    },
  };

  return {
    hero,
    themesSection,
    themes,
    collaborationsSection,
    collaborations,
    cta,
  };
}
