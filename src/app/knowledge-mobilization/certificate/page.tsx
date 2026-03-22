"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Download, Loader2, Printer, ArrowLeft } from "lucide-react";
import PageHero from "@/components/PageHero";
import {
  createCertificateCanvas,
  downloadCertificatePng,
  loadCertificateDisplayName,
  printCertificate,
  saveCertificateDisplayName,
} from "@/lib/km-certificate";
import { allModulesPassed, loadKmProgress } from "@/lib/km-progress";

export default function CertificatePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const progress = loadKmProgress();
    setEligible(allModulesPassed(progress));
    setName(loadCertificateDisplayName());
  }, []);

  const redrawPreview = useCallback((displayName: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const source = createCertificateCanvas(displayName);
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(source, 0, 0);
  }, []);

  useEffect(() => {
    if (eligible !== true) return;
    redrawPreview(name);
  }, [eligible, name, redrawPreview]);

  function handleNameBlur() {
    saveCertificateDisplayName(name);
    redrawPreview(name);
  }

  function handleDownload() {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveCertificateDisplayName(trimmed);
    setDownloading(true);
    requestAnimationFrame(() => {
      try {
        downloadCertificatePng(trimmed);
      } finally {
        setDownloading(false);
      }
    });
  }

  function handlePrint() {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveCertificateDisplayName(trimmed);
    printCertificate(trimmed);
  }

  if (eligible === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero
          compact
          title="Certificate"
          subtitle="Complete and pass every Knowledge Mobilization module to unlock your certificate."
        />
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-muted-foreground">
            Your progress on this browser does not show all modules passed yet.
            Finish each module quiz with a score of at least 80%, then return
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

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title="Your certificate"
        subtitle="Enter your name as it should appear, preview below, then download a PNG or print / save as PDF."
      />

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
              This certificate is generated in your browser for completing all
              modules on <strong className="text-foreground">this device</strong>
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
