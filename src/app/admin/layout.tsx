import type { Metadata } from "next";
import AdminGate from "@/components/admin/AdminGate";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Dashboard | 4C Research Group",
  description: "Manage site content, team, and accounts",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
