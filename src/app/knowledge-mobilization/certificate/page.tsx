"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Download, Loader2, Printer, ArrowLeft } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useKmProgress } from "@/contexts/KmProgressContext";
import { mergeKmPagePayload } from "@/data/km-page-defaults";
import type { KmPagePayload } from "@/data/km-page";
import {
  createCertificateCanvas,
  downloadCertificatePng,
  printCertificate,
  type KmCertificateRenderOptions,
} from "@/lib/km-certificate";
import { allModulesPassed, listedModulesPassed } from "@/lib/km-progress";
import { modulesForProgramSlugs } from "@/lib/km/km-modules-for-slugs";
import {
  fetchKmCurriculumFromSupabase,
  orderedKmModulesFromFetch,
} from "@/lib/km/supabase-km-curriculum";
import { fetchKmPageContent } from "@/lib/km/supabase-km-page";
import type { KMModule } from "@/data/knowledge-mobilization";

function CertificateLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
    </div>
  );
}

function CertificatePageInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const programId = (searchParams.get("program") ?? "").trim();

  const {
    ready: kmReady,
    progress,
    certificateDisplayName,
    setCertificateDisplayName,
    syncsToAccount,
  } = useKmProgress();

  const [curriculumReady, setCurriculumReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [ordered, setOrdered] = useState<KMModule[]>([]);
  const [page, setPage] = useState<KmPagePayload>(() => mergeKmPagePayload(null));
  const [name, setName] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [result, copy] = await Promise.all([
        fetchKmCurriculumFromSupabase(),
        fetchKmPageContent(),
      ]);
      if (!alive) return;
      setOrdered(orderedKmModulesFromFetch(result));
      setPage(copy);
      setCurriculumReady(true);
      setPageReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!kmReady) return;
    setName(certificateDisplayName);
  }, [kmReady, certificateDisplayName]);

  const activeProgram = useMemo(() => {
    if (!programId) return null;
    return page.programs.find((p) => p.id === programId) ?? null;
  }, [programId, page.programs]);

  const programModules = useMemo(() => {
    if (!activeProgram) return [];
    return modulesForProgramSlugs(activeProgram.moduleSlugs, ordered);
  }, [activeProgram, ordered]);

  const moduleTitles = useMemo(() => {
    if (programId && programModules.length > 0) {
      return programModules.map((m) => m.title);
    }
    return ordered.map((m) => m.title);
  }, [programId, programModules, ordered]);

  const certOptions: KmCertificateRenderOptions | undefined = useMemo(() => {
    if (!programId || !activeProgram) return undefined;
    return { kind: "program", programTitle: activeProgram.title };
  }, [programId, activeProgram]);

  const eligible = useMemo(() => {
    if (!curriculumReady || !kmReady || ordered.length === 0) return false;
    if (programId) {
      if (!activeProgram || programModules.length === 0) return false;
      return listedModulesPassed(programModules, progress);
    }
    return allModulesPassed(ordered, progress);
  }, [
    curriculumReady,
    kmReady,
    ordered,
    programId,
    activeProgram,
    programModules,
    progress,
  ]);

  const programConfigError =
    pageReady &&
    programId &&
    (!activeProgram || programModules.length === 0);

  const redrawPreview = useCallback(
    (
      displayName: string,
      titles: string[],
      opts?: KmCertificateRenderOptions,
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const source = createCertificateCanvas(displayName, titles, new Date(), opts);
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(source, 0, 0);
    },
    [],
  );

  useEffect(() => {
    if (!eligible || moduleTitles.length === 0 || programConfigError) return;
    redrawPreview(name, moduleTitles, certOptions);
  }, [
    eligible,
    name,
    moduleTitles,
    certOptions,
    redrawPreview,
    programConfigError,
  ]);

  function handleNameBlur() {
    setCertificateDisplayName(name);
    if (eligible && !programConfigError) {
      redrawPreview(name, moduleTitles, certOptions);
    }
  }

  function handleDownload() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCertificateDisplayName(trimmed);
    setDownloading(true);
    requestAnimationFrame(() => {
      try {
        downloadCertificatePng(trimmed, moduleTitles, certOptions);
      } finally {
        setDownloading(false);
      }
    });
  }

  function handlePrint() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCertificateDisplayName(trimmed);
    printCertificate(trimmed, moduleTitles, certOptions);
  }

  if (!curriculumReady || !pageReady || !kmReady) {
    return <CertificateLoading />;
  }

  if (programConfigError) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero
          compact
          title="Certificate"
          subtitle="That micro-credential or program link is not valid, or its modules are not on the site."
        />
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-muted-foreground">
            Check the link from the Knowledge Mobilization hub, or ask an admin to
            confirm the program id and module slugs in{" "}
            <span className="font-medium text-foreground">Admin → Knowledge Mobilization</span>.
          </p>
          <Link
            href="/knowledge-mobilization/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to modules
          </Link>
        </div>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero
          compact
          title="Certificate"
          subtitle={
            programId
              ? "Pass every module in this micro-credential (80% or higher on each quiz) to unlock its certificate."
              : "Complete and pass every Knowledge Mobilization module to unlock your certificate."
          }
        />
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-muted-foreground">
            {syncsToAccount
              ? "Your saved progress does not show the required modules passed yet. "
              : "Your progress on this browser does not show the required modules passed yet. "}
            Finish each relevant module quiz with a score of at least 80%, then return
            here.
          </p>
          <Link
            href="/knowledge-mobilization/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to modules
          </Link>
        </div>
      </div>
    );
  }

  const canIssue = name.trim().length > 0;
  const heroSubtitle = programId
    ? `Micro-credential: ${activeProgram?.title ?? "Program"}. Enter your name, preview, then download or print.`
    : "Enter your name as it should appear, preview below, then download a PNG or print / save as PDF.";

  return (
    <div className="min-h-screen bg-background">
      <PageHero compact title="Your certificate" subtitle={heroSubtitle} />

      <div className="container mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-lg sm:p-8"
        >
          <div className="flex items-start gap-3 rounded-xl border border-care/25 bg-care/5 p-4 text-sm text-muted-foreground">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-care" />
            <p>
              This certificate is generated in your browser for completing{" "}
              {programId ? (
                <>
                  the <strong className="text-foreground">listed modules</strong> in
                  this micro-credential
                </>
              ) : (
                <>
                  all modules
                </>
              )}{" "}
              {syncsToAccount ? (
                <>
                  tied to <strong className="text-foreground">your account</strong>
                </>
              ) : (
                <>
                  on <strong className="text-foreground">this device</strong>
                </>
              )}
              . It is not a substitute for employer or college transcripts. For
              official training records, follow your institution’s process.
            </p>
          </div>

          <label className="mt-8 block">
            <span className="text-sm font-semibold text-foreground">
              Full name on certificate
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="e.g. Jane Doe, RN"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!canIssue || downloading}
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/20 transition hover:bg-brand-deep disabled:pointer-events-none disabled:opacity-40"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download PNG
            </button>
            <button
              type="button"
              disabled={!canIssue}
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:border-brand/30 disabled:pointer-events-none disabled:opacity-40"
            >
              <Printer className="h-4 w-4" />
              Print / Save as PDF
            </button>
            <Link
              href="/knowledge-mobilization/"
              className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-brand hover:underline"
            >
              Back to modules
            </Link>
          </div>

          {!canIssue ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Add your name to enable download and print.
            </p>
          ) : null}

          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Preview
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-muted/30 p-2 shadow-inner">
              <canvas
                ref={canvasRef}
                className="mx-auto block h-auto max-w-full rounded-lg shadow-md"
                aria-label="Certificate preview"
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Preview matches the downloaded image (landscape PNG).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<CertificateLoading />}>
      <CertificatePageInner />
    </Suspense>
  );
}
