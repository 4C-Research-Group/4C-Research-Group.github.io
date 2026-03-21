import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications | 4C Research Group",
  description:
    "Research publications from the 4C Research Group, synced from ORCID.",
};

export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
