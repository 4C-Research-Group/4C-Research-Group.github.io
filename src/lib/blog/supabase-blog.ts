import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { tagsFromJson } from "@/lib/blog/parse-tags";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  read_time: string;
  image_url: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  author_name: string;
  author_role: string;
  author_image_url: string;
  author_user_id: string | null;
};

type Row = Database["public"]["Tables"]["blog_posts"]["Row"];

function rowToPost(row: Row): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    created_at: row.created_at,
    updated_at: row.updated_at,
    read_time: row.read_time,
    image_url: row.image_url,
    tags: tagsFromJson(row.tags),
    featured: row.featured,
    published: row.published,
    author_name: row.author_name,
    author_role: row.author_role,
    author_image_url: row.author_image_url,
    author_user_id: row.author_user_id ?? null,
  };
}

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[blog]", error.message);
      return [];
    }
    return (data ?? []).map((r) => rowToPost(r));
  } catch {
    return [];
  }
}

export async function fetchBlogPostBySlugPublic(
  slug: string,
): Promise<BlogPost | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.warn("[blog]", error.message);
      return null;
    }
    if (!data) return null;
    return rowToPost(data);
  } catch {
    return null;
  }
}

export async function fetchAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToPost(r));
}

export async function fetchBlogPostByIdForAdmin(
  id: string,
): Promise<BlogPost | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToPost(data);
}

export function uniqueCategories(posts: BlogPost[]): string[] {
  return [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
}
