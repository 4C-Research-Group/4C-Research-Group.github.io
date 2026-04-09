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

export function loadKmProgress(): KMStoredProgress {
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

export function saveKmProgress(data: KMStoredProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota or private mode */
  }
}

function getOrCreateModuleEntry(
  data: KMStoredProgress,
  moduleSlug: string,
): KMModuleProgress {
  if (!data.modules[moduleSlug]) {
    data.modules[moduleSlug] = emptyModuleProgress();
  }
  return data.modules[moduleSlug];
}

export function markTopicReviewed(moduleSlug: string, topicId: string): void {
  const data = loadKmProgress();
  const m = getOrCreateModuleEntry(data, moduleSlug);
  if (!m.reviewedTopicIds.includes(topicId)) {
    m.reviewedTopicIds = [...m.reviewedTopicIds, topicId];
  }
  saveKmProgress(data);
}

export function unmarkTopicReviewed(moduleSlug: string, topicId: string): void {
  const data = loadKmProgress();
  const m = getOrCreateModuleEntry(data, moduleSlug);
  m.reviewedTopicIds = m.reviewedTopicIds.filter((id) => id !== topicId);
  saveKmProgress(data);
}

export function recordQuizAttempt(
  moduleSlug: string,
  scorePercent: number,
): { passed: boolean; bestScorePercent: number } {
  const data = loadKmProgress();
  const m = getOrCreateModuleEntry(data, moduleSlug);
  m.attempts += 1;
  m.lastAttemptAt = new Date().toISOString();
  const best = Math.max(m.bestScorePercent, scorePercent);
  m.bestScorePercent = best;
  const passed = best >= KM_PASS_PERCENT;
  m.passed = passed;
  saveKmProgress(data);
  return { passed, bestScorePercent: best };
}

export function isTopicReviewed(
  moduleSlug: string,
  topicId: string,
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgress();
  return data.modules[moduleSlug]?.reviewedTopicIds.includes(topicId) ?? false;
}

export function allTopicsReviewed(
  mod: KMModule,
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgress();
  const reviewed = new Set(data.modules[mod.slug]?.reviewedTopicIds ?? []);
  return mod.topics.every((t) => reviewed.has(t.id));
}

export function modulePassed(
  moduleSlug: string,
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgress();
  return data.modules[moduleSlug]?.passed ?? false;
}

/** Module at index is unlocked if previous module passed, or it is the first module. */
export function isModuleUnlocked(
  mod: KMModule,
  ordered: KMModule[],
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgress();
  const idx = ordered.findIndex((m) => m.slug === mod.slug);
  if (idx <= 0) return true;
  const prev = ordered[idx - 1];
  return modulePassed(prev.slug, data);
}

export function resetKmProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  try {
    localStorage.removeItem(KM_CERTIFICATE_NAME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** True when every module in `ordered` has been passed on this device. */
export function allModulesPassed(
  ordered: KMModule[],
  progress?: KMStoredProgress,
): boolean {
  const data = progress ?? loadKmProgress();
  if (ordered.length === 0) return false;
  return ordered.every((m) => modulePassed(m.slug, data));
}

export { KM_PASS_PERCENT };
