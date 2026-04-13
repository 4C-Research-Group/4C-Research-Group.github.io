"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  Sparkles,
  Layers,
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
  cognition:
    "border border-cognition/20 bg-cognition/5 text-cognition",
  consciousness:
    "border border-consciousness/20 bg-consciousness/5 text-consciousness",
  care: "border border-care/20 bg-care/5 text-care",
};

const TONE_ICON_BG: Record<AboutTone, string> = {
  cognition: "bg-cognition/15",
  consciousness: "bg-consciousness/15",
  care: "bg-care/15",
};

const TONE_ICON_CLASS: Record<AboutTone, string> = {
  cognition: "text-cognition h-7 w-7 sm:h-8 sm:w-8",
  consciousness: "text-consciousness h-7 w-7 sm:h-8 sm:w-8",
  care: "text-care h-7 w-7 sm:h-8 sm:w-8",
};

const spring = [0.22, 1, 0.36, 1] as const;

export default function AboutMain({ about }: { about: AboutPayload }) {
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-slate-50/95 via-background to-background">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-black/5 mask-[linear-gradient(180deg,white,transparent_80%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full bg-brand/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/3 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(260px,360px)] lg:gap-14">
            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: spring,
              }}
              className="text-center lg:text-left"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {about.hero.badge}
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {about.hero.titleLine1}
                </span>
                <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                  {about.hero.titleLine2}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {about.hero.intro}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {about.hero.pills.map((pill) => {
                  const Icon = HERO_PILL_ICONS[pill.icon];
                  return (
                    <span
                      key={`${pill.label}-${pill.tone}`}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium sm:text-sm ${PILL_SURFACE[pill.tone]}`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                      {pill.label}
                    </span>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.06,
                ease: spring,
              }}
              className="relative mx-auto w-full max-w-sm lg:mx-0"
            >
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                  <Layers className="h-5 w-5" aria-hidden />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/90">
                  {about.missionSection.eyebrow}
                </p>
                <p className="mt-2 text-lg font-bold leading-snug tracking-tight text-foreground">
                  {about.missionSection.title}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-24 h-64 w-64 rounded-full bg-cognition/8 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <motion.section
            className="border-b border-border/40 py-16 sm:py-20"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
          >
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                {about.missionSection.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {about.missionSection.title}
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {about.missionSection.cards.map((item, index) => {
                const Icon = MISSION_ICONS[item.icon];
                const accent =
                  ABOUT_CARD_ACCENTS[
                    item.accentSlot % ABOUT_CARD_ACCENTS.length
                  ] ?? ABOUT_CARD_ACCENTS[0];
                return (
                  <motion.article
                    key={`${item.title}-${index}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.38,
                      delay: reduceMotion ? 0 : index * 0.06,
                      ease: spring,
                    }}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 text-center shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lg"
                  >
                    <div
                      className={`h-1 bg-linear-to-r ${accent}`}
                      aria-hidden
                    />
                    <div className="flex flex-1 flex-col px-6 pb-7 pt-7 sm:px-7">
                      <div className="flex justify-center">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${TONE_ICON_BG[item.tone]} ring-1 ring-black/[0.04] transition-transform duration-300 group-hover:scale-105`}
                        >
                          <Icon className={TONE_ICON_CLASS[item.tone]} aria-hidden />
                        </div>
                      </div>
                      <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            className="py-16 sm:py-20"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
          >
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                  {about.whoWeAre.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {about.whoWeAre.title}
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care lg:mx-0" />
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {about.whoWeAre.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <Link
                  href={about.whoWeAre.ctaHref}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep"
                >
                  {about.whoWeAre.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div
                    className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/20 via-brand/10 to-care/20 opacity-80 blur-md"
                    aria-hidden
                  />
                  <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg ring-1 ring-black/[0.04]">
                    <Image
                      src={publicImageSrc(about.whoWeAre.imageSrc)}
                      alt={about.whoWeAre.imageAlt}
                      fill
                      className="object-cover transition duration-700 hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <section className="py-16 sm:py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                {about.leadership.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {about.leadership.title}
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                {about.leadership.subtitle}
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <motion.div
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-lg ring-1 ring-black/[0.03] transition duration-300 hover:border-brand/20 hover:shadow-xl"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: spring }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-cognition/[0.06] via-transparent to-care/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative p-6 md:p-10 lg:p-12">
                  <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                    <motion.div
                      className="relative shrink-0"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: reduceMotion ? 0 : 0.4 }}
                    >
                      <div className="relative aspect-4/5 w-36 overflow-hidden rounded-2xl border-2 border-border/60 shadow-md ring-2 ring-brand/10 md:w-44">
                        <Image
                          src={publicImageSrc(about.leadership.piImageSrc)}
                          alt={about.leadership.piImageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 144px, 176px"
                          priority
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-cognition to-care shadow-md ring-2 ring-background">
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      </div>
                    </motion.div>

                    <div className="min-w-0 flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {about.leadership.piName}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-brand">
                        {about.leadership.piRole}
                      </p>
                      <div className="mx-auto mt-3 h-px w-16 bg-linear-to-r from-cognition via-care to-consciousness md:mx-0" />

                      <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {about.leadership.piBio}
                      </p>

                      <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            {about.leadership.educationTitle}
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {about.leadership.educationBullets.map((line, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cognition" />
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            {about.leadership.researchBoxTitle}
                          </h4>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {about.leadership.researchBoxBody}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start">
                        {about.leadership.links.map((link) => {
                          const primaryCls =
                            "inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cognition via-brand to-care px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-95";
                          const outlineCls =
                            "inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:bg-brand/5";
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
                                <ChevronRight className="h-4 w-4" aria-hidden />
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
                              <ChevronRight className="h-4 w-4" aria-hidden />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <motion.section
            className="border-y border-border/40 bg-muted/20 py-16 sm:py-20"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
          >
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-10 md:p-12">
              <div className="mx-auto mb-10 max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                  {about.researchFocus.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {about.researchFocus.title}
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {about.researchFocus.intro}
                </p>
              </div>

              <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {about.researchFocus.keyAreasTitle}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {about.researchFocus.keyAreas.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground transition hover:border-brand/25"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cognition/15 text-cognition">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
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
                  <div className="mt-5 space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
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
