import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | 4C Research Group",
  description:
    "How the 4C Research Group collects, uses, and protects information when you use this website.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
