import type { Metadata } from "next";
import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Admin | 4C Research Group",
  description: "Manage site content, team, and users",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <div className="min-h-screen bg-muted/15">
        <div className="sticky top-14 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
            <Link
              href="/admin/"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              Admin
            </Link>
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              View site →
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </AdminGate>
  );
}
