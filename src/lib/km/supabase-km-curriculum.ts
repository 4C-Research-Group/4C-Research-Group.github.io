import type {
  KMModule,
  KMQuestion,
  KMTopic,
} from "@/data/knowledge-mobilization";
import { kmModules } from "@/data/knowledge-mobilization";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

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
  slug: string;
  title: string;
  summary: string;
  sort_order: number;
  km_topics: TopicRow[] | null;
  km_questions: QuestionRow[] | null;
};

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is string => typeof p === "string");
}

function mapTopic(r: TopicRow): KMTopic | null {
  const paragraphs = parseStringArray(r.paragraphs);
  if (r.topic_type === "video") {
    const embed = (r.embed_url ?? "").trim();
    return {
      id: r.topic_key,
      title: r.title,
      type: "video",
      paragraphs,
      ...(embed ? { embedUrl: embed } : {}),
      ...(r.video_caption?.trim()
        ? { videoCaption: r.video_caption.trim() }
        : {}),
    };
  }
  if (r.topic_type === "text") {
    return {
      id: r.topic_key,
      title: r.title,
      type: "text",
      paragraphs,
    };
  }
  return null;
}

function mapQuestion(r: QuestionRow): KMQuestion | null {
  const opts = parseStringArray(r.options);
  if (opts.length !== 4) return null;
  if (
    typeof r.correct_index !== "number" ||
    r.correct_index < 0 ||
    r.correct_index > 3
  ) {
    return null;
  }
  return {
    id: r.question_key,
    prompt: r.prompt,
    options: opts,
    correctIndex: r.correct_index,
  };
}

function sortByOrder<T extends { sort_order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

function moduleFromRow(m: ModuleRow): KMModule {
  const topicRows = sortByOrder(m.km_topics ?? []);
  const questionRows = sortByOrder(m.km_questions ?? []);
  const topics = topicRows.map(mapTopic).filter((t): t is KMTopic => t != null);
  const questions = questionRows
    .map(mapQuestion)
    .filter((q): q is KMQuestion => q != null);
  return {
    slug: m.slug,
    title: m.title,
    summary: (m.summary ?? "").trim(),
    order: m.sort_order,
    topics,
    questions,
  };
}

export type FetchKmCurriculumResult = {
  modules: KMModule[];
  /** True when Supabase returned successfully (use `modules` even if empty). */
  fromDatabase: boolean;
};

/**
 * Full curriculum for hub + certificate ordering. Anonymous read via RLS.
 */
export async function fetchKmCurriculumFromSupabase(): Promise<FetchKmCurriculumResult> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("km_modules")
      .select(
        `
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
    if (error) {
      console.warn("[km]", error.message);
      return { modules: [], fromDatabase: false };
    }
    const rows = (data ?? []) as ModuleRow[];
    const modules = rows.map(moduleFromRow);
    return { modules, fromDatabase: true };
  } catch {
    return { modules: [], fromDatabase: false };
  }
}

export async function fetchKmModuleBySlugFromSupabase(
  slug: string,
): Promise<KMModule | null> {
  const { modules, fromDatabase } = await fetchKmCurriculumFromSupabase();
  if (!fromDatabase) return null;
  return modules.find((m) => m.slug === slug) ?? null;
}

/** Ordered list: live DB when fetch succeeded, else bundled static curriculum. */
export function orderedKmModulesFromFetch(
  result: FetchKmCurriculumResult,
): KMModule[] {
  if (result.fromDatabase) {
    return [...result.modules].sort((a, b) => a.order - b.order);
  }
  return [...kmModules].sort((a, b) => a.order - b.order);
}
