import type { Metadata } from "next";
import { findStaticTeamMemberBySlug } from "@/data/team";
import { getAllTeamMemberSlugsForStaticParams } from "@/lib/team/static-slugs";
import TeamPortfolioClient from "./TeamPortfolioClient";

export async function generateStaticParams() {
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
  return <TeamPortfolioClient slug={slug} />;
}
