"use client";

import SuperuserGate from "@/components/admin/SuperuserGate";
import SuperuserUsersTable from "@/components/admin/SuperuserUsersTable";

export default function AdminUsersPage() {
  return (
    <SuperuserGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users & roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Superusers can change any account’s role here. Pick a role, then
            save each row — changes are not applied until you click{" "}
            <span className="font-medium text-foreground">Save</span>.
          </p>
        </div>
        <SuperuserUsersTable />
      </div>
    </SuperuserGate>
  );
}
