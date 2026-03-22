import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate | Knowledge Mobilization",
  description:
    "Download or print your certificate after completing all Knowledge Mobilization modules.",
};

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
