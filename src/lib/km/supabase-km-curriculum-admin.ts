import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export type KmAdminTopicDraft = {
  topicKey: string;
  sortOrder: number;
  topicType: "text" | "video" | "audio";
  title: string;
  paragraphs: string[];
  embedUrl: string;
  /** Used for video caption and podcast / audio episode caption (same DB column). */
  videoCaption: string;
};

export type KmAdminQuestionDraft = {
  questionKey: string;
  sortOrder: number;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type KmAdminModuleDraft = {
  /** Supabase row id; null when the module has not been saved yet. */
  dbId: string | null;
  slug: string;
  title: string;
  summary: string;
  sortOrder: number;
  topics: KmAdminTopicDraft[];
  questions: KmAdminQuestionDraft[];
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY_RE = /^[a-zA-Z0-9_-]{1,64}$/;

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is string => typeof p === "string");
}

function sortByOrder<T extends { sortOrder: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function isValidKmSlug(slug: string): boolean {
  return SLUG_RE.test(slug.trim());
}

export function isValidKmKey(key: string): boolean {
  return KEY_RE.test(key.trim());
}

export function validateKmAdminModuleDraft(
  m: KmAdminModuleDraft,
): string[] {
  const errs: string[] = [];
  const slug = m.slug.trim();
  if (!slug) errs.push("Module slug is required.");
  else if (!isValidKmSlug(slug)) {
    errs.push(
      "Slug must be lowercase letters, numbers, and hyphens only (e.g. picu-neuro-basics).",
    );
  }
  if (!m.title.trim()) errs.push("Module title is required.");
  if (m.topics.length === 0) {
    errs.push("Add at least one topic (learners must review topics before the quiz).");
  }
  if (m.questions.length === 0) {
    errs.push("Add at least one quiz question.");
  }

  const topicKeys = new Set<string>();
  for (let i = 0; i < m.topics.length; i++) {
    const t = m.topics[i]!;
    const k = t.topicKey.trim();
    if (!k) errs.push(`Topic ${i + 1}: key is required.`);
    else if (!isValidKmKey(k)) {
      errs.push(
        `Topic ${i + 1}: key must be 1–64 chars (letters, numbers, _ or -).`,
      );
    } else if (topicKeys.has(k)) errs.push(`Duplicate topic key: ${k}`);
    else topicKeys.add(k);
    if (!t.title.trim()) errs.push(`Topic ${i + 1}: title is required.`);
  }

  const qKeys = new Set<string>();
  for (let i = 0; i < m.questions.length; i++) {
    const q = m.questions[i]!;
    const k = q.questionKey.trim();
    if (!k) errs.push(`Question ${i + 1}: key is required.`);
    else if (!isValidKmKey(k)) {
      errs.push(
        `Question ${i + 1}: key must be 1–64 chars (letters, numbers, _ or -).`,
      );
    } else if (qKeys.has(k)) errs.push(`Duplicate question key: ${k}`);
    else qKeys.add(k);
    if (!q.prompt.trim()) errs.push(`Question ${i + 1}: prompt is required.`);
    for (let j = 0; j < 4; j++) {
      if (!q.options[j]!.trim()) {
        errs.push(`Question ${i + 1}: option ${j + 1} is required.`);
      }
    }
  }

  return errs;
}

type TopicRow = {
  topic_key: string;
  sort_order: number;
  topic_type: string;
  title: string;
  paragraphs: unknown;
  embed_url: string | null;
  video_caption: string | null;
};

type QuestionRow = {
  question_key: string;
  sort_order: number;
  prompt: string;
  options: unknown;
  correct_index: number;
};

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sort_order: number;
  km_topics: TopicRow[] | null;
  km_questions: QuestionRow[] | null;
};

function mapTopicRow(r: TopicRow): KmAdminTopicDraft {
  const tt =
    r.topic_type === "video"
      ? "video"
      : r.topic_type === "audio"
        ? "audio"
        : "text";
  return {
    topicKey: r.topic_key,
    sortOrder: r.sort_order,
    topicType: tt,
    title: r.title,
    paragraphs: parseStringArray(r.paragraphs),
    embedUrl: (r.embed_url ?? "").trim(),
    videoCaption: (r.video_caption ?? "").trim(),
  };
}

function mapQuestionRow(r: QuestionRow): KmAdminQuestionDraft | null {
  const opts = parseStringArray(r.options);
  if (opts.length !== 4) return null;
  const ci = r.correct_index;
  if (typeof ci !== "number" || ci < 0 || ci > 3) return null;
  return {
    questionKey: r.question_key,
    sortOrder: r.sort_order,
    prompt: r.prompt,
    options: [opts[0]!, opts[1]!, opts[2]!, opts[3]!],
    correctIndex: ci as 0 | 1 | 2 | 3,
  };
}

function moduleRowToDraft(m: ModuleRow): KmAdminModuleDraft {
  const topics = sortByOrder((m.km_topics ?? []).map(mapTopicRow));
  const questions = sortByOrder(
    (m.km_questions ?? [])
      .map(mapQuestionRow)
      .filter((q): q is KmAdminQuestionDraft => q != null),
  );
  return {
    dbId: m.id,
    slug: m.slug,
    title: m.title,
    summary: (m.summary ?? "").trim(),
    sortOrder: m.sort_order,
    topics,
    questions,
  };
}

