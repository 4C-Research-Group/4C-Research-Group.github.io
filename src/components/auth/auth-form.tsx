"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Circle,
  KeyRound,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { friendlyAuthMessage } from "@/lib/auth/friendly-auth-message";
import {
  getSignupPasswordPolicyError,
  signupPasswordPolicyStatus,
} from "@/lib/auth/password-policy";
import { getAuthCallbackAbsoluteUrl } from "@/lib/site-path";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthCardFrame } from "./auth-card-frame";

export type AuthFormMode = "login" | "signup";

export interface AuthFormProps {
  mode: AuthFormMode;
}

function safeInternalNext(next: string | null): string | null {
  if (!next) return null;
  const t = next.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return null;
  return t;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfterAuth = safeInternalNext(searchParams.get("next"));
  const authQuery = searchParams.toString();
  const signupHref = authQuery ? `/signup/?${authQuery}` : "/signup/";
  const loginHref = authQuery ? `/login/?${authQuery}` : "/login/";
  const forgotHref = authQuery
    ? `/forgot-password/?${authQuery}`
    : "/forgot-password/";
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
  const [showOtpSignIn, setShowOtpSignIn] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  function openOtpSignIn() {
    setShowOtpSignIn(true);
    setError(null);
    setInfo(null);
    setOtpCode("");
    setOtpSent(false);
  }

  function closeOtpSignIn() {
    setShowOtpSignIn(false);
    setError(null);
    setInfo(null);
    setOtpCode("");
    setOtpSent(false);
  }

  async function sendEmailOtpRequest(): Promise<void> {
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        },
      });
      if (otpErr) {
        setError(friendlyAuthMessage(otpErr.message));
        return;
      }
      setOtpSent(true);
      setOtpCode("");
      setInfo(
        "Check your email for a one-time code, then enter it below. The message may take a minute and can land in spam."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send code.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    await sendEmailOtpRequest();
  }

  async function onVerifyEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    const token = otpCode.replace(/\s/g, "");
    if (token.length < 6) {
      setError("Enter the full code from your email (usually 6 digits).");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: verErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "email",
      });
      if (verErr) {
        setError(friendlyAuthMessage(verErr.message));
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
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              {isLogin
                ? showOtpSignIn
                  ? "We will email you a one-time code. Use an account that already exists on this site."
                  : "Sign in with your email and password to continue."
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
            <div className="space-y-5">
              {showOtpSignIn ? (
                <form
                  onSubmit={otpSent ? onVerifyEmailOtp : onSendEmailOtp}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={closeOtpSignIn}
                      className="cursor-pointer text-xs font-semibold text-brand underline decoration-brand/25 underline-offset-4 transition hover:decoration-brand/50"
                    >
                      Back to password sign-in
                    </button>
                  </div>
                  <div>
                    <label htmlFor="otp-email" className={labelClass}>
                      Email
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                        <Mail className="h-4 w-4" aria-hidden />
                      </span>
                      <input
                        id="otp-email"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading || otpSent}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClassEmail}
                      />
                    </div>
                  </div>

                  {otpSent ? (
                    <>
                      <div>
                        <label htmlFor="otp-code" className={labelClass}>
                          One-time code
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                            <KeyRound className="h-4 w-4" aria-hidden />
                          </span>
                          <input
                            id="otp-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            disabled={isLoading}
                            value={otpCode}
                            onChange={(e) =>
                              setOtpCode(e.target.value.replace(/\s/g, ""))
                            }
                            placeholder="123456"
                            maxLength={12}
                            className={inputClassEmail}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/25 transition hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/20 disabled:opacity-60"
                      >
                        {isLoading && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Verify and sign in
                      </button>
                      <p className="text-center text-xs text-muted-foreground">
                        Wrong email?{" "}
                        <button
                          type="button"
                          className="font-semibold text-brand underline decoration-brand/25 underline-offset-4 hover:decoration-brand/50"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                            setInfo(null);
                            setError(null);
                          }}
                        >
                          Start over
                        </button>
                        {" · "}
                        <button
                          type="button"
                          className="font-semibold text-brand underline decoration-brand/25 underline-offset-4 hover:decoration-brand/50"
                          disabled={isLoading}
                          onClick={() => {
                            void sendEmailOtpRequest();
                          }}
                        >
                          Resend code
                        </button>
                      </p>
                    </>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand via-brand to-consciousness py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/20 transition hover:opacity-[0.97] hover:shadow-lg hover:shadow-brand/25 disabled:opacity-60"
                    >
                      {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Send code
                    </button>
                  )}
                </form>
              ) : (
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
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <Link
                        href={forgotHref}
                        className="text-xs font-semibold text-brand underline decoration-brand/25 underline-offset-4 transition hover:decoration-brand/50"
                      >
                        Forgot password?
                      </Link>
                      <button
                        type="button"
                        onClick={openOtpSignIn}
                        className="cursor-pointer text-xs font-semibold text-brand underline decoration-brand/25 underline-offset-4 transition hover:decoration-brand/50"
                      >
                        Get a one-time code to sign in
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
              )}
            </div>
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
    </AuthCardFrame>
  );
}
