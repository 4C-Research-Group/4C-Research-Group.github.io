import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getModuleBySlug,
  kmModules,
} from "@/data/knowledge-mobilization";
import ModuleRunner from "./ModuleRunner";

type Props = {
  params: Promise<{ moduleSlug: string }>;
};

export function generateStaticParams() {
  return kmModules.map((m) => ({ moduleSlug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) {
    return { title: "Module | Knowledge Mobilization" };
  }
  return {
    title: `${mod.title} | Knowledge Mobilization`,
    description: mod.summary,
  };
}

export default async function KnowledgeModulePage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) notFound();
  return <ModuleRunner module={mod} />;
}
