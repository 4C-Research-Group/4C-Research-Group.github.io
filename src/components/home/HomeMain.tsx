"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Activity,
  Eye,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  Mail,
  Twitter,
  Microscope,
  Zap,
  ChevronDown,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import type { Project } from "@/data/projectsData";
import type {
  HomepagePayload,
  PillIcon,
  PillTone,
  StatIcon,
  ThemeColor,
  ThemeIcon,
} from "@/data/homepage-defaults";
import { projectDetailHref } from "@/lib/projects/project-detail-href";
import {
  HeroGradientBackdrop,
  HeroLogoGlow,
} from "@/components/HeroGradientBackdrop";
import { HeroLabSnapshots } from "@/components/HeroLabSnapshots";
import { siteAsset } from "@/lib/site-path";

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A";

function publicImageSrc(url: string): string {
  const t = url.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  return siteAsset(t.startsWith("/") ? t : `/${t}`);
}

function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const PILL_ICONS: Record<PillIcon, LucideIcon> = {
  brain: Brain,
  microscope: Microscope,
  zap: Zap,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  brain: Brain,
  book: BookOpen,
  users: Users,
  award: Award,
};

const THEME_ICONS: Record<ThemeIcon, LucideIcon> = {
  brain: Brain,
  activity: Activity,
  eye: Eye,
  users: Users,
};

const THEME_BG: Record<ThemeColor, string> = {
  cognition: "bg-cognition",
  consciousness: "bg-consciousness",
  care: "bg-care",
  brand: "bg-brand",
};

function pillToneClass(tone: PillTone): string {
  switch (tone) {
    case "cognition":
      return "text-cognition hover:border-cognition/30 hover:bg-cognition/5";
    case "consciousness":
      return "text-consciousness hover:border-consciousness/30 hover:bg-consciousness/5";
    case "care":
      return "text-care hover:border-care/30 hover:bg-care/5";
    default:
      return "";
  }
}

function HeroCta({
  label,
  href,
  variant,
  showArrow,
}: HomepagePayload["hero"]["ctas"][number]) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors";
  if (variant === "primary") {
    return (
      <SmartLink
        href={href}
        className={`${base} bg-brand px-6 py-3 text-primary-foreground shadow-sm hover:bg-brand-deep`}
      >
        {label}
        {showArrow ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
      </SmartLink>
    );
  }
  if (variant === "outline") {
    return (
      <SmartLink
        href={href}
        className={`${base} border border-border bg-background px-6 py-3 text-foreground hover:border-brand/35 hover:bg-brand/5`}
      >
        {label}
      </SmartLink>
    );
  }
  return (
    <SmartLink
      href={href}
      className={`${base} px-4 py-3 font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground`}
    >
      {label}
    </SmartLink>
  );
}

