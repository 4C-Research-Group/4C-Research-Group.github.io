/**
 * Replaces all Knowledge Mobilization rows with the bundled curriculum from
 * `src/data/knowledge-mobilization.ts`.
 *
 * Requires in `.env.local` (or env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run seed-km
 *   npm run seed-km -- --force   # required if tables already have modules
 */

import { createClient } from "@supabase/supabase-js";
import { kmModules } from "../src/data/knowledge-mobilization";
import type { Database } from "../src/lib/supabase/database.types";

const ZERO = "00000000-0000-0000-0000-000000000000";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
    process.exit(1);
  }

  const force = process.argv.includes("--force");
  const supabase = createClient<Database>(url, serviceKey);

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
        embed_url: t.type === "video" ? (t.embedUrl ?? null) : null,
        video_caption: t.type === "video" ? (t.videoCaption ?? null) : null,
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
}

void main();
