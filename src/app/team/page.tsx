"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Linkedin,
  Mail,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import {
  teamMembers,
  type TeamMember,
  type TeamMemberCategory,
} from "@/data/team";

const ACCENT_ROTATION = [
  "text-cognition",
  "text-consciousness",
  "text-care",
] as const;

function TeamPhoto({
  src,
  alt,
  initials,
  className,
  initialsClassName,
}: {
  src: string;
  alt: string;
  initials: string;
  className?: string;
  initialsClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand/20 via-consciousness/15 to-care/20 ${className ?? ""}`}
        aria-hidden
      >
        <span
          className={
            initialsClassName ??
            "text-3xl font-bold tracking-tight text-brand sm:text-4xl"
          }
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

const FILTER_OPTIONS: {
  id: "all" | TeamMemberCategory;
  label: string;
  icon: typeof Users;
}[] = [
  { id: "all", label: "Everyone", icon: Users },
  { id: "student", label: "Trainees", icon: GraduationCap },
  { id: "staff", label: "Staff", icon: Briefcase },
];

export default function TeamPage() {
  const [filter, setFilter] = useState<"all" | TeamMemberCategory>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return teamMembers;
    return teamMembers.filter((m) => m.category === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const students = teamMembers.filter((m) => m.category === "student").length;
    const staff = teamMembers.filter((m) => m.category === "staff").length;
    return { students, staff, total: teamMembers.length };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title="Our team"
        subtitle="Clinicians, trainees, and coordinators advancing pediatric neurocritical care and cognition science."
      />

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[10%] top-32 h-[420px] w-[420px] rounded-full bg-cognition/[0.12] blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-1/4 h-[380px] w-[380px] rounded-full bg-consciousness/[0.1] blur-[90px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-care/[0.08] blur-[80px]"
          aria-hidden
        />

        {/* PI — gradient frame + split layout */}
        <section className="relative px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-12">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex flex-col gap-3 sm:mb-12"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                Leadership
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Principal investigator
              </h2>
              <p className="max-w-2xl text-base text-muted-foreground">
                Clinical direction, mentorship, and the research vision behind
                4C.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div
                className="absolute -inset-[1px] rounded-[1.75rem] bg-linear-to-br from-cognition/50 via-brand/40 to-care/50 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-2xl shadow-brand/10 backdrop-blur-sm">
                <div className="grid lg:grid-cols-12">
                  <div className="relative aspect-[4/5] min-h-[300px] lg:col-span-5 lg:min-h-[440px]">
                    <TeamPhoto
                      src="/team/team-1.jpg"
                      alt="Dr. Rishi Ganesan"
                      initials="RG"
                      className="object-cover object-[center_20%]"
                      initialsClassName="text-5xl font-bold tracking-tight text-brand md:text-6xl"
                    />
                    <div
                      className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent lg:from-card/80"
                      aria-hidden
                    />
                    <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 lg:hidden">
                      <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                        Paediatric critical care
                      </span>
                      <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                        Neurocritical care
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12 xl:p-14">
                    <div className="mb-6 hidden flex-wrap gap-2 lg:flex">
                      <span className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">
                        Paediatric critical care
                      </span>
                      <span className="rounded-full border border-consciousness/20 bg-consciousness/5 px-3 py-1 text-xs font-semibold text-consciousness">
                        Neurocritical care
                      </span>
                      <span className="rounded-full border border-care/25 bg-care/5 px-3 py-1 text-xs font-semibold text-care">
                        Western · LHSC
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
                      Dr. Rishi Ganesan
                    </h3>
                    <p className="mt-2 text-sm font-medium text-brand">
                      Head, 4C Research Group
                    </p>

                    <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      Dr. Rishi Ganesan is a paediatric critical care
                      physician-researcher at the Children&apos;s Hospital -
                      LHSC, and an Assistant Professor in the Departments of
                      Paediatrics and Clinical Neurological Sciences at the
                      Schulich School of Medicine & Dentistry, Western
                      University, London (ON), Canada. His training spans
                      paediatrics, critical care, neurology, and neurocritical
                      care. He is passionate about improving diagnosis and
                      treatment of altered cognition and consciousness in
                      critically ill patients. His program develops and validates
                      electrical and functional neuroimaging tools to predict
                      and detect pathological brain states—empowering bedside
                      teams to act earlier and prognosticate more objectively in
                      children with acquired brain injury, through observational
                      work, trials, and knowledge translation.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="mailto:rishi.ganesan@lhsc.on.ca"
                        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-brand/25 transition hover:bg-brand-deep"
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        Email
                      </a>
                      <a
                        href="https://www.linkedin.com/in/dr-saptharishi-ganesan-b1730a60/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:bg-brand/5"
                      >
                        <Linkedin className="h-4 w-4 shrink-0 text-brand" />
                        LinkedIn
                      </a>
                      <Link
                        href="/about-pi/"
                        className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-2.5 text-sm font-semibold text-brand transition hover:gap-2.5"
                      >
                        Full profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team grid */}
        <section className="relative border-t border-border/50 bg-linear-to-b from-muted/40 via-background to-background px-4 py-16 sm:px-6 sm:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="max-w-xl"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                  People
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Lab members
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Students, coordinators, and research staff who keep projects
                  moving—from recruitment to analysis and knowledge sharing.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="flex flex-wrap gap-3 lg:justify-end"
              >
                {FILTER_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = filter === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-brand/40 bg-brand text-primary-foreground shadow-md shadow-brand/20"
                          : "border-border/80 bg-card text-muted-foreground hover:border-brand/25 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-10 flex flex-wrap gap-4 border-y border-border/60 py-6 text-sm text-muted-foreground"
            >
              <span>
                <strong className="text-foreground">{counts.total}</strong>{" "}
                members
              </span>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <span>
                <strong className="text-foreground">{counts.students}</strong>{" "}
                trainees
              </span>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <span>
                <strong className="text-foreground">{counts.staff}</strong>{" "}
                staff
              </span>
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.ul
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              >
                {filtered.map((member, index) => (
                  <MemberCard
                    key={member.slug}
                    member={member}
                    index={index}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>

            {filtered.length === 0 ? (
              <p className="mt-8 text-center text-muted-foreground">
                No one in this filter yet.
              </p>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mt-16 flex justify-center"
            >
              <Link
                href="/join-4c-lab/"
                className="group inline-flex items-center gap-2 rounded-2xl border border-brand/25 bg-linear-to-r from-brand/10 via-consciousness/5 to-care/10 px-6 py-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/40 hover:shadow-md"
              >
                Interested in joining?
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const accent = ACCENT_ROTATION[index % 3];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.25),
        layout: { duration: 0.35 },
      }}
      className="group relative list-none"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/[0.07] hover:ring-brand/10">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <TeamPhoto
            src={`/team/${member.photoFile}`}
            alt={member.name}
            initials={member.initials}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent opacity-90"
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-card/85 text-sm font-bold shadow-sm backdrop-blur ${accent}`}
            aria-hidden
          >
            {member.initials}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 pt-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {member.name}
            </h3>
            <p
              className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                member.category === "student"
                  ? "bg-consciousness/10 text-consciousness"
                  : "bg-care/10 text-care"
              }`}
            >
              {member.role}
            </p>
          </div>

          <div className="mt-auto flex gap-3 rounded-xl border border-border/50 bg-muted/30 p-3.5 transition-colors group-hover:border-brand/15 group-hover:bg-brand/[0.03]">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm ${accent}`}
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Superpower
              </p>
              <p className="mt-1 text-sm leading-snug text-foreground/90">
                {member.superpower}
              </p>
            </div>
          </div>
        </div>
      </article>
    </motion.li>
  );
}
