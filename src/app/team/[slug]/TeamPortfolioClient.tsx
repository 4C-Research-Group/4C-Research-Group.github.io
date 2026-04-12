"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";
import { FaGoogle, FaOrcid, FaResearchgate } from "react-icons/fa";
import {
  PublicationCard,
  PublicationCardSkeleton,
} from "@/components/PublicationCard";
import { findStaticTeamMemberBySlug } from "@/data/team";
import {
  DEFAULT_ORCID_ID,
  fetchOrcidPublications,
  filterOrcidPublicationsForMember,
  type OrcidPublication,
} from "@/lib/orcid-works";
import { resolveTeamMemberDisplayPhotoUrl } from "@/lib/team/photo-url";
import { normalizeAwardsForDb } from "@/lib/team/member-awards";
import {
  enrichTeamMemberPhotoFromStatic,
  fetchTeamPortfolioBySlug,
  staticTeamMemberToPortfolio,
  type TeamMemberPortfolio,
} from "@/lib/team/supabase-portfolio";
import { markTeamListScrollRestorePending } from "@/lib/team/team-list-scroll";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import MemberTestimonialForm from "@/components/team/MemberTestimonialForm";

const PROFILE_LINK_BTN =
  "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-brand/5";

function MemberHeroPhoto({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [src]);
  if (!src || failed) {
    return (
      <div
        className="flex aspect-[4/5] w-[min(100%,280px)] shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-linear-to-br from-brand/20 via-consciousness/15 to-care/20 sm:w-[320px]"
      >
        <span className="text-5xl font-bold tracking-tight text-brand sm:text-6xl">
          {initials}
        </span>
      </div>
    );
  }
  return (
    <div className="w-[min(100%,280px)] shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-lg sm:w-[320px]">
      {/* Native img: reliable with static export + basePath; avoids Next/Image `fill` + flex width collapse */}
      <img
        key={src}
        src={src}
        alt={alt}
        width={320}
        height={400}
        className="aspect-[4/5] h-auto w-full object-cover [object-position:center_30%]"
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function TeamPortfolioClient({ slug }: { slug: string }) {
  const { ready: authReady, userId, teamMemberId } = useAuthProfile();
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState<TeamMemberPortfolio | null>(null);
  const [orcidPubs, setOrcidPubs] = useState<OrcidPublication[]>([]);
  const [pubsLoading, setPubsLoading] = useState(false);
  const [pubsError, setPubsError] = useState<string | null>(null);
  /** Set when profile resolves so ORCID enrichment can filter by author name mid-flight. */
  const filterMemberNameRef = useRef("");

  useEffect(() => {
    let alive = true;
    setReady(false);
    setMember(null);
    setOrcidPubs([]);
    setPubsError(null);
    setPubsLoading(true);
    filterMemberNameRef.current = "";

    const orcidPromise = fetchOrcidPublications(DEFAULT_ORCID_ID, {
      onEnrichmentProgress: (partial) => {
        if (!alive) return;
        const name = filterMemberNameRef.current.trim();
        if (!name) return;
        const filtered = filterOrcidPublicationsForMember(partial, name);
        filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        setOrcidPubs(filtered);
        if (filtered.length > 0) setPubsLoading(false);
      },
    });

    void (async () => {
      try {
        const res = await fetchTeamPortfolioBySlug(slug);
        if (!alive) return;

        let mem: TeamMemberPortfolio | null = null;
        if (res.member) {
          mem = enrichTeamMemberPhotoFromStatic(res.member, slug);
        } else if (!res.usedDatabase) {
          const stat = findStaticTeamMemberBySlug(slug);
          mem = stat
            ? enrichTeamMemberPhotoFromStatic(
                staticTeamMemberToPortfolio(stat),
                slug,
              )
            : null;
        }
        setMember(mem);
        filterMemberNameRef.current = mem?.name ?? "";
        setReady(true);

        const name = filterMemberNameRef.current.trim();
        if (!name) {
          await orcidPromise.catch(() => {});
          if (!alive) return;
          setOrcidPubs([]);
          return;
        }

        const all = await orcidPromise;
        if (!alive) return;
        const filtered = filterOrcidPublicationsForMember(all, name);
        filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        setOrcidPubs(filtered);
      } catch (e) {
        if (!alive) return;
        setOrcidPubs([]);
        setPubsError(
          e instanceof Error ? e.message : "Could not load publications",
        );
      } finally {
        if (alive) setPubsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  const pubCountLabel = useMemo(() => {
    const n = orcidPubs.length;
    return `${n} publication${n === 1 ? "" : "s"}`;
  }, [orcidPubs.length]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-[60vh] bg-background px-4 py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-foreground">Not found</h1>
          <p className="mt-2 text-muted-foreground">
            There is no team member with this link.
          </p>
          <Link
            href="/team/"
            onClick={() => markTeamListScrollRestorePending()}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to team
          </Link>
        </div>
      </div>
    );
  }

  const photo = resolveTeamMemberDisplayPhotoUrl(member.photoFile, member.slug);
  const showBio = member.bio.trim().length > 0;
  const displayAwards = normalizeAwardsForDb(member.awards);
  const isOwnProfile =
    authReady &&
    !!userId &&
    !!teamMemberId &&
    !!member.id &&
    teamMemberId === member.id;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-linear-to-br from-slate-50/90 via-background to-brand-light/25">
        <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/team/"
            onClick={() => markTeamListScrollRestorePending()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-deep"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            Team
          </Link>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            <div className="shrink-0 lg:sticky lg:top-24">
              <MemberHeroPhoto
                src={photo}
                alt={member.name}
                initials={member.initials}
              />
            </div>

            <div className="min-w-0 flex-1">
              {member.isAlumni && (
                <span className="mb-3 inline-block rounded-full border border-muted-foreground/25 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Alumni
                </span>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {member.name}
              </h1>
              <p
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  member.category === "student"
                    ? "bg-consciousness/12 text-consciousness"
                    : "bg-care/12 text-care"
                }`}
              >
                {member.role}
              </p>
              {member.degree?.trim() ? (
                <p className="mt-3 flex max-w-xl items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <GraduationCap
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="min-w-0">{member.degree.trim()}</span>
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-2">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className={PROFILE_LINK_BTN}
                  >
                    <Mail className="h-4 w-4 text-brand" />
                    Email
                  </a>
                ) : null}
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={PROFILE_LINK_BTN}
                  >
                    <Linkedin className="h-4 w-4 text-brand" />
                    LinkedIn
                  </a>
                ) : null}
                {member.orcidUrl ? (
                  <a
                    href={member.orcidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={PROFILE_LINK_BTN}
                  >
                    <FaOrcid className="h-4 w-4 text-brand" aria-hidden />
                    ORCID
                  </a>
                ) : null}
                {member.googleScholarUrl ? (
                  <a
                    href={member.googleScholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={PROFILE_LINK_BTN}
                  >
                    <FaGoogle className="h-4 w-4 text-brand" aria-hidden />
                    Google Scholar
                  </a>
                ) : null}
                {member.researchgateUrl ? (
                  <a
                    href={member.researchgateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={PROFILE_LINK_BTN}
                  >
                    <FaResearchgate className="h-4 w-4 text-brand" aria-hidden />
                    ResearchGate
                  </a>
                ) : null}
              </div>

              <div className="mt-8 flex gap-3 rounded-xl border border-border/60 bg-muted/25 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Superpower
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                    {member.superpower}
                  </p>
                </div>
              </div>

              {showBio ? (
                <div className="mt-10">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    About
                  </h2>
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {member.bio}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {displayAwards.length > 0 ? (
        <section className="border-t border-border/40 bg-background px-4 py-12 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-care/15 text-care">
                <Award className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Awards &amp; honours
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recognitions and funding highlights for this team member.
                </p>
              </div>
            </div>
            <ul className="space-y-5">
              {displayAwards.map((a, i) => {
                const meta = [a.issuer, a.year].filter(Boolean).join(" · ");
                return (
                  <li
                    key={`${a.title}-${a.year}-${i}`}
                    className="rounded-2xl border border-border/70 bg-card/60 px-5 py-4 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {a.title}
                    </h3>
                    {meta ? (
                      <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
                    ) : null}
                    {a.details ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {a.details}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {isOwnProfile ? (
        <div className="border-t border-border/40 bg-background px-4 py-10 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <MemberTestimonialForm teamMemberId={member.id} />
          </div>
        </div>
      ) : null}

      <section className="border-t border-border/40 bg-muted/15 px-4 py-14 sm:px-6 sm:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Publications
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Works from our lab ORCID record where{" "}
                <span className="font-medium text-foreground/90">
                  {member.name}
                </span>{" "}
                appears in the author list (same source as the{" "}
                <Link
                  href="/publications/"
                  className="font-medium text-brand hover:underline"
                >
                  Publications
                </Link>{" "}
                page).
              </p>
            </div>
          </div>

          {pubsLoading ? (
            <div className="grid grid-cols-1 gap-5">
              {[0, 1, 2, 3].map((i) => (
                <PublicationCardSkeleton key={i} />
              ))}
            </div>
          ) : null}

          {pubsError && !pubsLoading ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center text-sm text-destructive">
              <p>{pubsError}</p>
              <Link
                href="/publications/"
                className="mt-4 inline-block font-medium text-brand hover:underline"
              >
                Open Publications page
              </Link>
            </div>
          ) : null}

          {!pubsLoading && !pubsError && orcidPubs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-12 text-center text-sm text-muted-foreground">
              <p>
                No works on the lab ORCID listing matched this name in the
                contributor field.
              </p>
              <Link
                href="/publications/"
                className="mt-4 inline-block font-medium text-brand hover:underline"
              >
                Browse all publications
              </Link>
            </div>
          ) : null}

          {!pubsLoading && !pubsError && orcidPubs.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {pubCountLabel} for this profile
              </p>
              <div className="grid grid-cols-1 gap-5">
                {orcidPubs.map((pub, i) => (
                  <PublicationCard
                    key={pub.id}
                    pub={pub}
                    accentIndex={i}
                    showYearBadge
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
