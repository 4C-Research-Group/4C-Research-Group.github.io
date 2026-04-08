export type AppRole = "user" | "admin" | "superuser";

export function normalizeRole(value: string | null | undefined): AppRole {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (v === "superuser" || v === "admin") return v;
  return "user";
}

export function canAccessAdmin(role: AppRole): boolean {
  return role === "admin" || role === "superuser";
}

export function canManageUsers(role: AppRole): boolean {
  return role === "superuser";
}
