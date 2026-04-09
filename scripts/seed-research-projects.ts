/**
 * Upserts bundled research projects into public.research_projects.
 *
 * Requires in `.env.local` or env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY
 *
 * Usage: npm run seed-projects
 */

import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { fallbackProjects } from "../src/data/projectsData";
import type { Database } from "../src/lib/supabase/database.types";
import type { Json } from "../src/lib/supabase/database.types";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });

function serviceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim()
  );
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = serviceRoleKey();
  if (!url || !serviceKey) {
    console.error(
      "Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY).",
    );
    process.exit(1);
  }

  const supabase = createClient<Database>(url, serviceKey);

  let order = 0;
  for (const p of fallbackProjects) {
    const row: Database["public"]["Tables"]["research_projects"]["Insert"] = {
      slug: p.id,
      title: p.title,
      description: p.description,
      long_description: p.longDescription ?? "",
      category: p.category,
      status: p.status,
      start_date: p.startDate.slice(0, 10),
      end_date: p.endDate?.slice(0, 10) ?? null,
      link: p.link ?? "",
      funding: p.funding ?? "",
      additional_info: p.additionalInfo ?? "",
      tags: p.tags,
      objectives: p.objectives ?? [],
      team_members: (p.teamMembers ?? []) as unknown as Json,
      publications: (p.publications ?? []) as unknown as Json,
      gallery_urls: p.images.filter(Boolean),
      published: true,
      sort_order: order++,
    };

    const { error } = await supabase.from("research_projects").upsert(row, {
      onConflict: "slug",
    });
    if (error) {
      console.error(`Upsert ${p.id}:`, error.message);
      process.exit(1);
    }
    console.log("OK", p.id);
  }

  console.log(`Seeded ${fallbackProjects.length} project(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
