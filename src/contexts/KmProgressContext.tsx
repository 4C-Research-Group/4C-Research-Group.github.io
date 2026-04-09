"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import {
  saveCertificateDisplayName,
  loadCertificateDisplayName,
} from "@/lib/km-certificate";
import {
  emptyKmProgressPayload,
  mergeKmProgressPayload,
  payloadToStored,
  type KmProgressPayload,
} from "@/lib/km/km-progress-merge";
import {
  clearKmUserProgressRemote,
  fetchKmUserProgress,
  upsertKmUserProgress,
} from "@/lib/km/km-user-progress-remote";
import {
  applyMarkTopicReviewed,
  applyRecordQuizAttempt,
  applyUnmarkTopicReviewed,
  loadKmProgressFromLocal,
  resetKmProgressLocalOnly,
  saveKmProgressToLocal,
  type KMStoredProgress,
} from "@/lib/km-progress";

const SYNC_DEBOUNCE_MS = 450;

function buildPayloadFromLocalStorage(): KmProgressPayload {
  const stored = loadKmProgressFromLocal();
  const cert = loadCertificateDisplayName().trim();
  return {
    version: 1,
    modules: stored.modules,
    ...(cert ? { certificateDisplayName: cert } : {}),
  };
}

function persistLocalMirror(p: KmProgressPayload): void {
  saveKmProgressToLocal({ version: 1, modules: p.modules });
  saveCertificateDisplayName(p.certificateDisplayName?.trim() ?? "");
}

type KmProgressContextValue = {
  ready: boolean;
  userId: string | null;
  /** True when signed in — progress is merged with Supabase and debounced-uploaded. */
  syncsToAccount: boolean;
  progress: KMStoredProgress;
  certificateDisplayName: string;
  setCertificateDisplayName: (name: string) => void;
  markTopicReviewed: (moduleSlug: string, topicId: string) => void;
  unmarkTopicReviewed: (moduleSlug: string, topicId: string) => void;
  recordQuizAttempt: (
    moduleSlug: string,
    scorePercent: number,
  ) => { passed: boolean; bestScorePercent: number };
  resetAll: () => void;
  syncError: string | null;
};

const KmProgressContext = createContext<KmProgressContextValue | null>(null);

export function KmProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready: authReady, userId } = useAuthProfile();
  const hydrateKey = !authReady ? "__auth_wait__" : (userId ?? "__guest__");
  const [payload, setPayload] = useState<KmProgressPayload>(emptyKmProgressPayload);
  /** Last `hydrateKey` we finished loading payload for (avoids syncing stale data on user switch). */
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const remoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushLocalRef = useRef({
    ready: false,
    payload: emptyKmProgressPayload() as KmProgressPayload,
  });

  const progressReady = authReady && loadedKey === hydrateKey;

  const flushRemote = useCallback(async (uid: string, p: KmProgressPayload) => {
    const res = await upsertKmUserProgress(uid, p);
    if (!res.ok) setSyncError(res.message);
    else setSyncError(null);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    const keyForThisRun = hydrateKey;
    let cancelled = false;

    void (async () => {
      if (keyForThisRun === "__guest__") {
        const local = buildPayloadFromLocalStorage();
        if (!cancelled) {
          setPayload(local);
          setLoadedKey(keyForThisRun);
        }
        return;
      }

      const remote = await fetchKmUserProgress(userId!);
      const local = buildPayloadFromLocalStorage();
      const remotePayload = remote ?? emptyKmProgressPayload();
      const merged = mergeKmProgressPayload(local, remotePayload);

      if (!cancelled) {
        setPayload(merged);
        persistLocalMirror(merged);
        setLoadedKey(keyForThisRun);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, hydrateKey, userId]);

  useLayoutEffect(() => {
    flushLocalRef.current = { ready: progressReady, payload };
    if (!progressReady) return;
    persistLocalMirror(payload);
  }, [progressReady, payload]);

  useEffect(() => {
    if (!progressReady || !userId) return;
    if (remoteTimerRef.current) clearTimeout(remoteTimerRef.current);
    remoteTimerRef.current = setTimeout(() => {
      remoteTimerRef.current = null;
      void flushRemote(userId, payload);
    }, SYNC_DEBOUNCE_MS);
    return () => {
      if (remoteTimerRef.current) clearTimeout(remoteTimerRef.current);
    };
  }, [payload, progressReady, userId, flushRemote]);

  useEffect(() => {
    function persistBeforeLeave() {
      const { ready, payload: p } = flushLocalRef.current;
      if (!ready) return;
      persistLocalMirror(p);
    }
    window.addEventListener("pagehide", persistBeforeLeave);
    const onVis = () => {
      if (document.visibilityState === "hidden") persistBeforeLeave();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", persistBeforeLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const markTopicReviewed = useCallback((moduleSlug: string, topicId: string) => {
    setPayload((prev) => {
      const nextStored = applyMarkTopicReviewed(
        payloadToStored(prev),
        moduleSlug,
        topicId,
      );
      return { ...prev, ...nextStored };
    });
  }, []);

  const unmarkTopicReviewed = useCallback((moduleSlug: string, topicId: string) => {
    setPayload((prev) => {
      const nextStored = applyUnmarkTopicReviewed(
        payloadToStored(prev),
        moduleSlug,
        topicId,
      );
      return { ...prev, ...nextStored };
    });
  }, []);

  const recordQuizAttemptCb = useCallback(
    (moduleSlug: string, scorePercent: number) => {
      let passed = false;
      let bestScorePercent = 0;
      setPayload((prev) => {
        const out = applyRecordQuizAttempt(
          payloadToStored(prev),
          moduleSlug,
          scorePercent,
        );
        passed = out.passed;
        bestScorePercent = out.bestScorePercent;
        return { ...prev, ...out.next };
      });
      return { passed, bestScorePercent };
    },
    [],
  );

  const setCertificateDisplayName = useCallback((name: string) => {
    const trimmed = name.trim();
    setPayload((prev) => {
      if (trimmed) return { ...prev, certificateDisplayName: trimmed };
      return { version: 1, modules: prev.modules };
    });
  }, []);

  const resetAll = useCallback(() => {
    const empty = emptyKmProgressPayload();
    setPayload(empty);
    resetKmProgressLocalOnly();
    persistLocalMirror(empty);
    setSyncError(null);
    if (userId) {
      void clearKmUserProgressRemote(userId);
    }
  }, [userId]);

  const progress = useMemo(() => payloadToStored(payload), [payload]);

  const certificateDisplayName = payload.certificateDisplayName?.trim() ?? "";

  const value = useMemo<KmProgressContextValue>(
    () => ({
      ready: progressReady,
      userId,
      syncsToAccount: !!userId,
      progress,
      certificateDisplayName,
      setCertificateDisplayName,
      markTopicReviewed,
      unmarkTopicReviewed,
      recordQuizAttempt: recordQuizAttemptCb,
      resetAll,
      syncError,
    }),
    [
      progressReady,
      userId,
      progress,
      certificateDisplayName,
      setCertificateDisplayName,
      markTopicReviewed,
      unmarkTopicReviewed,
      recordQuizAttemptCb,
      resetAll,
      syncError,
    ],
  );

  return (
    <KmProgressContext.Provider value={value}>{children}</KmProgressContext.Provider>
  );
}

export function useKmProgress(): KmProgressContextValue {
  const ctx = useContext(KmProgressContext);
  if (!ctx) {
    throw new Error("useKmProgress must be used within KmProgressProvider");
  }
  return ctx;
}
