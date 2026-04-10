"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquareQuote, Save } from "lucide-react";
import {
  fetchTestimonialByTeamMemberId,
  upsertMemberTestimonial,
} from "@/lib/team/supabase-testimonials";

type Props = {
  teamMemberId: string;
};

export default function MemberTestimonialForm({ teamMemberId }: Props) {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const row = await fetchTestimonialByTeamMemberId(teamMemberId);
    if (row) {
      setQuote(row.quote);
    } else {
      setQuote("");
    }
    setLoading(false);
  }, [teamMemberId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const res = await upsertMemberTestimonial(teamMemberId, { quote });
    setSaving(false);
    if (res.ok) {
      setMessage("Saved. Your testimonial appears on the Join 4C Lab page.");
      void load();
    } else {
      setError(res.message);
    }
  }

  return (
    <section className="mt-12 rounded-2xl border border-border/70 bg-card/60 p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-consciousness/15 text-consciousness">
          <MessageSquareQuote className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Student testimonial
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your quote appears on the Join 4C Lab page. Your name, role, and
            photo come from this profile.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading…
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="tm-quote"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Quote
            </label>
            <textarea
              id="tm-quote"
              required
              rows={6}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="Your experience in the lab…"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-sm text-care font-medium" role="status">
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-deep disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Save className="h-4 w-4" aria-hidden />
              )}
              {saving ? "Saving…" : "Save testimonial"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
