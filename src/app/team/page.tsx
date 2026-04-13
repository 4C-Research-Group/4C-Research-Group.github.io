"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Linkedin,
  Mail,
  Users,
  GraduationCap,
  Briefcase,
  Search,
  Brain,
  Heart,
  Target,
  UserPlus,
  Sparkles,
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
import { readTeamSessionCache } from "@/lib/team/team-session-cache";
import { fetchTeamFromSupabase } from "@/lib/team/supabase-team";

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

/** Shared portrait card for team directory + Lab Alumni (photo + bottom overlay). */
function TeamPortraitCardFace({ member }: { member: TeamMember }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-muted/20 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl hover:shadow-brand/[0.06]">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/40">
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
          {member.degree?.trim() ? (
            <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-white/80">
              <GraduationCap
                className="mt-0.5 h-3 w-3 shrink-0 text-white/70"
                strokeWidth={2}
                aria-hidden
              />
              <span className="line-clamp-2 min-w-0">
                {member.degree.trim()}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
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
        // Keep session-cached DB snapshot if refresh fails; only use static on first load.
        setTeamMembers((prev) => (prev === null ? staticTeamMembers : prev));
        setTeamAlumni((prev) => (prev === null ? staticTeamAlumni : prev));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useLayoutEffect(() => {
    const cached = readTeamSessionCache();
    if (!cached) return;
    setTeamMembers(cached.members);
    setTeamAlumni(cached.alumni);
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
      // `instant` ignores root `scroll-smooth` so we don't animate from the top.
      if (y != null) window.scrollTo({ top: y, behavior: "instant" });
      clearTeamPageReloadScroll();
      return;
    }

    discardSavedTeamListScroll();

    if (isReload) {
      const y = consumeTeamPageReloadScrollY();
      if (y != null) window.scrollTo({ top: y, behavior: "instant" });
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

  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  if (teamMembers === null || teamAlumni === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-9 w-9 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
            aria-hidden
          />
          <p className="text-sm">Loading team…</p>
        </div>
      </div>
    );
  }

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
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(260px,380px)] lg:gap-14">
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
                Our Research Team
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  Meet the Team
                </span>
                <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                  Advancing Brain Health Together
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                Clinicians, trainees, and coordinators advancing pediatric
                neurocritical care and cognition science through innovative
                research and collaboration.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                  <Brain className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Clinical Excellence
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                  <Heart className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Compassionate Care
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                  <Target className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Research Innovation
                </span>
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
                  <Users className="h-5 w-5" aria-hidden />
                </div>
                <dl className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Total
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {counts.total}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Trainees
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-care sm:text-2xl">
                      {counts.students}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Staff
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-cognition sm:text-2xl">
                      {counts.staff}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[8%] top-28 h-64 w-64 rounded-full bg-cognition/8 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-consciousness/8 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        {/* PI Section */}
        <section className="relative px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-12">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: spring }}
              className="mb-10 flex flex-col gap-3 sm:mb-12"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                Leadership
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Principal Investigator
              </h2>
              <div className="h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Clinical direction, mentorship, and the research vision behind
                4C.
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: spring }}
              className="relative"
            >
              <div
                className="absolute -inset-[1px] rounded-[1.75rem] bg-linear-to-br from-cognition/35 via-brand/30 to-care/35 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-xl shadow-brand/10 ring-1 ring-black/[0.03] backdrop-blur-sm">
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
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep"
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        Email
                      </a>
                      <a
                        href="https://www.linkedin.com/in/dr-saptharishi-ganesan-b1730a60/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:bg-brand/5"
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
                      src="/images/team/team-1.jpg"
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
        <section className="relative border-t border-border/50 bg-linear-to-b from-muted/30 via-background to-background px-4 py-14 sm:px-6 sm:py-20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
              className="mx-auto mb-10 max-w-2xl text-center"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                People
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Lab Members
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                Students, coordinators, and research staff who keep projects
                moving—from recruitment to analysis and knowledge sharing.
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
              className="mb-10 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-6"
            >
              <div className="relative mb-6">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="search"
                  placeholder="Search by name, role, or superpower…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border/80 bg-background/90 py-3.5 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/80 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:text-[15px]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = filter === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                        active
                          ? "border-brand/30 bg-brand text-primary-foreground shadow-md shadow-brand/15"
                          : "border-border/80 bg-background/80 text-muted-foreground hover:border-brand/25 hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-5 text-sm text-muted-foreground">
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
                {searchQuery ? (
                  <>
                    <span className="hidden sm:inline" aria-hidden>
                      ·
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="font-medium text-brand transition-colors hover:text-brand-deep"
                    >
                      Clear search
                    </button>
                  </>
                ) : null}
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.ul
                key={`${filter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-7"
              >
                {filtered.map((member, index) => (
                  <MemberCard key={member.slug} member={member} index={index} />
                ))}
              </motion.ul>
            </AnimatePresence>

            {filtered.length === 0 ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10 rounded-3xl border border-dashed border-border/80 bg-muted/15 py-14 text-center"
              >
                <div className="mx-auto max-w-md px-4">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Search className="h-7 w-7 text-muted-foreground" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    No team members match
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try a different filter or clear your search.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep"
                  >
                    Reset filters
                  </button>
                </div>
              </motion.div>
            ) : null}

            {/* Alumni Section */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
              className="mt-20 border-t border-border/60 pt-16"
            >
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/90">
                  Alumni
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Lab Alumni
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
                <p className="mt-4 text-muted-foreground">
                  Former team members who contributed to our research journey
                </p>
              </div>

              <motion.ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-7">
                {teamAlumni.length === 0 ? (
                  <li className="col-span-full list-none text-center text-sm text-muted-foreground">
                    No alumni listed yet.
                  </li>
                ) : null}
                {teamAlumni.map((member, index) => (
                  <motion.li
                    key={member.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.38,
                      delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.28),
                      ease: spring,
                    }}
                    className="group relative list-none"
                  >
                    <Link
                      href={`/team/${resolveCanonicalTeamSlug(member.slug)}/`}
                      onClick={() => rememberTeamListScroll()}
                      className="block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <TeamPortraitCardFace member={member} />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
              className="mt-16 flex justify-center"
            >
              <Link
                href="/join-4c-lab/"
                className="group inline-flex items-center gap-2 rounded-2xl border border-brand/20 bg-linear-to-r from-brand/10 via-consciousness/8 to-care/10 px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/35 hover:shadow-md"
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
  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{
        duration: reduceMotion ? 0 : 0.35,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.28),
        ease: spring,
        layout: reduceMotion ? undefined : { duration: 0.3, ease: spring },
      }}
      className="group relative list-none"
    >
      <Link
        href={`/team/${resolveCanonicalTeamSlug(member.slug)}/`}
        onClick={() => rememberTeamListScroll()}
        className="block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <TeamPortraitCardFace member={member} />
      </Link>
    </motion.li>
  );
}
