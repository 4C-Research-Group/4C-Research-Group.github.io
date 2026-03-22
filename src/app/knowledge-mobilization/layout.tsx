import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Mobilization | 4C Research Group",
  description:
    "Self-paced refresher modules for nurses and staff — topics, videos, and quizzes to support learning at the bedside.",
};

export default function KnowledgeMobilizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
