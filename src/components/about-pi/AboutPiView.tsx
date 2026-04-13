"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  GraduationCap,
  HeartHandshake,
  Languages as LanguagesIcon,
  MapPin,
  Mic,
  Quote,
  Scale,
  Stethoscope,
  Star,
} from "lucide-react";
import { FaGoogle, FaLinkedin, FaResearchgate } from "react-icons/fa";
import { SiOrcid } from "react-icons/si";
import type {
  AboutPiPagePayload,
  PiBiographical,
  PiInvitedLecture,
  PiLanguage,
  PiLicense,
  PiOrganization,
  PiPeerReviewBlock,
  PiPublicationHighlight,
  PiRecommendation,
  PiTitleSubtitle,
  PiVolunteer,
} from "@/data/about-pi";

const SKILL_PILL_STYLES = [
  "bg-cognition/12 text-foreground border-cognition/20",
  "bg-care/12 text-foreground border-care/20",
  "bg-consciousness/12 text-foreground border-consciousness/20",
] as const;

function sectionTitleClass(variant: 0 | 1 | 2) {
  const gradients = [
    "from-cognition via-brand to-care",
    "from-care via-cognition to-brand",
    "from-consciousness via-care to-cognition",
  ] as const;
  return `bg-linear-to-r ${gradients[variant]} bg-clip-text text-transparent`;
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-6 shadow-xl shadow-black/[0.04] ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-8 md:p-10 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand/40 to-transparent"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </motion.section>
  );
}

const HEADER_ICON_STYLES = [
  "bg-cognition/12 text-cognition ring-cognition/15",
  "bg-care/12 text-care ring-care/15",
  "bg-consciousness/12 text-consciousness ring-consciousness/15",
] as const;

function SectionHeader({
  icon: Icon,
  title,
  variant,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  variant: 0 | 1 | 2;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 sm:gap-4">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ${HEADER_ICON_STYLES[variant]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h2
        className={`text-2xl font-bold tracking-tight sm:text-[1.65rem] ${sectionTitleClass(variant)}`}
      >
        {title}
      </h2>
    </div>
  );
}

function TitleSubtitleGrid({
  items,
  accent,
  /** `single` = one column (narrow); `double` = max two columns at sm+; default = 2 cols sm, 3 cols lg */
  columnLayout,
  noteSize = "xs",
}: {
  items: PiTitleSubtitle[];
  accent: 0 | 1 | 2;
  columnLayout?: "default" | "single" | "double";
  noteSize?: "xs" | "sm";
}) {
  const titleColors = [
    "text-cognition",
    "text-care",
    "text-consciousness",
  ] as const;
  const gridClass =
    columnLayout === "single"
      ? "mx-auto grid max-w-none grid-cols-1 gap-4 lg:max-w-4xl"
      : columnLayout === "double"
        ? "mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
        : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  const noteClass =
    noteSize === "sm"
      ? "mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line"
      : "mt-2 text-xs text-muted-foreground whitespace-pre-line";
  return (
    <div className={gridClass}>
      {items.map((item, idx) => (
        <div
          key={`${item.title}-${idx}`}
          className="flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-muted/20 p-4 shadow-sm ring-1 ring-black/[0.02] transition hover:border-brand/30 hover:shadow-md"
        >
          <div className={`font-semibold ${titleColors[accent]}`}>
            {item.title}
          </div>
          {item.subtitle ? (
            <div className="mt-1 text-sm text-muted-foreground">
              {item.subtitle}
            </div>
          ) : null}
          {item.note ? <div className={noteClass}>{item.note}</div> : null}
        </div>
      ))}
    </div>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-card/70 text-brand shadow-sm backdrop-blur-sm transition hover:border-brand/35 hover:bg-brand/[0.06] hover:text-brand-deep"
    >
      {children}
    </a>
  );
}

