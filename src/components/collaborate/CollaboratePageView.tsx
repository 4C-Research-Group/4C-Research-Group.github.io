"use client";

import { motion } from "framer-motion";
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

type Props = {
  content: CollaboratePagePayload;
};

export default function CollaboratePageView({ content }: Props) {
  const BadgeIcon = iconFor(content.heroBadgeIcon);
  const Pill1Icon = iconFor(content.heroPill1Icon);
  const Pill2Icon = iconFor(content.heroPill2Icon);
  const Pill3Icon = iconFor(content.heroPill3Icon);
  const FundingBadgeIcon = iconFor(content.fundingBadgeIcon);
  const ContactPillIcon = iconFor(content.contactPillIcon);
  const DetectionCardIcon = iconFor(content.detectionCardIcon);
  const PredictionCardIcon = iconFor(content.predictionCardIcon);

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
              <BadgeIcon className="h-4 w-4" />
              {content.heroBadge}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {content.heroTitle}
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                {content.heroSubtitle}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {content.heroBody}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <Pill1Icon className="h-4 w-4" />
                {content.heroPill1}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Pill2Icon className="h-4 w-4" />
                {content.heroPill2}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Pill3Icon className="h-4 w-4" />
                {content.heroPill3}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.focusTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {content.focusSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cognition/5 via-background to-consciousness/5 p-8 shadow-lg"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cognition/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cognition/15">
                  <DetectionCardIcon className="h-8 w-8 text-cognition" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  {content.detectionTitle}
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  {content.detectionLead}
                </p>
                <ul className="space-y-3">
                  {content.detectionBullets.map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cognition" />
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-consciousness/5 via-background to-care/5 p-8 shadow-lg"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-consciousness/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-consciousness/15">
                  <PredictionCardIcon className="h-8 w-8 text-consciousness" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  {content.predictionTitle}
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  {content.predictionLead}
                </p>
                <ul className="space-y-3">
                  {content.predictionBullets.map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-consciousness" />
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-linear-to-br from-slate-50 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.partnershipTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {content.partnershipSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.opportunities.map((opportunity, index) => {
              const OppIcon = iconFor(opportunity.icon);
              return (
                <motion.div
                  key={`opp-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${oppColorClass(opportunity.color)} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <OppIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-foreground transition-colors group-hover:text-brand">
                      {opportunity.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {opportunity.description}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {opportunity.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                    >
                      {content.explorePartnershipButtonText}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.partnersTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {content.partnersSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.partners.map((partner, index) => (
              <motion.a
                key={`partner-${index}`}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                  <div className="mb-4 flex h-24 w-full items-center justify-center rounded-xl bg-linear-to-br from-slate-50 to-slate-100 p-3 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={partner.imageSrc}
                      alt={`${partner.name} logo`}
                      width={160}
                      height={100}
                      className="h-full w-full object-contain"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-brand">
                    {partner.name}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {partner.type}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-brand transition-opacity duration-300">
                    <span>{content.partnersVisitLabel}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-linear-to-br from-slate-50 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <FundingBadgeIcon className="h-4 w-4" />
              {content.fundingBadge}
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.fundingTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {content.fundingSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.funders.map((funder, index) => (
              <motion.div
                key={`funder-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-16 w-full items-center justify-center rounded-xl bg-linear-to-br from-slate-50 to-slate-100 p-2 transition-transform duration-300 group-hover:scale-105">
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
                    <div className="mb-2 rounded-lg bg-brand/10 px-2 py-1 text-center">
                      <p className="text-xs font-medium text-muted-foreground">
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
                        className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-brand px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-deep"
                      >
                        {content.funderButtonLabel}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-muted/30 shadow-xl">
              <div className="bg-linear-to-br from-brand to-cognition p-8 text-white">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                  <ContactPillIcon className="h-4 w-4" />
                  {content.contactPill}
                </div>
                <h2 className="mb-4 text-3xl font-bold">{content.contactTitle}</h2>
                <p className="text-lg leading-relaxed">{content.contactBody}</p>
              </div>

              <div className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-foreground">
                      {content.getInTouchTitle}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                          <Mail className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {content.contactEmailLabel}
                          </p>
                          <a
                            href={`mailto:${content.contactEmail}`}
                            className="text-brand transition-colors hover:text-brand-deep"
                          >
                            {content.contactEmail}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                          <Phone className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {content.contactPhoneLabel}
                          </p>
                          <p className="text-muted-foreground">
                            {content.contactPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                          <MapPin className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {content.contactLocationLabel}
                          </p>
                          <p className="whitespace-pre-line text-muted-foreground">
                            {content.contactLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-6 text-xl font-bold text-foreground">
                      {content.researchAreasTitle}
                    </h3>
                    <div className="space-y-3">
                      {content.researchAreas.map((area, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10">
                            <Target className="h-3 w-3 text-brand" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {area}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        {content.connectTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {content.connectSubtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={content.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                      >
                        {content.googleScholarLabel}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href={content.researchGateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
                      >
                        {content.researchGateLabel}
                        <ExternalLink className="h-4 w-4" />
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
