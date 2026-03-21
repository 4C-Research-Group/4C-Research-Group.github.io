import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join 4C Lab | 4C Research Group",
  description:
    "Interested in joining the 4C Research Group? Learn how to apply and hear from students who trained with us.",
};

export default function Join4CLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
