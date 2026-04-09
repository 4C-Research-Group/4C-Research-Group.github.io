"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CircleHelp,
  Search,
  Target,
  ChevronRight,
  Check,
  ArrowRight,
  Brain,
  Heart,
  Eye,
} from "lucide-react";
import type {
  AboutPayload,
  AboutTone,
  HeroPillIcon,
  MissionCardIcon,
} from "@/data/about-defaults";
import { ABOUT_CARD_ACCENTS } from "@/data/about-defaults";
import { siteAsset } from "@/lib/site-path";

function publicImageSrc(url: string): string {
  const t = url.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  return siteAsset(t.startsWith("/") ? t : `/${t}`);
}

const HERO_PILL_ICONS: Record<HeroPillIcon, LucideIcon> = {
  brain: Brain,
  heart: Heart,
  eye: Eye,
};

const MISSION_ICONS: Record<MissionCardIcon, LucideIcon> = {
  circleHelp: CircleHelp,
  search: Search,
  target: Target,
};

const PILL_SURFACE: Record<AboutTone, string> = {
  cognition: "bg-cognition/10 text-cognition",
  consciousness: "bg-consciousness/10 text-consciousness",
  care: "bg-care/10 text-care",
};

const TONE_ICON_BG: Record<AboutTone, string> = {
  cognition: "bg-cognition/15",
  consciousness: "bg-consciousness/15",
  care: "bg-care/15",
};

const TONE_ICON_CLASS: Record<AboutTone, string> = {
  cognition: "text-cognition h-8 w-8",
  consciousness: "text-consciousness h-8 w-8",
  care: "text-care h-8 w-8",
};

export default function AboutMain({ about }: { about: AboutPayload }) {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/30">
        <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Brain className="h-4 w-4" />
              {about.hero.badge}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {about.hero.titleLine1}
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                {about.hero.titleLine2}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {about.hero.intro}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {about.hero.pills.map((pill) => {
                const Icon = HERO_PILL_ICONS[pill.icon];
                return (
                  <div
                    key={`${pill.label}-${pill.tone}`}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 ${PILL_SURFACE[pill.tone]}`}
                  >
                    <Icon className="h-4 w-4" />
                    {pill.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-care/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-40 left-1/3 h-64 w-64 rounded-full bg-consciousness/10 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto px-4 pb-20 sm:px-6">
          <motion.section
            className="py-16 sm:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {about.missionSection.eyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {about.missionSection.title}
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            </div>
            <motion.div
              className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.2,
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {about.missionSection.cards.map((item, index) => {
                const Icon = MISSION_ICONS[item.icon];
                const accent =
                  ABOUT_CARD_ACCENTS[
                    item.accentSlot % ABOUT_CARD_ACCENTS.length
                  ] ?? ABOUT_CARD_ACCENTS[0];
                return (
                  <motion.div
                    key={`${item.title}-${index}`}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5"
                  >
                    <div
                      className={`h-1.5 bg-linear-to-r ${accent}`}
                      aria-hidden
                    />
                    <div className="px-8 pb-8 pt-8">
                      <div className="flex justify-center">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${TONE_ICON_BG[item.tone]} ring-1 ring-brand/10 transition-transform duration-300 group-hover:scale-110`}
                        >
                          <Icon className={TONE_ICON_CLASS[item.tone]} />
                        </div>
                      </div>
                      <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            className="py-16 sm:py-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="order-2 lg:order-1">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  {about.whoWeAre.eyebrow}
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {about.whoWeAre.title}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {about.whoWeAre.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <Link
                  href={about.whoWeAre.ctaHref}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                >
                  {about.whoWeAre.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border/80 bg-muted shadow-xl shadow-brand/5 ring-1 ring-border/40">
                  <Image
                    src={publicImageSrc(about.whoWeAre.imageSrc)}
                    alt={about.whoWeAre.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <section className="py-16 sm:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {about.leadership.eyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {about.leadership.title}
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="mt-4 text-muted-foreground">
                {about.leadership.subtitle}
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <motion.div
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-br from-card via-background to-muted/30 shadow-lg shadow-brand/5 transition-all duration-500 hover:shadow-xl hover:shadow-brand/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-cognition/5 via-transparent to-care/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative p-8 md:p-12">
                  <div className="flex flex-col items-center space-y-6 md:flex-row md:items-start md:space-x-8 md:space-y-0">
                    <motion.div
                      className="relative shrink-0"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="relative aspect-4/5 w-32 overflow-hidden rounded-2xl border-4 border-background shadow-lg md:w-40">
                        <Image
                          src={publicImageSrc(about.leadership.piImageSrc)}
                          alt={about.leadership.piImageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, 160px"
                          priority
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-linear-to-r from-cognition to-care p-2 shadow-lg">
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex-1 text-center md:text-left"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                          {about.leadership.piName}
                        </h3>
                        <p className="text-sm font-medium text-brand">
                          {about.leadership.piRole}
                        </p>
                        <div className="mx-auto h-px w-16 bg-linear-to-r from-cognition via-care to-consciousness md:mx-0" />
                      </div>

                      <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {about.leadership.piBio}
                      </p>

                      <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <motion.div
                          className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {about.leadership.educationTitle}
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {about.leadership.educationBullets.map((line, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cognition" />
                                {line}
                              </li>
                            ))}
                          </ul>
                        </motion.div>

                        <motion.div
                          className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {about.leadership.researchBoxTitle}
                          </h4>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {about.leadership.researchBoxBody}
                          </p>
                        </motion.div>
                      </div>

                      <motion.div
                        className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {about.leadership.links.map((link) => {
                          const primaryCls =
                            "inline-flex items-center gap-2 rounded-full bg-linear-to-r from-cognition to-care px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand/25";
                          const outlineCls =
                            "inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-brand/40 hover:bg-brand/5 hover:text-brand";
                          if (link.external) {
                            return (
                              <a
                                key={link.href + link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={outlineCls}
                              >
                                {link.label}
                                <ChevronRight className="h-4 w-4" />
                              </a>
                            );
                          }
                          const cls =
                            link.variant === "primary" ? primaryCls : outlineCls;
                          return (
                            <Link
                              key={link.href + link.label}
                              href={link.href}
                              className={cls}
                            >
                              {link.label}
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <motion.section
            className="py-16 sm:py-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-lg shadow-brand/5 sm:p-10 md:p-12">
              <div className="mx-auto mb-10 max-w-3xl text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  {about.researchFocus.eyebrow}
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {about.researchFocus.title}
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {about.researchFocus.intro}
                </p>
              </div>

              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {about.researchFocus.keyAreasTitle}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {about.researchFocus.keyAreas.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:border-brand/20"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cognition/15 text-cognition">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {about.researchFocus.approachTitle}
                  </h3>
                  <div className="mt-5 space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {about.researchFocus.approachParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
