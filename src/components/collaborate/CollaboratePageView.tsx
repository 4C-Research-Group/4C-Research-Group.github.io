"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Handshake,
  ArrowRight,
  ExternalLink,
  Brain,
  Eye,
  Microscope,
  Building,
  Award,
  Lightbulb,
  Globe,
  Target,
  Zap,
} from "lucide-react";
import type { CollaboratePagePayload } from "@/data/collaborate-page";

const COLLAB_ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  eye: Eye,
  users: Users,
  handshake: Handshake,
  microscope: Microscope,
  building: Building,
  award: Award,
  lightbulb: Lightbulb,
  globe: Globe,
  target: Target,
  zap: Zap,
};

function iconFor(key: string): LucideIcon {
  return COLLAB_ICONS[key] ?? Users;
}

function oppColorClass(c: string): string {
  switch (c) {
    case "cognition":
      return "bg-cognition";
    case "consciousness":
      return "bg-consciousness";
    case "care":
      return "bg-care";
    case "brand":
    default:
      return "bg-brand";
  }
}

const PILL_STYLES = [
  "border-cognition/20 bg-cognition/5 text-cognition",
  "border-consciousness/20 bg-consciousness/5 text-consciousness",
  "border-care/20 bg-care/5 text-care",
] as const;

const spring = [0.22, 1, 0.36, 1] as const;

type Props = {
  content: CollaboratePagePayload;
};

