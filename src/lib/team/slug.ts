/** URL-safe slug for team member rows (matches DB unique constraint). */
export function slugifyTeamMember(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
