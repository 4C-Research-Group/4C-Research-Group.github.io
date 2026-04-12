"use client";

import { useEffect, useRef } from "react";
import { Award, ChevronDown } from "lucide-react";
import { createCertificateCanvas } from "@/lib/km-certificate";
import type { KMModule } from "@/data/knowledge-mobilization";

function paintCanvas(
  canvas: HTMLCanvasElement | null,
  source: HTMLCanvasElement | null,
) {
  if (!canvas || !source) return;
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(source, 0, 0);
}

export default function KmCertificateHubPreview({
  modules,
  programSample,
}: {
  modules: KMModule[];
  /** When set, a second sample shows the micro-credential certificate layout. */
  programSample: { title: string; moduleTitles: string[] } | null;
}) {
  const fullTrackRef = useRef<HTMLCanvasElement>(null);
  const programRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const titles =
      modules.length > 0
        ? modules.map((m) => m.title)
        : [
            "PICU neuro basics for bedside staff",
            "Neuromonitoring & team communication",
            "Quality improvement & knowledge sharing",
          ];
    const src = createCertificateCanvas("Jamie Learner, RN", titles, new Date());
    paintCanvas(fullTrackRef.current, src);
  }, [modules]);

  useEffect(() => {
    if (!programSample || programSample.moduleTitles.length === 0) return;
    const src = createCertificateCanvas(
      "Jamie Learner, RN",
      programSample.moduleTitles,
      new Date(),
      { kind: "program", programTitle: programSample.title },
    );
    paintCanvas(programRef.current, src);
  }, [programSample]);

  return (
    <details
      className="group mb-8 rounded-2xl border border-border/80 bg-card/90 shadow-sm ring-1 ring-black/[0.03] open:pb-5 sm:open:pb-6"
      aria-labelledby="km-cert-preview-heading"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl p-4 pr-3 marker:hidden sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-care/15 text-care sm:h-10 sm:w-10">
          <Award className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="km-cert-preview-heading"
            className="text-base font-bold tracking-tight text-foreground sm:text-lg"
          >
            Certificate samples
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:text-[13px]">
            Optional preview — expand to see layout. Yours uses your name and
            completed modules.
          </p>
        </div>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-muted-foreground transition group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="border-t border-border/60 px-4 pb-1 pt-4 sm:px-5">
        <p className="mb-4 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Download or print from the certificate page when you qualify (full track
          or a micro-credential).
        </p>
        <div
          className={
            programSample
              ? "grid gap-5 lg:grid-cols-2 lg:gap-6"
              : "mx-auto max-w-3xl"
          }
        >
          <div>
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Full learning track
            </p>
            <div className="overflow-hidden rounded-lg border border-border bg-muted/25 p-1.5 shadow-inner">
              <canvas
                ref={fullTrackRef}
                className="mx-auto block h-auto max-h-[min(42vh,280px)] w-auto max-w-full rounded-md shadow-md"
                aria-label="Sample certificate for the full module track"
              />
            </div>
          </div>
          {programSample ? (
            <div>
              <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Micro-credential (example)
              </p>
              <div className="overflow-hidden rounded-lg border border-border bg-muted/25 p-1.5 shadow-inner">
                <canvas
                  ref={programRef}
                  className="mx-auto block h-auto max-h-[min(42vh,280px)] w-auto max-w-full rounded-md shadow-md"
                  aria-label="Sample micro-credential certificate"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}