export async function fetchKmCurriculumForAdmin(): Promise<KmAdminModuleDraft[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("km_modules")
    .select(
      `
      id,
      slug,
      title,
      summary,
      sort_order,
      km_topics (
        topic_key,
        sort_order,
        topic_type,
        title,
        paragraphs,
        embed_url,
        video_caption
      ),
      km_questions (
        question_key,
        sort_order,
        prompt,
        options,
        correct_index
      )
    `,
    )
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as ModuleRow[];
  return rows.map(moduleRowToDraft);
}

export async function isKmSlugTaken(
  slug: string,
  excludeModuleId: string | null,
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("km_modules")
    .select("id")
    .eq("slug", slug.trim())
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.id) return false;
  if (excludeModuleId && data.id === excludeModuleId) return false;
  return true;
}

/**
 * Inserts or updates the module row, replaces all topics and questions for that module.
 */
export async function saveKmAdminModule(
  draft: KmAdminModuleDraft,
): Promise<{ moduleId: string }> {
  const errs = validateKmAdminModuleDraft(draft);
  if (errs.length) throw new Error(errs.join(" "));

  const slug = draft.slug.trim();
  const taken = await isKmSlugTaken(slug, draft.dbId);
  if (taken) throw new Error(`Slug "${slug}" is already used by another module.`);

  const supabase = getSupabaseBrowserClient();
  let moduleId = draft.dbId;

  if (!moduleId) {
    const { data, error } = await supabase
      .from("km_modules")
      .insert({
        slug,
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        sort_order: draft.sortOrder,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    moduleId = data!.id;
  } else {
    const { error } = await supabase
      .from("km_modules")
      .update({
        slug,
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        sort_order: draft.sortOrder,
      })
      .eq("id", moduleId);
    if (error) throw new Error(error.message);
  }

  const { error: dt } = await supabase
    .from("km_topics")
    .delete()
    .eq("module_id", moduleId);
  if (dt) throw new Error(dt.message);

  const { error: dq } = await supabase
    .from("km_questions")
    .delete()
    .eq("module_id", moduleId);
  if (dq) throw new Error(dq.message);

  const topicInserts = sortByOrder(draft.topics).map((t, i) => ({
    module_id: moduleId!,
    topic_key: t.topicKey.trim(),
    sort_order: t.sortOrder ?? i,
    topic_type: t.topicType,
    title: t.title.trim(),
    paragraphs: t.paragraphs.map((p) => p.trim()).filter(Boolean) as Json,
    embed_url:
      t.topicType === "video" || t.topicType === "audio"
        ? t.embedUrl.trim() || null
        : null,
    video_caption:
      t.topicType === "video" || t.topicType === "audio"
        ? t.videoCaption.trim() || null
        : null,
  }));

  if (topicInserts.length) {
    const { error: ti } = await supabase.from("km_topics").insert(topicInserts);
    if (ti) throw new Error(ti.message);
  }

  const questionInserts = sortByOrder(draft.questions).map((q, i) => ({
    module_id: moduleId!,
    question_key: q.questionKey.trim(),
    sort_order: q.sortOrder ?? i,
    prompt: q.prompt.trim(),
    options: q.options.map((o) => o.trim()) as Json,
    correct_index: q.correctIndex,
  }));

  if (questionInserts.length) {
    const { error: qi } = await supabase
      .from("km_questions")
      .insert(questionInserts);
    if (qi) throw new Error(qi.message);
  }

  return { moduleId: moduleId! };
}

export async function deleteKmModule(moduleId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("km_modules").delete().eq("id", moduleId);
  if (error) throw new Error(error.message);
}

export function emptyKmAdminModule(sortOrder: number): KmAdminModuleDraft {
  return {
    dbId: null,
    slug: "",
    title: "",
    summary: "",
    sortOrder,
    topics: [],
    questions: [],
  };
}

let _kmTopicKeyFallback = 0;

export function newTopicDraft(sortOrder: number): KmAdminTopicDraft {
  let key: string;
  try {
    if (typeof globalThis.crypto?.randomUUID === "function") {
      key = `t-${globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    } else {
      key = `t-${Date.now()}-${++_kmTopicKeyFallback}`;
    }
  } catch {
    key = `t-${Date.now()}-${++_kmTopicKeyFallback}`;
  }
  return {
    topicKey: key,
    sortOrder,
    topicType: "text",
    title: "",
    paragraphs: [],
    embedUrl: "",
    videoCaption: "",
  };
}

let _kmQuestionKeyFallback = 0;

export function newQuestionDraft(sortOrder: number): KmAdminQuestionDraft {
  let key: string;
  try {
    if (typeof globalThis.crypto?.randomUUID === "function") {
      key = `q-${globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    } else {
      key = `q-${Date.now()}-${++_kmQuestionKeyFallback}`;
    }
  } catch {
    key = `q-${Date.now()}-${++_kmQuestionKeyFallback}`;
  }
  return {
    questionKey: key,
    sortOrder,
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  };
}
