/**
 * Inserts sample blog posts (skips if slug exists).
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)
 *
 * Usage: npm run seed-blog
 */

import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "../src/lib/supabase/database.types";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });

function serviceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim()
  );
}

const SAMPLES: Database["public"]["Tables"]["blog_posts"]["Insert"][] = [
  {
    slug: "welcome-to-4c-blog",
    title: "Welcome to the 4C Research blog",
    excerpt:
      "A short introduction to how we share lab news, methods, and milestones.",
    content: `
<p>This is a sample post. Replace it from <strong>Admin → Blog</strong> or edit in Supabase.</p>
<h2>Why a blog?</h2>
<p>We use this space for accessible updates alongside formal publications.</p>
<ul>
  <li>Study milestones and recruitment</li>
  <li>Conference highlights</li>
  <li>Behind-the-scenes methods</li>
</ul>
`.trim(),
    category: "News",
    read_time: "3 min read",
    image_url: "",
    tags: ["announcement", "4C"] as unknown as Json,
    featured: true,
    published: true,
    author_name: "4C Research Group",
    author_role: "Communications",
    author_image_url: "",
  },
  {
    slug: "picu-neuroimaging-spotlight",
    title: "PICU neuroimaging: a quick spotlight",
    excerpt:
      "How multimodal monitoring supports understanding brain health in critically ill children.",
    content: `
<p>Neuroimaging in the pediatric intensive care unit helps teams track brain function when children cannot reliably participate in bedside exams alone.</p>
<h2>Multimodal approaches</h2>
<p>Combining EEG with other tools can provide complementary views of cortical activity and perfusion—always within institutional protocols and consent.</p>
<p><em>This post is sample HTML for layout testing.</em></p>
`.trim(),
    category: "Research",
    read_time: "6 min read",
    image_url: "",
    tags: ["PICU", "EEG", "neuroimaging"] as unknown as Json,
    featured: false,
    published: true,
    author_name: "4C Research Group",
    author_role: "Research team",
    author_image_url: "",
  },
];

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

  for (const row of SAMPLES) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", row.slug)
      .maybeSingle();
    if (existing) {
      console.log("Skip (exists):", row.slug);
      continue;
    }
    const { error } = await supabase.from("blog_posts").insert(row);
    if (error) {
      console.error("Insert", row.slug, error.message);
      process.exit(1);
    }
    console.log("OK", row.slug);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
