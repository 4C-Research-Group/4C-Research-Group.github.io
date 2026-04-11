/** Browser registration for KM (name + email) before modules; pairs with optional anonymous Supabase auth. */

export type KmLearnerRegistration = {
  firstName: string;
  lastName: string;
  email: string;
  completedAt: string;
};

const STORAGE_KEY = "4c-km-learner-registration-v1";

export function loadKmLearnerRegistration(): KmLearnerRegistration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<KmLearnerRegistration>;
    if (
      typeof o.firstName !== "string" ||
      typeof o.lastName !== "string" ||
      typeof o.email !== "string" ||
      typeof o.completedAt !== "string"
    ) {
      return null;
    }
    const firstName = o.firstName.trim();
    const lastName = o.lastName.trim();
    const email = o.email.trim().toLowerCase();
    if (!firstName || !email) return null;
    return {
      firstName,
      lastName,
      email,
      completedAt: o.completedAt,
    };
  } catch {
    return null;
  }
}

export function saveKmLearnerRegistration(
  data: Omit<KmLearnerRegistration, "completedAt">,
): KmLearnerRegistration {
  const row: KmLearnerRegistration = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    completedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(row));
  }
  return row;
}

export function clearKmLearnerRegistration(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isKmLearnerRegistrationComplete(): boolean {
  return loadKmLearnerRegistration() !== null;
}
