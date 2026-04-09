import { KM_PASS_PERCENT } from "@/data/knowledge-mobilization";
import type { KMModuleProgress, KMStoredProgress } from "@/lib/km-progress";

/** Stored row shape: quiz progress + optional certificate name (synced when signed in). */
export type KmProgressPayload = KMStoredProgress & {
  certificateDisplayName?: string;
};

function emptyModule(): KMModuleProgress {
  return {
    reviewedTopicIds: [],
    bestScorePercent: 0,
    passed: false,
    attempts: 0,
    lastAttemptAt: null,
  };
}

function isModuleProgress(x: unknown): x is KMModuleProgress {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    Array.isArray(o.reviewedTopicIds) &&
    o.reviewedTopicIds.every((id) => typeof id === "string") &&
    typeof o.bestScorePercent === "number" &&
    typeof o.passed === "boolean" &&
    typeof o.attempts === "number" &&
    (o.lastAttemptAt === null || typeof o.lastAttemptAt === "string")
  );
}

export function emptyKmProgressPayload(): KmProgressPayload {
  return { version: 1, modules: {} };
}

export function parseKmProgressPayload(raw: unknown): KmProgressPayload {
  if (!raw || typeof raw !== "object") return emptyKmProgressPayload();
  const o = raw as Record<string, unknown>;
  if (o.version !== 1 || typeof o.modules !== "object" || o.modules === null) {
    return emptyKmProgressPayload();
  }
  const modulesIn = o.modules as Record<string, unknown>;
  const modules: Record<string, KMModuleProgress> = {};
  for (const [slug, v] of Object.entries(modulesIn)) {
    if (isModuleProgress(v)) modules[slug] = v;
  }
  const cert =
    typeof o.certificateDisplayName === "string"
      ? o.certificateDisplayName.trim()
      : "";
  return {
    version: 1,
    modules,
    ...(cert ? { certificateDisplayName: cert } : {}),
  };
}

export function mergeModuleProgress(
  a?: KMModuleProgress,
  b?: KMModuleProgress,
): KMModuleProgress {
  if (!a) return b ?? emptyModule();
  if (!b) return a;
  const reviewedTopicIds = [...new Set([...a.reviewedTopicIds, ...b.reviewedTopicIds])];
  const bestScorePercent = Math.max(a.bestScorePercent, b.bestScorePercent);
  const passed =
    a.passed || b.passed || bestScorePercent >= KM_PASS_PERCENT;
  const attempts = Math.max(a.attempts, b.attempts);
  const ta = a.lastAttemptAt ? Date.parse(a.lastAttemptAt) : 0;
  const tb = b.lastAttemptAt ? Date.parse(b.lastAttemptAt) : 0;
  const lastAttemptAt =
    ta >= tb ? a.lastAttemptAt : b.lastAttemptAt ?? null;
  return {
    reviewedTopicIds,
    bestScorePercent,
    passed,
    attempts,
    lastAttemptAt,
  };
}

/** Union module keys and merge so local + server progress both count (e.g. two devices). */
export function mergeKmProgressPayload(
  local: KmProgressPayload,
  remote: KmProgressPayload,
): KmProgressPayload {
  const slugs = new Set([
    ...Object.keys(local.modules),
    ...Object.keys(remote.modules),
  ]);
  const modules: Record<string, KMModuleProgress> = {};
  for (const slug of slugs) {
    modules[slug] = mergeModuleProgress(
      local.modules[slug],
      remote.modules[slug],
    );
  }
  const name =
    remote.certificateDisplayName?.trim() ||
    local.certificateDisplayName?.trim() ||
    undefined;
  return {
    version: 1,
    modules,
    ...(name ? { certificateDisplayName: name } : {}),
  };
}

export function payloadToStored(p: KmProgressPayload): KMStoredProgress {
  return { version: 1, modules: p.modules };
}
