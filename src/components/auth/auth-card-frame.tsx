import type { ReactNode } from "react";

/** Shared full-page card shell for login, signup, forgot password, and reset flows. */
export function AuthCardFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/40 via-background to-muted/30" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mask-[linear-gradient(180deg,black,transparent_80%)] bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[48px_48px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-cognition/12 blur-3xl" />
        <div className="absolute top-32 right-0 h-80 w-80 rounded-full bg-consciousness/10 blur-3xl" />
        <div className="absolute bottom-12 left-1/3 h-72 w-72 rounded-full bg-care/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-8 shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] backdrop-blur-xl sm:p-9">
          <div
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-brand/55 to-transparent"
            aria-hidden
          />
          {children}
        </div>
      </div>
    </div>
  );
}
