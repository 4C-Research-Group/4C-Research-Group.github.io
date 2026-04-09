import type { Metadata } from "next";
import { getKmModuleMetaForBuild, getKmModuleSlugsForStaticExport } from "@/lib/km/resolve-km-slugs";
import ModuleRunner from "./ModuleRunner";

type Props = {
  params: Promise<{ moduleSlug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getKmModuleSlugsForStaticExport();
  return slugs.map((moduleSlug) => ({ moduleSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleSlug } = await params;
  const meta = await getKmModuleMetaForBuild(moduleSlug);
  if (!meta) {
    return { title: "Module | Knowledge Mobilization" };
  }
  return {
    title: `${meta.title} | Knowledge Mobilization`,
    description: meta.summary,
  };
}

export default async function KnowledgeModulePage({ params }: Props) {
  const { moduleSlug } = await params;
  return <ModuleRunner moduleSlug={moduleSlug} />;
}
