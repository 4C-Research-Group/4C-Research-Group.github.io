import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { findStaticTeamMemberBySlug, resolveCanonicalTeamSlug } from "@/data/team";
import TeamPortfolioClient from "./TeamPortfolioClient";

/**
 * Load slug list via dynamic import so this module does not statically depend on
 * `@supabase/supabase-js` (Turbopack + `output: "export"` can otherwise fail to
 * associate `generateStaticParams` with `/team/[slug]`). Merges repo + Supabase slugs when env is set.
 */
export async function generateStaticParams() {
  const { getAllTeamMemberSlugsForStaticParams } = await import(
    "@/lib/team/static-slugs"
  );
  return getAllTeamMemberSlugsForStaticParams();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = findStaticTeamMemberBySlug(slug);
  const title = m ? `${m.name} | 4C Research Group` : "Team member | 4C Research Group";
  const description = m
    ? `${m.role} — 4C Research Group team profile.`
    : "Team member profile — 4C Research Group.";
  return { title, description };
}

export default async function TeamMemberPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const canonical = resolveCanonicalTeamSlug(slug);
  if (canonical !== slug) {
    permanentRedirect(`/team/${canonical}/`);
  }
  return <TeamPortfolioClient slug={canonical} />;
}
