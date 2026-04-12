"use client";

import { useEffect, useRef } from "react";
import { Award } from "lucide-react";
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
    <section
      className="mb-10 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8"
      aria-labelledby="km-cert-preview-heading"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-care/15 text-care">
            <Award className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2
              id="km-cert-preview-heading"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Certificate layout
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Samples only — your real certificate uses your name and the modules
              you finish (full track or a micro-credential). Download or print from
              the certificate page when you qualify.
            </p>
          </div>
        </div>
      </div>

      <div
        className={
          programSample
            ? "grid gap-8 lg:grid-cols-2"
            : "mx-auto max-w-4xl"
        }
      >
        <div>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full learning track
          </p>
          <div className="overflow-hidden rounded-xl border border-border bg-muted/25 p-2 shadow-inner">
            <canvas
              ref={fullTrackRef}
              className="mx-auto block h-auto w-full max-w-full rounded-lg shadow-md"
              aria-label="Sample certificate for the full module track"
            />
          </div>
        </div>
        {programSample ? (
          <div>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Micro-credential (example program)
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-muted/25 p-2 shadow-inner">
              <canvas
                ref={programRef}
                className="mx-auto block h-auto w-full max-w-full rounded-lg shadow-md"
                aria-label="Sample micro-credential certificate"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