export default function HomeMain({
  home,
  featuredProjects,
}: {
  home: HomepagePayload;
  featuredProjects: Project[];
}) {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center overflow-hidden border-b border-border/50 bg-linear-to-br from-slate-50 via-background to-brand-light/40">
        <HeroGradientBackdrop />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-w-0 lg:col-span-7"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <Sparkles className="h-3.5 w-3.5 text-brand/80" aria-hidden />
                {home.hero.badge}
              </div>

              <h1 className="text-[2.25rem] font-bold uppercase leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {home.hero.titleHighlight}
                  {home.hero.titleRest}
                </span>
              </h1>
              <p className="mt-2 text-sm font-medium uppercase leading-snug tracking-wider text-muted-foreground sm:text-base">
                {home.hero.tagline}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                {home.hero.lead}
              </p>

              {(home.hero.knowledgeMobilization.message.trim() ||
                home.hero.knowledgeMobilization.linkLabel.trim()) && (
                <div className="mt-6 max-w-xl rounded-xl border border-care/30 bg-care/[0.07] px-4 py-3.5 dark:border-care/25 dark:bg-care/[0.09]">
                  {home.hero.knowledgeMobilization.message.trim() ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {home.hero.knowledgeMobilization.message.trim()}
                    </p>
                  ) : null}
                  {home.hero.knowledgeMobilization.linkLabel.trim() ? (
                    <SmartLink
                      href={
                        home.hero.knowledgeMobilization.linkHref.trim() ||
                        "/knowledge-mobilization/"
                      }
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-care underline-offset-2 transition hover:text-care/90 hover:underline"
                    >
                      <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
                      {home.hero.knowledgeMobilization.linkLabel.trim()}
                      <ArrowRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
                    </SmartLink>
                  ) : null}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
                {home.hero.pills.map((pill) => {
                  const Icon = PILL_ICONS[pill.icon];
                  return (
                    <SmartLink
                      key={`${pill.href}-${pill.label}`}
                      href={pill.href}
                      className={`inline-flex items-center gap-2 rounded-full border border-border/90 bg-background/90 px-3.5 py-1.5 text-sm font-medium transition-colors ${pillToneClass(pill.tone)}`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                      {pill.label}
                    </SmartLink>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {home.hero.ctas.map((cta) => (
                  <HeroCta key={`${cta.href}-${cta.label}`} {...cta} />
                ))}
              </div>

              <p className="mt-8 max-w-lg border-l border-brand/25 pl-4 text-sm leading-relaxed text-muted-foreground">
                {home.hero.partnerBlurb}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-[1] flex min-w-0 flex-col items-center justify-center gap-6 lg:col-span-5"
            >
              <div className="flex max-w-[min(100%,28rem)] flex-col items-center text-center sm:max-w-[30rem]">
                <HeroLogoGlow>
                  <Image
                    src={publicImageSrc(home.hero.heroLogoSrc)}
                    alt="4C Research Group logo"
                    width={400}
                    height={400}
                    loading="eager"
                    className="h-72 w-72 rounded-2xl object-cover shadow-lg ring-1 ring-black/5 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
                    priority
                  />
                </HeroLogoGlow>
                <HeroLabSnapshots items={home.heroSnapshots} />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
        >
          <a
            href="#mission"
            className="pointer-events-auto group flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Continue
            </span>
            <ChevronDown
              className="h-5 w-5 motion-safe:animate-bounce opacity-80 group-hover:opacity-100"
              aria-hidden
            />
          </a>
        </motion.div>
      </section>

      <section
        id="mission"
        className="py-20 bg-linear-to-br from-slate-50 to-brand-light"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  {home.mission.title}
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  {home.mission.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                <Image
                  src={publicImageSrc(home.mission.imageSrc)}
                  alt={home.mission.imageAlt}
                  fill
                  className="w-full h-96 object-cover"
                  loading="lazy"
                  priority={false}
                  placeholder="blur"
                  blurDataURL={BLUR}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <p className="text-sm font-semibold text-brand">
                      {home.mission.overlayTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {home.mission.overlaySubtitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-consciousness/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {home.gallery.title}
              </h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-xl">
                {home.gallery.subtitle}
              </p>
            </div>

            <Link
              href={home.gallery.viewAllHref}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              {home.gallery.viewAllLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-5">
            {home.gallery.items.map((item, index) => (
              <motion.div
                key={`${item.imageSrc}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`relative group overflow-hidden rounded-3xl ${item.span}`}
              >
                <Image
                  src={publicImageSrc(item.imageSrc)}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  priority={false}
                  placeholder="blur"
                  blurDataURL={BLUR}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/80 backdrop-blur-md text-xs px-3 py-1 rounded-full shadow">
                    Lab Moment
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <Link
              href={home.gallery.bottomCtaHref}
              className="inline-flex items-center gap-3 bg-white border border-border px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <span className="font-semibold text-foreground">
                {home.gallery.bottomCtaLabel}
              </span>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 bg-linear-to-r from-brand via-cognition to-consciousness text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {home.impact.title}
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              {home.impact.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {home.impact.stats.map((stat, index) => {
              const Icon = STAT_ICONS[stat.icon];
              return (
                <motion.div
                  key={`${stat.label}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 transition-all duration-300">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-white/90" />
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-white/80 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {home.researchThemes.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {home.researchThemes.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {home.researchThemes.themes.map((theme, index) => {
              const Icon = THEME_ICONS[theme.icon];
              return (
                <motion.div
                  key={`${theme.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-linear-to-br from-muted to-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${THEME_BG[theme.color]} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {theme.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{theme.description}</p>
                  <ul className="space-y-2">
                    {theme.projects.map((project, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-brand rounded-full mr-2"></span>
                        {project}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-slate-50 to-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-cognition to-brand mb-6 shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {home.news.title}
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl border border-border/60 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                      {home.news.articleTitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {home.news.articleBody}
                    </p>
                    <a
                      href={home.news.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-linear-to-r from-brand to-cognition text-white px-6 py-3 rounded-full font-semibold hover:from-brand-deep hover:to-cognition-deep transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span>{home.news.ctaLabel}</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="md:w-48 shrink-0">
                    <div className="relative h-48">
                      <Image
                        src={publicImageSrc(home.news.imageSrc)}
                        alt={home.news.imageAlt}
                        fill
                        className="w-full h-48 object-cover rounded-2xl"
                        loading="lazy"
                        priority={false}
                        placeholder="blur"
                        blurDataURL={BLUR}
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {home.news.badgeLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-muted-foreground">
                {home.news.footerNote}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-brand-light to-muted">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {home.featured.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {home.featured.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border group"
              >
                <div className="h-48 bg-linear-to-br from-brand to-consciousness flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={publicImageSrc(
                      project.images[0] || "/images/placeholder.jpg",
                    )}
                    alt={project.title}
                    fill
                    className="w-full h-full object-cover"
                    loading="lazy"
                    priority={false}
                    placeholder="blur"
                    blurDataURL={BLUR}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-semibold text-white bg-brand/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-brand bg-brand-light px-3 py-1 rounded-full">
                      {project.funding || "Research"}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{project.teamMembers?.length || 0} members</span>
                    </div>
                    <Link
                      href={projectDetailHref(project.id)}
                      className="text-brand hover:text-brand-deep font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href={home.featured.viewAllHref}
              className="inline-flex items-center gap-2 bg-linear-to-r from-brand to-cognition text-white px-8 py-3 rounded-full font-semibold hover:from-brand-deep hover:to-cognition-deep transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{home.featured.viewAllLabel}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 bg-linear-to-br from-brand via-cognition to-consciousness text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {home.join.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12">
              {home.join.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <SmartLink
                href={home.join.primaryCtaHref}
                className="inline-flex items-center gap-3 bg-white text-brand px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Users className="w-5 h-5" />
                <span>{home.join.primaryCtaLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </SmartLink>

              <SmartLink
                href={home.join.secondaryCtaHref}
                className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-brand transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                <span>{home.join.secondaryCtaLabel}</span>
              </SmartLink>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="pointer-events-none absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      </section>

      <section className="py-16 bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-brand to-cognition mb-6 shadow-lg">
              <Twitter className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {home.social.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {home.social.eyebrow}
            </p>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {home.social.body}
            </p>

            <motion.a
              href={home.social.buttonHref}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Twitter className="w-5 h-5" />
              <span>{home.social.buttonLabel}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <div className="mt-12 flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="w-2 h-2 rounded-full bg-linear-to-r from-brand to-cognition"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
