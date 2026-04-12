import type { KMModule } from "@/data/knowledge-mobilization";

/** Resolve curriculum modules in the order given by `slugs` (e.g. program / micro-credential). */
export function modulesForProgramSlugs(
  slugs: string[],
  ordered: KMModule[],
): KMModule[] {
  const map = new Map(ordered.map((m) => [m.slug, m]));
  return slugs.map((s) => map.get(s)).filter((m): m is KMModule => m != null);
}
