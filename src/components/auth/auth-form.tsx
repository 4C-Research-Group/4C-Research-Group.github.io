"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
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

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfterAuth = safeInternalNext(searchParams.get("next"));
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 left-8 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-40 right-12 h-72 w-72 rounded-full bg-consciousness/10 blur-3xl" />
        <div className="absolute bottom-16 left-1/4 h-64 w-64 rounded-full bg-care/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card/90 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="bg-linear-to-r from-brand via-consciousness to-care bg-clip-text text-3xl font-bold text-transparent">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Sign in with your email and password"
                : "Join the 4C Research Lab site"}
            </p>
          </div>

          {error && (
            <div
              className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-foreground">
              {info}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={onLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </button>
            </form>
          ) : (
            <form onSubmit={onSignup} className="space-y-5">
              <div>
                <label
                  htmlFor="su-email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="su-password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="su-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

              <div>
                <label
                  htmlFor="su-confirm"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="su-confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-brand to-consciousness py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create account
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Need an account?{" "}
                <Link
                  href="/signup/"
                  className="font-medium text-brand hover:underline"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/login/"
                  className="font-medium text-brand hover:underline"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>

          <p className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-brand"
            >
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
