import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | 4C Research Group",
  description: "Your 4C Research Group account",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
