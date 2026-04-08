import type { JoinTestimonial } from "@/data/join-testimonials";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { resolveTeamMemberDisplayPhotoUrl } from "@/lib/team/photo-url";

export type MemberTestimonialDraft = {
  quote: string;
  testimonial_bio: string;
  education: string;
};

type TeamMemberEmbed = {
  slug: string;
  name: string;
  role_title: string;
  photo_file: string;
};

type TestimonialJoinRow = {
  id: string;
  quote: string;
  testimonial_bio: string;
  education: string;
  team_members: TeamMemberEmbed | TeamMemberEmbed[] | null;
};

function embedMember(
  raw: TeamMemberEmbed | TeamMemberEmbed[] | null,
): TeamMemberEmbed | null {
  if (!raw) return null;
  return Array.isArray(raw) ? (raw[0] ?? null) : raw;
}

function rowToJoinTestimonial(r: TestimonialJoinRow): JoinTestimonial | null {
  const m = embedMember(r.team_members);
  if (!m) return null;
  const photo = resolveTeamMemberDisplayPhotoUrl(m.photo_file, m.slug).trim();
  return {
    id: `db-${r.id}`,
    name: m.name,
    role: m.role_title,
    quote: r.quote,
    bio: r.testimonial_bio,
    education: r.education,
    ...(photo ? { imageSrc: photo } : {}),
  };
}

/** Published testimonials for the Join 4C Lab page (anon-readable). */
export async function fetchJoinPageTestimonialsFromSupabase(): Promise<
  JoinTestimonial[]
> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("team_member_testimonials")
      .select(
        `
        id,
        quote,
        testimonial_bio,
        education,
        team_members ( slug, name, role_title, photo_file )
      `,
      )
      .order("updated_at", { ascending: false });
    if (error) {
      console.warn("[testimonials]", error.message);
      return [];
    }
    const rows = (data ?? []) as TestimonialJoinRow[];
    return rows
      .map(rowToJoinTestimonial)
      .filter((x): x is JoinTestimonial => x != null);
  } catch {
    return [];
  }
}

/** Current saved testimonial for this team member (for the profile editor). */
export async function fetchTestimonialByTeamMemberId(
  teamMemberId: string,
): Promise<MemberTestimonialDraft | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("team_member_testimonials")
      .select("quote, testimonial_bio, education")
      .eq("team_member_id", teamMemberId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      quote: data.quote ?? "",
      testimonial_bio: data.testimonial_bio ?? "",
      education: data.education ?? "",
    };
  } catch {
    return null;
  }
}

export async function upsertMemberTestimonial(
  teamMemberId: string,
  draft: MemberTestimonialDraft,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const quote = draft.quote.trim();
    const testimonial_bio = draft.testimonial_bio.trim();
    const education = draft.education.trim();
    if (!quote || !testimonial_bio || !education) {
      return { ok: false, message: "Please fill in all fields." };
    }
    const { error } = await supabase.from("team_member_testimonials").upsert(
      {
        team_member_id: teamMemberId,
        quote,
        testimonial_bio,
        education,
      },
      { onConflict: "team_member_id" },
    );
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Save failed",
    };
  }
}
