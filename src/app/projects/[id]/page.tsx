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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getResearchProjectForBuild(id);

  if (!project) {
    notFound();
  }

  return <ProjectClient initialProject={project} />;
}