function BiographicalBlock({ bio }: { bio: PiBiographical }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Legal name
          </div>
          <p className="mt-1">{bio.legalName}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Practice location
          </div>
          <address className="mt-1 not-italic">
            {bio.practiceLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Contact
          </div>
          <p className="mt-1">Tel: {bio.telephone}</p>
          <p>Fax: {bio.fax}</p>
          <div className="mt-1">
            <span className="text-foreground">Email: </span>
            {bio.emails.map((e, i) => (
              <span key={e}>
                {i > 0 ? " · " : ""}
                <a
                  href={`mailto:${e}`}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {e}
                </a>
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Administrative assistant
          </div>
          <p className="mt-1">{bio.administrativeAssistant}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Published author names
          </div>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {bio.publishedAuthorLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AboutPiView({ d }: { d: AboutPiPagePayload }) {
  const titlePills = d.title.split("|").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/35 via-background to-muted/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] mask-[linear-gradient(180deg,black,transparent_92%)] bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[48px_48px]"
        aria-hidden
      />

      <section className="relative overflow-hidden border-b border-border/60 bg-linear-to-br from-brand-light/50 via-background/95 to-consciousness/[0.08]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/50 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-6 top-16 h-48 w-48 rounded-full bg-cognition/14 blur-3xl md:left-16 md:h-72 md:w-72" />
          <div className="absolute right-8 top-32 h-56 w-56 rounded-full bg-consciousness/12 blur-3xl md:right-24 md:h-96 md:w-96" />
          <div className="absolute bottom-8 left-1/3 h-52 w-52 rounded-full bg-care/12 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <Link
            href="/about/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            About the lab
          </Link>

          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-start md:gap-10 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="group relative shrink-0"
            >
              <span className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/30 via-brand/20 to-care/25 opacity-60 blur-lg transition group-hover:opacity-90" />
              <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-border/80 shadow-xl shadow-black/[0.08] ring-2 ring-card sm:h-44 sm:w-44 md:h-48 md:w-48">
                <Image
                  src={d.imageSrc}
                  alt={d.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
                  priority
                  sizes="(max-width: 768px) 176px, 192px"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="min-w-0 flex-1 text-center md:text-left"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Principal investigator
              </p>
              <h1 className="mt-2 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-[2.35rem] md:leading-[1.15]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {d.name}
                </span>
              </h1>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {titlePills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-border/70 bg-card/80 px-3.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm sm:text-sm"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {d.datePrepared ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Curriculum vitae current as of{" "}
                  <time dateTime={d.datePrepared}>{d.datePrepared}</time>
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {d.linkedinUrl?.trim() ? (
                  <SocialButton href={d.linkedinUrl.trim()} label="LinkedIn">
                    <FaLinkedin className="h-5 w-5" />
                  </SocialButton>
                ) : null}
                {d.googleScholarUrl?.trim() ? (
                  <SocialButton
                    href={d.googleScholarUrl.trim()}
                    label="Google Scholar"
                  >
                    <FaGoogle className="h-5 w-5" />
                  </SocialButton>
                ) : null}
                {d.researchgateUrl?.trim() ? (
                  <SocialButton
                    href={d.researchgateUrl.trim()}
                    label="ResearchGate"
                  >
                    <FaResearchgate className="h-5 w-5" />
                  </SocialButton>
                ) : null}
                {d.orcidUrl?.trim() ? (
                  <SocialButton href={d.orcidUrl.trim()} label="ORCID">
                    <SiOrcid className="h-5 w-5" />
                  </SocialButton>
                ) : null}
              </div>

              <ul className="mt-6 list-none space-y-2 border-t border-border/60 pt-6 text-left">
                {d.heroLines.map((line, i) => (
                  <li
                    key={`hero-line-${i}`}
                    className={`${
                      i === 0
                        ? "text-sm font-medium leading-snug text-foreground sm:text-base"
                        : "text-xs leading-snug text-muted-foreground sm:text-sm"
                    }`}
                  >
                    {line}
                  </li>
                ))}
              </ul>
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
          className="pointer-events-none absolute bottom-40 right-0 h-72 w-72 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative z-10 mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
          <SectionShell>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              Overview
            </span>
            <h2
              className={`mt-2 text-2xl font-bold tracking-tight sm:text-[1.65rem] ${sectionTitleClass(0)}`}
            >
              About
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {d.aboutIntro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={MapPin}
              title="Biographical & contact"
              variant={1}
            />
            <BiographicalBlock bio={d.biographical} />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Stethoscope}
              title="Current positions & leadership"
              variant={0}
            />
            <TitleSubtitleGrid items={[...d.currentPositions]} accent={0} />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={GraduationCap}
              title="Education & training"
              variant={1}
            />
            <TitleSubtitleGrid items={[...d.education]} accent={1} />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Briefcase}
              title="Professional experience"
              variant={2}
            />
            <TitleSubtitleGrid
              items={[...d.professionalExperience]}
              accent={2}
            />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Brain}
              title="Honors, awards & recognition"
              variant={0}
            />
            <TitleSubtitleGrid items={[...d.researchAwards]} accent={0} />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={GraduationCap}
              title="Trainee scholarships & awards"
              variant={1}
            />
            <TitleSubtitleGrid items={[...d.traineeScholarAwards]} accent={1} />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Star}
              title="Leadership development awards"
              variant={2}
            />
            <TitleSubtitleGrid
              items={[...d.leadershipDevelopmentAwards]}
              accent={2}
            />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={DollarSign}
              title="Peer-reviewed grants & funding"
              variant={0}
            />
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Ongoing
            </h3>
            <TitleSubtitleGrid
              items={[...d.grantsOngoing]}
              accent={0}
              noteSize="sm"
            />
            <h3 className="mb-3 mt-8 text-sm font-semibold text-foreground">
              Completed
            </h3>
            <TitleSubtitleGrid
              items={[...d.grantsCompleted]}
              accent={1}
              noteSize="sm"
            />
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={LanguagesIcon}
              title="Language proficiency"
              variant={1}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.languages.map((lang: PiLanguage) => (
                <div
                  key={lang.language}
                  className="rounded-2xl border border-border/70 bg-muted/20 p-4 ring-1 ring-black/[0.02] shadow-sm"
                >
                  <div className="font-semibold text-care">{lang.language}</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {lang.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader icon={Mic} title="Invited lectures" variant={2} />
            <details className="group overflow-hidden rounded-2xl border border-border/70 bg-muted/15 shadow-sm ring-1 ring-black/[0.02]">
              <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted/40 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  Show all invited lectures & presentations (
                  {d.invitedLectures.length})
                </span>
                <span className="hidden group-open:inline">
                  Hide invited lectures & presentations
                </span>
              </summary>
              <div className="max-h-[28rem] space-y-3 overflow-y-auto border-t border-border/60 bg-card/30 px-4 py-3">
                {d.invitedLectures.map((lec: PiInvitedLecture, idx) => (
                  <div
                    key={`${lec.title}-${lec.year}-${idx}`}
                    className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm shadow-sm"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-medium text-cognition">
                        {lec.year}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {lec.scope}
                      </span>
                    </div>
                    <div className="mt-1 font-medium text-foreground">
                      {lec.title}
                    </div>
                    {lec.detail ? (
                      <div className="mt-1 text-muted-foreground">
                        {lec.detail}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </details>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Scale}
              title="Editorial & peer review"
              variant={0}
            />
            <div className="space-y-6">
              {d.peerReviewBlocks.map((block: PiPeerReviewBlock) => (
                <div key={block.heading}>
                  <h3 className="text-sm font-semibold text-foreground">
                    {block.heading}
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader icon={Star} title="Skills" variant={1} />
            <div className="space-y-8">
              {d.skillCategories.map((cat, ci) => (
                <div key={cat.category}>
                  <h3 className="text-lg font-semibold text-foreground">
                    {cat.category}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.skills.map((skill, si) => (
                      <span
                        key={skill}
                        className={`rounded-full border px-3 py-1.5 text-sm shadow-sm ${SKILL_PILL_STYLES[(ci + si) % 3]}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={HeartHandshake}
              title="Volunteering"
              variant={2}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.volunteering.map((item: PiVolunteer, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  className="flex h-full flex-col rounded-2xl border border-border/70 bg-muted/20 p-4 ring-1 ring-black/[0.02] shadow-sm"
                >
                  <div className="font-semibold text-cognition">
                    {item.role}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.organization}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.period}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader icon={Quote} title="Recommendations" variant={0} />
            <div className="space-y-4">
              {d.recommendations.map((item: PiRecommendation, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="rounded-2xl border border-border/70 bg-muted/20 p-5 shadow-sm ring-1 ring-black/[0.02] sm:p-6"
                >
                  <div className="font-semibold text-foreground">
                    {item.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.role}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.context}
                  </div>
                  <blockquote className="mt-4 border-l-2 border-brand/40 pl-4 text-base italic leading-relaxed text-muted-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Star}
              title="Licenses & certifications"
              variant={1}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.licenses.map((item: PiLicense, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="flex h-full flex-col rounded-2xl border border-border/70 bg-muted/20 p-4 ring-1 ring-black/[0.02] shadow-sm"
                >
                  <div className="font-semibold text-care">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.org}
                  </div>
                  {item.issued || item.expires ? (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.issued}
                      {item.expires ? ` · ${item.expires}` : ""}
                    </div>
                  ) : null}
                  {item.credential ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.credential}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={Building2}
              title="Committees & leadership roles"
              variant={2}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.committeesAndLeadership.map((item: PiOrganization, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex h-full flex-col rounded-2xl border border-border/70 bg-muted/20 p-4 ring-1 ring-black/[0.02] shadow-sm"
                >
                  <div className="font-semibold text-consciousness">
                    {item.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.role}
                  </div>
                  {item.period ? (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.period}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <h3 className="mb-3 mt-10 text-sm font-semibold text-foreground">
              Society memberships
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.membershipsAll.map((item: PiOrganization, idx) => (
                <div
                  key={`${item.name}-m-${idx}`}
                  className="flex h-full flex-col rounded-2xl border border-border/70 bg-muted/20 p-4 ring-1 ring-black/[0.02] shadow-sm"
                >
                  <div className="font-semibold text-consciousness">
                    {item.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.role}
                    {item.period ? ` · ${item.period}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={FileText}
              title="Teaching, supervision & professional development"
              variant={0}
            />
            <p className="mb-3 text-sm text-muted-foreground">
              Verbatim sections F–J from the curriculum vitae (teaching,
              supervision, thesis committees, courses, and leadership
              narrative).
            </p>
            <details className="group overflow-hidden rounded-2xl border border-border/70 bg-muted/15 shadow-sm ring-1 ring-black/[0.02]">
              <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted/40 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  Expand full CV text (sections F–J)
                </span>
                <span className="hidden group-open:inline">Collapse</span>
              </summary>
              <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap border-t border-border/60 bg-card/30 px-4 py-3 font-sans text-xs leading-relaxed text-muted-foreground">
                {d.cvFullTextSectionsFJ}
              </pre>
            </details>
          </SectionShell>

          <SectionShell>
            <SectionHeader
              icon={BookOpen}
              title="Selected publications"
              variant={0}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.publicationHighlights.map(
                (item: PiPublicationHighlight, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="flex h-full flex-col rounded-2xl border border-border/70 bg-muted/20 p-4 ring-1 ring-black/[0.02] shadow-sm"
                  >
                    <div className="font-semibold text-cognition">
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.journal}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.date}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/25 transition hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/20"
              >
                View full publications list
              </Link>
            </div>
          </SectionShell>
        </div>
      </div>
    </div>
  );
}
