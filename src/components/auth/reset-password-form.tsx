"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Circle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { friendlyAuthMessage } from "@/lib/auth/friendly-auth-message";
import {
  getSignupPasswordPolicyError,
  signupPasswordPolicyStatus,
} from "@/lib/auth/password-policy";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthCardFrame } from "./auth-card-frame";

type Phase = "working" | "form" | "bad_link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputBase =
    "w-full rounded-xl border border-border/80 bg-background/90 py-3 pl-11 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-brand/45 focus:ring-2 focus:ring-brand/20 disabled:opacity-60";
  const inputClassPassword = `${inputBase} pr-11`;
  const labelClass =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground";

  const [phase, setPhase] = useState<Phase>("working");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signupPasswordChecks = useMemo(
    () => signupPasswordPolicyStatus(password),
    [password]
  );

  const codeFromUrl = searchParams.get("code");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const supabase = getSupabaseBrowserClient();

      // Implicit flow: recovery tokens are in the URL hash; getSession parses them.
      let {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        if (typeof window !== "undefined" && window.location.hash) {
          router.replace("/auth/reset-password/");
        }
        setPhase("form");
        return;
      }

      // Same-browser PKCE (older links with ?code=): exchange if verifier exists.
      if (codeFromUrl) {
        const { error: exErr } =
          await supabase.auth.exchangeCodeForSession(codeFromUrl);
        if (cancelled) return;
        if (!exErr) {
          router.replace("/auth/reset-password/");
          if (!cancelled) setPhase("form");
          return;
        }
        setPhase("bad_link");
        setError(friendlyAuthMessage(exErr.message));
        return;
      }

      setPhase("bad_link");
      setError(null);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [router, codeFromUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const policyErr = getSignupPasswordPolicyError(password);
    if (policyErr) {
      setError(policyErr);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: upErr } = await supabase.auth.updateUser({
        password,
      });
      if (upErr) {
        setError(friendlyAuthMessage(upErr.message));
        return;
      }
      router.push("/dashboard/");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCardFrame>
      <div className="mb-8 flex flex-col items-center text-center">
        <Link
          href="/"
          className="group mb-5 flex items-center gap-2.5 rounded-2xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
        >
          <span className="relative">
            <span className="absolute -inset-1 rounded-xl bg-linear-to-br from-cognition/30 via-brand/15 to-care/25 opacity-0 blur-md transition group-hover:opacity-100" />
            <Image
              src="/logo.png"
              alt="4C Research Group"
              width={40}
              height={40}
              className="relative h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-border/80"
            />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              4C Research Group
            </span>
          </span>
        </Link>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {phase === "bad_link" ? "Link expired" : "Choose a new password"}
        </h1>
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          {phase === "bad_link"
            ? "This reset link is invalid or has expired. You can request a new one below."
            : "Use a strong password you have not used elsewhere."}
        </p>
      </div>

      {phase === "working" && (
        <div className="flex justify-center py-8">
          <Loader2
            className="h-9 w-9 animate-spin text-brand"
            aria-label="Loading"
          />
        </div>
      )}

      {phase === "bad_link" && (
        <>
          {error && (
            <div
              className="mb-5 rounded-xl border border-destructive/35 bg-destructive/[0.08] px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}
          <Link
            href="/forgot-password/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/25 transition hover:bg-brand-deep"
          >
            Request a new link
          </Link>
        </>
      )}

      {phase === "form" && (
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div
              className="rounded-xl border border-destructive/35 bg-destructive/[0.08] px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="rp-password" className={labelClass}>
              New password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                <Lock className="h-4 w-4" aria-hidden />
              </span>
              <input
                id="rp-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ chars: letter, number, symbol"
                className={inputClassPassword}
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <div role="status" aria-live="polite" aria-atomic="false">
                <ul
                  className="mt-3 list-none space-y-1.5 p-0 text-xs leading-snug"
                  aria-label="Password requirements"
                >
                  {(
                    [
                      {
                        ok: signupPasswordChecks.minLength,
                        label: "At least 8 characters",
                      },
                      {
                        ok: signupPasswordChecks.hasLetter,
                        label: "Includes a letter",
                      },
                      {
                        ok: signupPasswordChecks.hasNumber,
                        label: "Includes a number",
                      },
                      {
                        ok: signupPasswordChecks.hasSpecial,
                        label: "Includes a special character (!@#$%…)",
                      },
                    ] as const
                  ).map(({ ok, label }) => (
                    <li
                      key={label}
                      className="flex items-start gap-2"
                      aria-label={`${label}: ${ok ? "met" : "not met yet"}`}
                    >
                      <span
                        className={
                          ok
                            ? "mt-0.5 shrink-0 text-brand"
                            : "mt-0.5 shrink-0 text-muted-foreground/45"
                        }
                        aria-hidden
                      >
                        {ok ? (
                          <Check
                            className="h-3.5 w-3.5"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Circle
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        )}
                      </span>
                      <span
                        className={
                          ok ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="rp-confirm" className={labelClass}>
              Confirm new password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                <Lock className="h-4 w-4" aria-hidden />
              </span>
              <input
                id="rp-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className={inputClassPassword}
              />
              <button
                type="button"
                aria-label={
                  showConfirm ? "Hide password" : "Show password"
                }
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand via-brand to-consciousness py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/20 transition hover:opacity-[0.97] hover:shadow-lg hover:shadow-brand/25 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </button>
        </form>
      )}

      <p className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to site
        </Link>
      </p>
    </AuthCardFrame>
  );
}
