/**
 * Inserts default /research page JSON (skips if slug `main` already exists).
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)
 *
 * Usage: npm run seed-research-page
 */

import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { defaultResearchPageDocument } from "../src/data/research-page-default";
import type { Database, Json } from "../src/lib/supabase/database.types";

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
  const key = serviceRoleKey();
  if (!url || !key) {
    console.error(
      "Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY).",
    );
    process.exit(1);
  }

  const supabase = createClient<Database>(url, key);

  const { data: existing } = await supabase
    .from("research_page")
    .select("id")
    .eq("slug", "main")
    .maybeSingle();
  if (existing) {
    console.log("Skip (exists): research_page slug=main");
    return;
  }

  const document = defaultResearchPageDocument() as unknown as Json;
  const { error } = await supabase.from("research_page").insert({
    slug: "main",
    document,
    published: true,
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log("OK: research_page main");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
