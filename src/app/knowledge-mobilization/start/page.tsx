"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Loader2 } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { mergeKmPagePayload } from "@/data/km-page-defaults";
import { fetchKmPageContent } from "@/lib/km/supabase-km-page";
import type { KmPagePayload } from "@/data/km-page";
import { signInAnonymouslyForKm } from "@/lib/km/km-anonymous-session";
import {
  isKmLearnerRegistrationComplete,
  saveKmLearnerRegistration,
} from "@/lib/km/km-learner-registration";

export default function KnowledgeMobilizationStartPage() {
  const router = useRouter();
  const { ready: authReady, userId, email: authEmail } = useAuthProfile();
  const [page, setPage] = useState<KmPagePayload>(() => mergeKmPagePayload(null));
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);

  useEffect(() => {
    void fetchKmPageContent().then(setPage);
  }, []);

  useEffect(() => {
    if (authEmail) setEmail((e) => e || authEmail);
  }, [authEmail]);

  useEffect(() => {
    if (isKmLearnerRegistrationComplete()) {
      router.replace("/knowledge-mobilization/");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setWarn(null);

    let fn = firstName.trim();
    let ln = lastName.trim();
    const em = email.trim().toLowerCase();
    const full = fullName.trim();

    if (full && (!fn || !ln)) {
      const parts = full.split(/\s+/);
      fn = parts[0] ?? "";
      ln = parts.slice(1).join(" ") || "—";
    }

    if (!fn || !em) {
      setError("Please enter your name and a valid email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email address.");
      return;
    }

    setBusy(true);
    try {
      saveKmLearnerRegistration({ firstName: fn, lastName: ln || "—", email: em });

      if (!userId) {
        const anon = await signInAnonymouslyForKm();
        if (!anon.ok) {
          setWarn(anon.message);
        }
      }

      router.replace("/knowledge-mobilization/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-brand" aria-hidden />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/30">
        <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
        <div className="container relative mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <GraduationCap className="h-4 w-4" aria-hidden />
              {page.heroBadge}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                {page.startPageTitle}
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {page.startPageIntro}
            </p>

            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div>
                <label className="block text-xs font-medium text-muted-foreground">
                  {page.startFullNameLabel}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(ev) => setFullName(ev.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Jordan Lee"
                  autoComplete="name"
                  disabled={busy}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {page.startUseSeparateNamesHint}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(ev) => setFirstName(ev.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    autoComplete="given-name"
                    disabled={busy}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(ev) => setLastName(ev.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    autoComplete="family-name"
                    disabled={busy}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  autoComplete="email"
                  disabled={busy}
                />
              </div>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              {warn ? (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-950 dark:text-amber-100">
                  {warn}
                </p>
              ) : null}

              <p className="text-xs leading-relaxed text-muted-foreground">
                {page.startPrivacyNote}
              </p>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-deep disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                {page.startSubmitLabel}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Already registered on this device?{" "}
              <Link href="/knowledge-mobilization/" className="font-medium text-brand hover:underline">
                Go to modules
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
