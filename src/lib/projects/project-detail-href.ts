/** Works for static export (GitHub Pages): one HTML page + query avoids 404 for new slugs. */
export function projectDetailHref(slug: string): string {
  return `/projects/view/?id=${encodeURIComponent(slug)}`;
}
