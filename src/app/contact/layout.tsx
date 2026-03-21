import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | 4C Research Group",
  description:
    "Contact the 4C Research Group at Children's Hospital - London Health Sciences Centre.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
