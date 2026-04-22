import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Browser-only Supabase client.
 *
 * Uses implicit auth flow (not PKCE) so email links (signup confirm, password
 * reset) work when opened from mail on another device or browser. PKCE
 * requires the code verifier stored where `resetPasswordForEmail` ran;
 * `@supabase/ssr`’s createBrowserClient also forces PKCE, which breaks that.
 *
 * Session is stored in `localStorage` (default when `storage` is set).
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error(
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY to .env.local"
    );
  }
  if (!browserClient) {
    const isBrowser = typeof window !== "undefined";
    browserClient = createClient<Database>(url, key, {
      auth: {
        flowType: "implicit",
        detectSessionInUrl: isBrowser,
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        ...(isBrowser ? { storage: window.localStorage } : {}),
      },
    });
  }
  return browserClient;
}
