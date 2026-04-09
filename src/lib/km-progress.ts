import { KM_PASS_PERCENT, type KMModule } from "@/data/knowledge-mobilization";
import { KM_CERTIFICATE_NAME_STORAGE_KEY } from "@/lib/km-certificate";

const STORAGE_KEY = "4c-km-progress-v1";

export interface KMModuleProgress {
  reviewedTopicIds: string[];
  bestScorePercent: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt: string | null;
}

export interface KMStoredProgress {
  version: 1;
  modules: Record<string, KMModuleProgress>;
}

function emptyModuleProgress(): KMModuleProgress {
  return {
    reviewedTopicIds: [],
    bestScorePercent: 0,
    passed: false,
    attempts: 0,
    lastAttemptAt: null,
  };
}

export function loadKmProgressFromLocal(): KMStoredProgress {
  if (typeof window === "undefined") {
    return { version: 1, modules: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, modules: {} };
    const parsed = JSON.parse(raw) as KMStoredProgress;
    if (parsed?.version !== 1 || typeof parsed.modules !== "object") {
      return { version: 1, modules: {} };
    }
    return parsed;
  } catch {
    return { version: 1, modules: {} };
  }
}

export function saveKmProgressToLocal(data: KMStoredProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota or private mode */
  }
}

/** @deprecated Prefer `loadKmProgressFromLocal` or `useKmProgress()` for signed-in sync. */
export function loadKmProgress(): KMStoredProgress {
  return loadKmProgressFromLocal();
}

/** @deprecated Prefer `saveKmProgressToLocal` or `useKmProgress()` for signed-in sync. */
export function saveKmProgress(data: KMStoredProgress): void {
  saveKmProgressToLocal(data);
}

export function applyMarkTopicReviewed(
  data: KMStoredProgress,
  moduleSlug: string,
  topicId: string,
): KMStoredProgress {
  const modules = { ...data.modules };
  const cur = modules[moduleSlug] ?? emptyModuleProgress();
  if (cur.reviewedTopicIds.includes(topicId)) return data;
  modules[moduleSlug] = {
    ...cur,
    reviewedTopicIds: [...cur.reviewedTopicIds, topicId],
  };
  return { ...data, modules };
}

export function applyUnmarkTopicReviewed(
  data: KMStoredProgress,
  moduleSlug: string,
  topicId: string,
): KMStoredProgress {
  const modules = { ...data.modules };
  const cur = modules[moduleSlug];
  if (!cur) return data;
  modules[moduleSlug] = {
    ...cur,
    reviewedTopicIds: cur.reviewedTopicIds.filter((id) => id !== topicId),
  };
  return { ...data, modules };
}

export function applyRecordQuizAttempt(
  data: KMStoredProgress,
  moduleSlug: string,
  scorePercent: number,
): {
  next: KMStoredProgress;
  passed: boolean;
  bestScorePercent: number;
} {
  const modules = { ...data.modules };
  const cur = modules[moduleSlug] ?? emptyModuleProgress();
  const attempts = cur.attempts + 1;
  const lastAttemptAt = new Date().toISOString();
  const bestScorePercent = Math.max(cur.bestScorePercent, scorePercent);
  const passed = bestScorePercent >= KM_PASS_PERCENT;
  modules[moduleSlug] = {
    ...cur,
    attempts,
    lastAttemptAt,
    bestScorePercent,
    passed,
  };
  return {
    next: { ...data, modules },
    passed,
    bestScorePercent,
  };
}

/** @deprecated Use `useKmProgress().markTopicReviewed` when inside Knowledge Mobilization. */
export function markTopicReviewed(moduleSlug: string, topicId: string): void {
  const data = loadKmProgressFromLocal();
  saveKmProgressToLocal(applyMarkTopicReviewed(data, moduleSlug, topicId));
}

/** @deprecated Use `useKmProgress().unmarkTopicReviewed` when inside Knowledge Mobilization. */
export function unmarkTopicReviewed(moduleSlug: string, topicId: string): void {
  const data = loadKmProgressFromLocal();
  saveKmProgressToLocal(applyUnmarkTopicReviewed(data, moduleSlug, topicId));
}

/** @deprecated Use `useKmProgress().recordQuizAttempt` when inside Knowledge Mobilization. */
export function recordQuizAttempt(
  moduleSlug: string,
  scorePercent: number,
): { passed: boolean; bestScorePercent: number } {
  const data = loadKmProgressFromLocal();
  const { next, passed, bestScorePercent } = applyRecordQuizAttempt(
    data,
    moduleSlug,
    scorePercent,
  );
  saveKmProgressToLocal(next);
  return { passed, bestScorePercent };
}

export function isTopicReviewed(
  moduleSlug: string,
  topicId: string,
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgressFromLocal();
  return data.modules[moduleSlug]?.reviewedTopicIds.includes(topicId) ?? false;
}

export function allTopicsReviewed(
  mod: KMModule,
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgressFromLocal();
  const reviewed = new Set(data.modules[mod.slug]?.reviewedTopicIds ?? []);
  return mod.topics.every((t) => reviewed.has(t.id));
}

export function modulePassed(
  moduleSlug: string,
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgressFromLocal();
  return data.modules[moduleSlug]?.passed ?? false;
}

export function isModuleUnlocked(
  mod: KMModule,
  ordered: KMModule[],
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgressFromLocal();
  const idx = ordered.findIndex((m) => m.slug === mod.slug);
  if (idx <= 0) return true;
  const prev = ordered[idx - 1];
  return modulePassed(prev.slug, data);
}

/** Clears only local storage (browser). Remote reset is handled in `useKmProgress().resetAll`. */
export function resetKmProgressLocalOnly(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  try {
    localStorage.removeItem(KM_CERTIFICATE_NAME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** @deprecated Use `resetKmProgressLocalOnly` or context `resetAll`. */
export function resetKmProgress(): void {
  resetKmProgressLocalOnly();
}

export function allModulesPassed(
  ordered: KMModule[],
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgressFromLocal();
  if (ordered.length === 0) return false;
  return ordered.every((m) => modulePassed(m.slug, data));
}

export { KM_PASS_PERCENT };
