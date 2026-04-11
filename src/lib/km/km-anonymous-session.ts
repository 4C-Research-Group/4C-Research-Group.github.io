import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Creates a persistent Supabase session without email/password so KM progress
 * can sync to `km_user_progress` like a signed-in user.
 * Requires "Anonymous sign-ins" enabled in Supabase Auth → Providers.
 */
export async function signInAnonymouslyForKm(): Promise<{
  ok: true;
  userId: string;
} | { ok: false; message: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.signInAnonymously();
    if (error) {
      return {
        ok: false,
        message:
          error.message ||
          "Could not start a learner session. You can still use modules on this device only.",
      };
    }
    const uid = session?.user?.id;
    if (!uid) {
      return { ok: false, message: "No user id returned from anonymous sign-in." };
    }
    return { ok: true, userId: uid };
  } catch (e) {
    return {
      ok: false,
      message:
        e instanceof Error ? e.message : "Anonymous sign-in failed unexpectedly.",
    };
  }
}
