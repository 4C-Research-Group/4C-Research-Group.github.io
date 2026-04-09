/** Static hosting: one HTML page loads any post by slug from Supabase. */
export function blogPostHref(slug: string): string {
  return `/blog/view/?slug=${encodeURIComponent(slug)}`;
}
