"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
  Search,
  Brain,
  Heart,
  Target,
  Star,
  UserPlus,
} from "lucide-react";
import {
  teamMembers as staticTeamMembers,
  teamAlumni as staticTeamAlumni,
  resolveCanonicalTeamSlug,
  type TeamMember,
  type TeamMemberCategory,
} from "@/data/team";
import { resolveTeamMemberDisplayPhotoUrl } from "@/lib/team/photo-url";
import {
  rememberTeamListScroll,
  consumeTeamListScrollY,
  takeTeamListScrollRestorePending,
  discardSavedTeamListScroll,
  saveTeamPageScrollBeforeHide,
  consumeTeamPageReloadScrollY,
  clearTeamPageReloadScroll,
  isBrowserReloadNavigation,
} from "@/lib/team/team-list-scroll";
import { fetchTeamFromSupabase } from "@/lib/team/supabase-team";

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

  // Show initials if no photo or if image failed to load
  if (!src || failed) {
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
      style={{ objectPosition: "center 30%" }}
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
  const [teamAlumni, setTeamAlumni] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const fromDb = await fetchTeamFromSupabase();
      if (!alive) return;
      if (fromDb.usedDatabase) {
        setTeamMembers(fromDb.members);
        setTeamAlumni(fromDb.alumni);
      } else {
        setTeamMembers(staticTeamMembers);
        setTeamAlumni(staticTeamAlumni);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    function onHide() {
      saveTeamPageScrollBeforeHide();
    }
    window.addEventListener("pagehide", onHide);
    document.addEventListener("freeze", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("freeze", onHide);
    };
  }, []);

  useLayoutEffect(() => {
    if (teamMembers === null) return;
    const isReload = isBrowserReloadNavigation();

    if (takeTeamListScrollRestorePending()) {
      const y = consumeTeamListScrollY();
      if (y != null) window.scrollTo({ top: y, behavior: "auto" });
      clearTeamPageReloadScroll();
      return;
    }

    discardSavedTeamListScroll();

    if (isReload) {
      const y = consumeTeamPageReloadScrollY();
      if (y != null) window.scrollTo({ top: y, behavior: "auto" });
    } else {
      clearTeamPageReloadScroll();
    }
  }, [teamMembers]);

  const filtered = useMemo(() => {
    let filteredMembers =
      filter === "all"
        ? teamMembers ?? []
        : (teamMembers ?? []).filter((m) => m.category === filter);

    if (searchQuery) {
      filteredMembers = filteredMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.superpower.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filteredMembers;
  }, [filter, searchQuery, teamMembers]);

  const counts = useMemo(() => {
    const list = teamMembers ?? [];
    const students = list.filter((m) => m.category === "student").length;
    const staff = list.filter((m) => m.category === "staff").length;
    return { students, staff, total: list.length };
  }, [teamMembers]);

  if (teamMembers === null || teamAlumni === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm">Loading team…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
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
              <Users className="h-4 w-4" />
              Our Research Team
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Meet the Team
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                Advancing Brain Health Together
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Clinicians, trainees, and coordinators advancing pediatric
              neurocritical care and cognition science through innovative
              research and collaboration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <Brain className="h-4 w-4" />
                Clinical Excellence
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Heart className="h-4 w-4" />
                Compassionate Care
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Target className="h-4 w-4" />
                Research Innovation
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

        {/* PI Section */}
        <section className="relative px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-12">
          <div className="container mx-auto max-w-7xl">
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
                Principal Investigator
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
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="flex flex-col justify-center p-8 lg:col-span-10 lg:p-10 xl:p-12 order-2 lg:order-1">
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
                      physician-researcher at Children&apos;s Hospital - LHSC,
                      and an Assistant Professor in Departments of Paediatrics
                      and Clinical Neurological Sciences at the Schulich School
                      of Medicine & Dentistry, Western University, London (ON),
                      Canada. His training spans paediatrics, critical care,
                      neurology, and neurocritical care. He is passionate about
                      improving diagnosis and treatment of altered cognition and
                      consciousness in critically ill patients. His program
                      develops and validates electrical and functional
                      neuroimaging tools to predict and detect pathological
                      brain states—empowering bedside teams to act earlier and
                      prognosticate more objectively in children with acquired
                      brain injury, through observational work, trials, and
                      knowledge translation.
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

                  <div className="relative aspect-[4/5] w-32 min-h-[120px] lg:col-span-2 lg:w-40 rounded-2xl overflow-hidden border-4 border-background shadow-lg mx-auto lg:mx-0 order-1 lg:order-2">
                    <TeamPhoto
                      src="/team/team-1.jpg"
                      alt="Dr. Rishi Ganesan"
                      initials="RG"
                      className="object-cover"
                      initialsClassName="text-5xl font-bold tracking-tight text-brand md:text-6xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team grid */}
        <section className="relative border-t border-border/50 bg-linear-to-b from-muted/40 via-background to-background px-4 py-16 sm:px-6 sm:py-24">
          <div className="container mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background pl-12 pr-4 py-3 text-foreground placeholder-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>

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
                  Lab Members
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
                          ? "border-brand/40 bg-brand text-primary-foreground shadow-md shadow-brand/20 scale-105"
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
                <strong className="text-foreground">{filtered.length}</strong>{" "}
                showing
              </span>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <span>
                <strong className="text-foreground">{counts.total}</strong>{" "}
                total members
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
              {searchQuery && (
                <>
                  <span className="hidden sm:inline" aria-hidden>
                    ·
                  </span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-brand hover:text-brand-deep transition-colors"
                  >
                    Clear search
                  </button>
                </>
              )}
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.ul
                key={`${filter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8"
              >
                {filtered.map((member, index) => (
                  <MemberCard key={member.slug} member={member} index={index} />
                ))}
              </motion.ul>
            </AnimatePresence>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <div className="max-w-md mx-auto">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No team members found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No one matches your current filter or search criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-brand-deep transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              </motion.div>
            ) : null}

            {/* Alumni Section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mt-20 border-t border-border/60 pt-16"
            >
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                  Alumni
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Lab Alumni
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
                <p className="mt-4 text-muted-foreground">
                  Former team members who contributed to our research journey
                </p>
              </div>

              <motion.ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
                {teamAlumni.length === 0 ? (
                  <li className="col-span-full list-none text-center text-sm text-muted-foreground">
                    No alumni listed yet.
                  </li>
                ) : null}
                {teamAlumni.map((member, index) => (
                  <motion.li
                    key={member.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.03, 0.2),
                    }}
                    className="group relative list-none"
                  >
                    <Link
                      href={`/team/${resolveCanonicalTeamSlug(member.slug)}/`}
                      onClick={() => rememberTeamListScroll()}
                      className="block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-brand/15 hover:shadow-md hover:shadow-brand/[0.05] hover:ring-brand/5">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted/50">
                        <TeamPhoto
                          src={resolveTeamMemberDisplayPhotoUrl(
                            member.photoFile,
                            member.slug,
                          )}
                          alt={member.name}
                          initials={member.initials}
                          className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent opacity-60"
                          aria-hidden
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 pt-8">
                          <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-lg">
                            {member.name}
                          </h3>
                          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/90">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4 pt-3">
                        <div className="mt-auto flex gap-2 rounded-xl border border-border/40 bg-muted/20 p-3 transition-colors group-hover:border-brand/10 group-hover:bg-muted/30">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                            <Star
                              className="h-3.5 w-3.5 text-muted-foreground"
                              strokeWidth={2}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Superpower
                            </p>
                            <p className="mt-1 text-xs leading-snug text-muted-foreground/90">
                              {member.superpower}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

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
                <UserPlus className="h-4 w-4" />
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
      <Link
        href={`/team/${resolveCanonicalTeamSlug(member.slug)}/`}
        onClick={() => rememberTeamListScroll()}
        className="block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/[0.07] hover:ring-brand/10">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <TeamPhoto
            src={resolveTeamMemberDisplayPhotoUrl(
              member.photoFile,
              member.slug,
            )}
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
      </Link>
    </motion.li>
  );
}
