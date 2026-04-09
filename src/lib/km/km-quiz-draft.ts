const PREFIX = "4c-km-quiz-draft-v1:";

export type KmQuizDraftSubmitted = {
  scorePercent: number;
  passed: boolean;
  correctCount: number;
  total: number;
};

export type KmQuizDraft = {
  answers: Record<string, number | null>;
  submitted: KmQuizDraftSubmitted | null;
};

const emptyDraft = (): KmQuizDraft => ({ answers: {}, submitted: null });

export function loadKmQuizDraft(moduleSlug: string): KmQuizDraft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = sessionStorage.getItem(PREFIX + moduleSlug);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyDraft();
    const o = parsed as Record<string, unknown>;
    const answers =
      o.answers && typeof o.answers === "object" && !Array.isArray(o.answers)
        ? (o.answers as Record<string, number | null>)
        : {};
    const submitted =
      o.submitted && typeof o.submitted === "object"
        ? (o.submitted as KmQuizDraftSubmitted)
        : null;
    return { answers, submitted };
  } catch {
    return emptyDraft();
  }
}

export function saveKmQuizDraft(moduleSlug: string, draft: KmQuizDraft): void {
  if (typeof window === "undefined") return;
  try {
    const empty =
      Object.keys(draft.answers).length === 0 && draft.submitted === null;
    if (empty) {
      sessionStorage.removeItem(PREFIX + moduleSlug);
      return;
    }
    sessionStorage.setItem(PREFIX + moduleSlug, JSON.stringify(draft));
  } catch {
    /* quota / private mode */
  }
}

export function clearKmQuizDraft(moduleSlug: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PREFIX + moduleSlug);
  } catch {
    /* ignore */
  }
}
