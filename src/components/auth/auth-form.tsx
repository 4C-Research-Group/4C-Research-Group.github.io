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
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAuthCallbackAbsoluteUrl } from "@/lib/site-path";

export type AuthFormMode = "login" | "signup";

export interface AuthFormProps {
  mode: AuthFormMode;
}

function friendlyAuthMessage(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("rate limit") ||
    m.includes("email rate") ||
    m.includes("too many requests")
  ) {
    return (
      "This project has sent too many auth emails for the moment (Supabase’s default mail cap). " +
      "Wait a bit and retry; for local testing turn off \"Confirm email\" under Authentication → Email; " +
      "for production add Custom SMTP under Project Settings → Auth."
    );
  }
  if (m.includes("email not confirmed")) {
    return (
      "Confirm your email first (check inbox/spam), or ask an admin to disable \"Confirm email\" for testing."
    );
  }
  return message;
}

function safeInternalNext(next: string | null): string | null {
  if (!next) return null;
  const t = next.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return null;
  return t;
}

type SignupPasswordPolicyStatus = {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

/** Sign-up only: min 8 chars, at least one letter, one number, one symbol (non–letter/digit/space). */
function signupPasswordPolicyStatus(
  password: string
): SignupPasswordPolicyStatus {
  return {
    minLength: password.length >= 8,
    hasLetter: /\p{L}/u.test(password),
    hasNumber: /\p{N}/u.test(password),
    hasSpecial: /[^\p{L}\p{N}\s]/u.test(password),
  };
}

function getSignupPasswordPolicyError(password: string): string | null {
  const s = signupPasswordPolicyStatus(password);
  if (!s.minLength) {
    return "Password must be at least 8 characters.";
  }
  if (!s.hasLetter) {
    return "Password must include at least one letter.";
  }
  if (!s.hasNumber) {
    return "Password must include at least one number.";
  }
  if (!s.hasSpecial) {
    return "Password must include at least one special character (e.g. !@#$%).";
  }
  return null;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfterAuth = safeInternalNext(searchParams.get("next"));
  const authQuery = searchParams.toString();
  const signupHref = authQuery ? `/signup/?${authQuery}` : "/signup/";
  const loginHref = authQuery ? `/login/?${authQuery}` : "/login/";
  const isLogin = mode === "login";

  const inputBase =
    "w-full rounded-xl border border-border/80 bg-background/90 py-3 pl-11 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-brand/45 focus:ring-2 focus:ring-brand/20 disabled:opacity-60";
  const inputClassEmail = `${inputBase} pr-4`;
  const inputClassPassword = `${inputBase} pr-11`;
  const labelClass =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signupPasswordChecks = useMemo(
    () => signupPasswordPolicyStatus(password),
    [password]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!alive || !user) return;
        router.replace(nextAfterAuth ?? "/dashboard/");
        router.refresh();
      } catch {
        /* ignore */
      }
    })();
    return () => {
      alive = false;
    };
  }, [router, nextAfterAuth]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signErr) {
        setError(friendlyAuthMessage(signErr.message));
        return;
      }
      router.push(nextAfterAuth ?? "/dashboard/");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
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
      const redirectTo = getAuthCallbackAbsoluteUrl();
      const { data, error: signErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (signErr) {
        setError(friendlyAuthMessage(signErr.message));
        return;
      }

      if (data.user) {
        const { error: insertErr } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email ?? null,
          name: email.trim().split("@")[0],
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (insertErr && insertErr.code !== "23505") {
          console.warn(
            "[auth] public.users insert skipped:",
            insertErr.code,
            insertErr.message
          );
        }
      }

      if (data.session) {
        setInfo("Account ready. Redirecting…");
        router.push(nextAfterAuth ?? "/dashboard/");
        router.refresh();
        return;
      }

      setInfo(
        "Check your email to confirm your account, then you can sign in."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-up failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

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
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              {isLogin
                ? "Sign in with your email and password to continue."
                : "Join the site to save progress and take part in the community."}
            </p>
          </div>

          {error && (
            <div
              className="mb-5 rounded-xl border border-destructive/35 bg-destructive/[0.08] px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}
          {info && (
            <div className="mb-5 rounded-xl border border-brand/30 bg-brand/[0.08] px-4 py-3 text-sm text-foreground">
              {info}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={onLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClassEmail}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Lock className="h-4 w-4" aria-hidden />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/25 transition hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/20 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </button>
            </form>
          ) : (
            <form onSubmit={onSignup} className="space-y-5">
              <div>
                <label htmlFor="su-email" className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClassEmail}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="su-password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Lock className="h-4 w-4" aria-hidden />
                  </span>
                  <input
                    id="su-password"
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
                              ok
                                ? "text-foreground"
                                : "text-muted-foreground"
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
                <label htmlFor="su-confirm" className={labelClass}>
                  Confirm password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Lock className="h-4 w-4" aria-hidden />
                  </span>
                  <input
                    id="su-confirm"
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
                Create account
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Need an account?{" "}
                <Link
                  href={signupHref}
                  className="font-semibold text-brand underline decoration-brand/25 underline-offset-4 transition hover:decoration-brand/50"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href={loginHref}
                  className="font-semibold text-brand underline decoration-brand/25 underline-offset-4 transition hover:decoration-brand/50"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>

          <p className="mt-5 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
