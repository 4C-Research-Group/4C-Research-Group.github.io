/**
 * Replaces all Knowledge Mobilization curriculum rows with the bundled modules
 * from `src/data/knowledge-mobilization.ts`.
 *
 * If `km_page_settings` has no `default` row yet, inserts one with merged hub
 * copy including **demo micro-credential programs** (see `src/data/km-page.ts`).
 * An existing row is left unchanged so admin edits are not overwritten.
 *
 * Requires in `.env.local` (project root) or env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY (service_role secret — not the anon key)
 *
 * Usage:
 *   npm run seed-km
 *   npm run seed-km -- --force   # required if tables already have modules
 */

import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { mergeKmPagePayload } from "../src/data/km-page-defaults";
import { kmModules } from "../src/data/knowledge-mobilization";
import type { Database, Json } from "../src/lib/supabase/database.types";

const KM_PAGE_ROW_ID = "default";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const ZERO = "00000000-0000-0000-0000-000000000000";

function serviceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim()
  );
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = serviceRoleKey();
  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceKey) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)");
  }
  if (missing.length > 0) {
    console.error(`Missing from environment: ${missing.join(", ")}`);
    console.error(
      "Loaded .env then .env.local from project root (npm run seed-km uses cwd).",
    );
    if (!serviceKey && url) {
      console.error(
        "Seeding bypasses RLS — set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY to the service_role JWT (Supabase → Settings → API). Do not use the anon key.",
      );
    }
    process.exit(1);
  }

  const supabaseUrl = url as string;
  const supabaseKey = serviceKey as string;
  const force = process.argv.includes("--force");
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  const { count, error: countErr } = await supabase
    .from("km_modules")
    .select("*", { count: "exact", head: true });
  if (countErr) {
    console.error("Count km_modules:", countErr.message);
    process.exit(1);
  }
  if ((count ?? 0) > 0 && !force) {
    console.error(
      "km_modules already has rows. Re-run with --force to delete and re-seed.",
    );
    process.exit(1);
  }

  const { error: dq } = await supabase
    .from("km_questions")
    .delete()
    .neq("id", ZERO);
  if (dq) {
    console.error("Delete km_questions:", dq.message);
    process.exit(1);
  }
  const { error: dt } = await supabase
    .from("km_topics")
    .delete()
    .neq("id", ZERO);
  if (dt) {
    console.error("Delete km_topics:", dt.message);
    process.exit(1);
  }
  const { error: dm } = await supabase
    .from("km_modules")
    .delete()
    .neq("id", ZERO);
  if (dm) {
    console.error("Delete km_modules:", dm.message);
    process.exit(1);
  }

  const sorted = [...kmModules].sort((a, b) => a.order - b.order);

  for (const mod of sorted) {
    const { data: row, error: insMod } = await supabase
      .from("km_modules")
      .insert({
        slug: mod.slug,
        title: mod.title,
        summary: mod.summary,
        sort_order: mod.order,
      })
      .select("id")
      .single();
    if (insMod || !row) {
      console.error("Insert module", mod.slug, insMod?.message);
      process.exit(1);
    }
    const moduleId = row.id;

    for (let ti = 0; ti < mod.topics.length; ti++) {
      const t = mod.topics[ti];
      const { error: it } = await supabase.from("km_topics").insert({
        module_id: moduleId,
        topic_key: t.id,
        sort_order: ti,
        topic_type: t.type,
        title: t.title,
        paragraphs: t.paragraphs,
        embed_url:
          t.type === "video" || t.type === "audio"
            ? ("embedUrl" in t ? t.embedUrl : null) ?? null
            : null,
        video_caption:
          t.type === "video"
            ? ("videoCaption" in t ? t.videoCaption : null) ?? null
            : t.type === "audio"
              ? ("audioCaption" in t ? t.audioCaption : null) ?? null
              : null,
      });
      if (it) {
        console.error("Insert topic", t.id, it.message);
        process.exit(1);
      }
    }

    for (let qi = 0; qi < mod.questions.length; qi++) {
      const q = mod.questions[qi];
      const { error: iq } = await supabase.from("km_questions").insert({
        module_id: moduleId,
        question_key: q.id,
        sort_order: qi,
        prompt: q.prompt,
        options: q.options,
        correct_index: q.correctIndex,
      });
      if (iq) {
        console.error("Insert question", q.id, iq.message);
        process.exit(1);
      }
    }
  }

  console.log(`Seeded ${sorted.length} module(s) into Supabase.`);

  const { data: existingPage, error: pageSelErr } = await supabase
    .from("km_page_settings")
    .select("id")
    .eq("id", KM_PAGE_ROW_ID)
    .maybeSingle();
  if (pageSelErr) {
    console.warn("km_page_settings select:", pageSelErr.message);
    return;
  }
  if (existingPage) {
    console.log(
      "km_page_settings row already exists; skipped (edit programs under Admin → Knowledge Mobilization).",
    );
    return;
  }
  const pagePayload = mergeKmPagePayload(null);
  const { error: pageIns } = await supabase.from("km_page_settings").insert({
    id: KM_PAGE_ROW_ID,
    payload: JSON.parse(JSON.stringify(pagePayload)) as Json,
    updated_at: new Date().toISOString(),
  });
  if (pageIns) {
    console.error("Insert km_page_settings:", pageIns.message);
    process.exit(1);
  }
  console.log(
    "Inserted km_page_settings with demo hub copy and micro-credential programs.",
  );
}

void main();
