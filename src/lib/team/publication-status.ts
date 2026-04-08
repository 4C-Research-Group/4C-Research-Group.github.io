export const TEAM_PUBLICATION_STATUSES = [
  "in_preparation",
  "submitted",
  "under_review",
  "accepted",
  "published",
  "other",
] as const;

export type TeamPublicationStatus = (typeof TEAM_PUBLICATION_STATUSES)[number];

export function normalizePublicationStatus(
  raw: string | null | undefined,
): TeamPublicationStatus {
  const s = (raw ?? "").trim();
  if (
    TEAM_PUBLICATION_STATUSES.includes(s as TeamPublicationStatus)
  ) {
    return s as TeamPublicationStatus;
  }
  return "other";
}

export const publicationStatusLabel: Record<TeamPublicationStatus, string> = {
  in_preparation: "In preparation",
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted / in press",
  published: "Published",
  other: "Other",
};
