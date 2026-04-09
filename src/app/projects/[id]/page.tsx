import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectClient from "./ProjectClient";
import {
  getResearchProjectForBuild,
  getResearchProjectSlugsForStaticExport,
} from "@/lib/projects/resolve-project-params";

export async function generateStaticParams() {
  const ids = await getResearchProjectSlugsForStaticExport();
  return ids.map((id) => ({ id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getResearchProjectForBuild(id);
  if (!project) {
    return { title: "Project | 4C Research Group" };
  }
  const title = `${project.title} | 4C Research Group`;
  const description =
    project.description.length > 160
      ? `${project.description.slice(0, 157)}…`
      : project.description;
  const ogImages = [
    { url: project.images[0] ?? "/logo.png", alt: project.title, loading: "eager" },
  ];

  return {
    title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getResearchProjectForBuild(id);

  if (!project) {
    notFound();
  }

  return <ProjectClient initialProject={project} />;
}
