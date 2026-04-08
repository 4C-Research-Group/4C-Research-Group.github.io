"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";
import { findStaticTeamMemberBySlug } from "@/data/team";
import { resolveTeamMemberPhotoUrl } from "@/lib/team/photo-url";
import { publicationStatusLabel } from "@/lib/team/publication-status";
import {
  fetchTeamPortfolioBySlug,
  staticTeamMemberToPortfolio,
  type TeamMemberPortfolio,
  type TeamMemberPublication,
} from "@/lib/team/supabase-portfolio";

function statusBadgeClass(status: TeamMemberPublication["status"]): string {
  switch (status) {
    case "published":
      return "border-care/30 bg-care/10 text-care";
    case "accepted":
      return "border-consciousness/30 bg-consciousness/10 text-consciousness";
    case "under_review":
    case "submitted":
      return "border-brand/35 bg-brand/10 text-brand";
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
}

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
  if (!src || failed) {
    return (
      <div
        className="flex aspect-[4/5] w-full max-w-[280px] items-center justify-center rounded-2xl border border-border/60 bg-linear-to-br from-brand/20 via-consciousness/15 to-care/20 sm:max-w-[320px]"
        aria-hidden
      >
        <span className="text-5xl font-bold tracking-tight text-brand sm:text-6xl">
          {initials}
        </span>
      </div>
    );
  }
  return (
    <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl border border-border/60 shadow-lg sm:max-w-[320px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition: "center 30%" }}
        sizes="(max-width: 640px) 100vw, 320px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function TeamPortfolioClient({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState<TeamMemberPortfolio | null>(null);
  const [publications, setPublications] = useState<TeamMemberPublication[]>([]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const res = await fetchTeamPortfolioBySlug(slug);
      if (!alive) return;
      if (res.member) {
        setMember(res.member);
        setPublications(res.publications);
      } else if (!res.usedDatabase) {
        const stat = findStaticTeamMemberBySlug(slug);
        setMember(stat ? staticTeamMemberToPortfolio(stat) : null);
        setPublications([]);
      } else {
        setMember(null);
        setPublications([]);
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

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
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to team
          </Link>
        </div>
      </div>
    );
  }

  const photo = resolveTeamMemberPhotoUrl(member.photoFile);
  const showBio = member.bio.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-linear-to-br from-slate-50/90 via-background to-brand-light/25">
        <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/team/"
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

              <div className="mt-6 flex flex-wrap gap-2">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-brand/5"
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
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-brand/5"
                  >
                    <Linkedin className="h-4 w-4 text-brand" />
                    LinkedIn
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
                Research outputs tracked for this profile (status is managed in
                admin).
              </p>
            </div>
          </div>

          {publications.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-12 text-center text-sm text-muted-foreground">
              No publications listed yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {publications.map((pub) => (
                <li key={pub.id}>
                  <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition hover:border-brand/20">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold leading-snug text-foreground">
                          {pub.title}
                        </h3>
                        {(pub.authors || pub.venue || pub.year) && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {[pub.authors, pub.venue, pub.year]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        {pub.notes.trim() ? (
                          <p className="mt-2 text-sm text-muted-foreground/90">
                            {pub.notes}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusBadgeClass(pub.status)}`}
                        >
                          {publicationStatusLabel[pub.status]}
                        </span>
                        {pub.url.trim() ? (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-deep"
                          >
                            Link
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
