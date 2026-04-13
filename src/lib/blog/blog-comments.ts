import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type BlogComment = {
  id: string;
  post_id: string;
  parent_id: string | null;
  user_id: string;
  author_display_name: string;
  body: string;
  created_at: string;
};

export async function fetchCommentsForPost(
  postId: string,
): Promise<BlogComment[]> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blog_post_comments")
      .select(
        "id, post_id, parent_id, user_id, author_display_name, body, created_at",
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) {
      console.warn("[blog comments]", error.message);
      return [];
    }
    return (data ?? []) as BlogComment[];
  } catch {
    return [];
  }
}
