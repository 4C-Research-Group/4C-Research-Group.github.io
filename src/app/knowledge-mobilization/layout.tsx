import type { Metadata } from "next";
import { KmProgressProvider } from "@/contexts/KmProgressContext";
import KmRouteGuard from "@/components/knowledge-mobilization/KmRouteGuard";

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
  return (
    <KmProgressProvider>
      <KmRouteGuard>{children}</KmRouteGuard>
    </KmProgressProvider>
  );
}