export default function CollaboratePageView({ content }: Props) {
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  const BadgeIcon = iconFor(content.heroBadgeIcon);
  const Pill1Icon = iconFor(content.heroPill1Icon);
  const Pill2Icon = iconFor(content.heroPill2Icon);
  const Pill3Icon = iconFor(content.heroPill3Icon);
  const FundingBadgeIcon = iconFor(content.fundingBadgeIcon);
  const ContactPillIcon = iconFor(content.contactPillIcon);
  const DetectionCardIcon = iconFor(content.detectionCardIcon);
  const PredictionCardIcon = iconFor(content.predictionCardIcon);

  const heroPills = [
    { Icon: Pill1Icon, label: content.heroPill1, style: PILL_STYLES[0]! },
    { Icon: Pill2Icon, label: content.heroPill2, style: PILL_STYLES[1]! },
    { Icon: Pill3Icon, label: content.heroPill3, style: PILL_STYLES[2]! },
  ];

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
          className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-14">
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
                <BadgeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {content.heroBadge}
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {content.heroTitle}
                </span>
                <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                  {content.heroSubtitle}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {content.heroBody}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {heroPills.map(({ Icon, label, style }, i) => (
                  <span
                    key={`hero-pill-${i}`}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium sm:text-sm ${style}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    {label}
                  </span>
                ))}
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
              className="relative mx-auto w-full max-w-md lg:mx-0"
            >
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                  <Handshake className="h-5 w-5" aria-hidden />
                </div>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {content.focusTitle}
                </p>
                <dl className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Areas
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {content.opportunities.length}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Partners
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-care sm:text-2xl">
                      {content.partners.length}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Funders
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-cognition sm:text-2xl">
                      {content.funders.length}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.focusTitle}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.focusSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: spring }}
              className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-7 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:border-brand/20 hover:shadow-lg sm:p-8"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-cognition/15 blur-2xl"
                aria-hidden
              />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cognition/15 ring-1 ring-cognition/10">
                  <DetectionCardIcon
                    className="h-7 w-7 text-cognition sm:h-8 sm:w-8"
                    aria-hidden
                  />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {content.detectionTitle}
                </h3>
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  {content.detectionLead}
                </p>
                <ul className="space-y-3 border-l-2 border-cognition/25 pl-4">
                  {content.detectionBullets.map((text, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.06,
                ease: spring,
              }}
              className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-7 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:border-brand/20 hover:shadow-lg sm:p-8"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-consciousness/15 blur-2xl"
                aria-hidden
              />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-consciousness/15 ring-1 ring-consciousness/10">
                  <PredictionCardIcon
                    className="h-7 w-7 text-consciousness sm:h-8 sm:w-8"
                    aria-hidden
                  />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {content.predictionTitle}
                </h3>
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  {content.predictionLead}
                </p>
                <ul className="space-y-3 border-l-2 border-consciousness/25 pl-4">
                  {content.predictionBullets.map((text, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.partnershipTitle}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.partnershipSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {content.opportunities.map((opportunity, index) => {
              const OppIcon = iconFor(opportunity.icon);
              return (
                <motion.div
                  key={`opp-${index}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.3),
                    ease: spring,
                  }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="group relative"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl sm:p-7">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${oppColorClass(opportunity.color)} transition-transform duration-300 ${reduceMotion ? "" : "group-hover:scale-105"}`}
                    >
                      <OppIcon
                        className="h-7 w-7 text-primary-foreground"
                        aria-hidden
                      />
                    </div>
                    <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand sm:text-xl">
                      {opportunity.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                      {opportunity.description}
                    </p>
                    <ul className="mb-6 flex-1 space-y-2">
                      {opportunity.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep"
                    >
                      {content.explorePartnershipButtonText}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
            viewport={{ once: true, amount: 0.12 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.partnersTitle}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.partnersSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {content.partners.map((partner, index) => (
              <motion.a
                key={`partner-${index}`}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                  ease: spring,
                }}
                viewport={{ once: true, amount: 0.1 }}
                className="group"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lg">
                  <div
                    className={`mb-4 flex h-24 w-full items-center justify-center rounded-2xl border border-border/50 bg-muted/30 p-3 transition-transform duration-300 ${reduceMotion ? "" : "group-hover:scale-[1.02]"}`}
                  >
                    <Image
                      src={partner.imageSrc}
                      alt={`${partner.name} logo`}
                      width={160}
                      height={100}
                      className="h-full w-full object-contain"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 className="mb-1 text-base font-bold text-foreground transition-colors group-hover:text-brand">
                    {partner.name}
                  </h3>
                  <p className="mb-3 text-xs text-muted-foreground sm:text-sm">
                    {partner.type}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-brand">
                    <span>{content.partnersVisitLabel}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/15 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
            viewport={{ once: true, amount: 0.12 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
              <FundingBadgeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {content.fundingBadge}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.fundingTitle}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.fundingSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {content.funders.map((funder, index) => (
              <motion.div
                key={`funder-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                  ease: spring,
                }}
                viewport={{ once: true, amount: 0.08 }}
                className="group"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-4 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lg">
                  <div
                    className={`mb-3 flex justify-center ${reduceMotion ? "" : "transition-transform duration-300 group-hover:scale-[1.02]"}`}
                  >
                    <div className="flex h-16 w-full items-center justify-center rounded-2xl border border-border/50 bg-muted/30 p-2">
                      <Image
                        src={funder.imageSrc}
                        alt={`${funder.name} logo`}
                        width={120}
                        height={80}
                        className="h-full w-full object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  {funder.amount.trim() ? (
                    <div className="mb-2 rounded-xl border border-brand/15 bg-brand/10 px-2 py-2 text-center">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {content.funderAmountCaption}
                      </p>
                      <p className="text-xs font-bold leading-tight text-brand">
                        {funder.amount}
                      </p>
                    </div>
                  ) : null}
                  <h3 className="mb-1 text-center text-sm font-bold text-foreground transition-colors group-hover:text-brand">
                    {funder.name}
                  </h3>
                  <p className="mb-3 text-center text-xs text-muted-foreground">
                    {funder.type}
                  </p>
                  {funder.link.trim() ? (
                    <div className="mt-auto">
                      <a
                        href={funder.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-brand px-2 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                      >
                        {content.funderButtonLabel}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="pb-20 sm:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: spring }}
            viewport={{ once: true, amount: 0.12 }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border/50 shadow-2xl ring-1 ring-black/[0.04]">
              <div className="relative overflow-hidden bg-linear-to-br from-cognition via-brand to-care px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-care/30 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
                    <ContactPillIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {content.contactPill}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {content.contactTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
                    {content.contactBody}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 bg-card/95 p-6 sm:p-10">
                <div className="grid gap-10 md:grid-cols-2 md:gap-12">
                  <div>
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-foreground">
                      {content.getInTouchTitle}
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                          <Mail className="h-5 w-5 text-brand" aria-hidden />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {content.contactEmailLabel}
                          </p>
                          <a
                            href={`mailto:${content.contactEmail}`}
                            className="text-sm font-medium text-brand transition-colors hover:text-brand-deep"
                          >
                            {content.contactEmail}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                          <Phone className="h-5 w-5 text-brand" aria-hidden />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {content.contactPhoneLabel}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {content.contactPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                          <MapPin className="h-5 w-5 text-brand" aria-hidden />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {content.contactLocationLabel}
                          </p>
                          <p className="whitespace-pre-line text-sm text-muted-foreground">
                            {content.contactLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-foreground">
                      {content.researchAreasTitle}
                    </h3>
                    <div className="space-y-3">
                      {content.researchAreas.map((area, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10">
                            <Target className="h-3.5 w-3.5 text-brand" aria-hidden />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {area}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-border/60 pt-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {content.connectTitle}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {content.connectSubtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={content.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep"
                      >
                        {content.googleScholarLabel}
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                      <a
                        href={content.researchGateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:bg-brand/5"
                      >
                        {content.researchGateLabel}
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
