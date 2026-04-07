export type AppRole = "user" | "admin" | "superuser";

export function normalizeRole(value: string | null | undefined): AppRole {
  if (value === "superuser" || value === "admin") return value;
  return "user";
}

export function canAccessAdmin(role: AppRole): boolean {
  return role === "admin" || role === "superuser";
}

export function canManageUsers(role: AppRole): boolean {
  return role === "superuser";
}
