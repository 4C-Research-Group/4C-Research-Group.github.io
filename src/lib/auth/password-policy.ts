export type SignupPasswordPolicyStatus = {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

/** Min 8 chars, at least one letter, one number, one symbol (non–letter/digit/space). */
export function signupPasswordPolicyStatus(
  password: string
): SignupPasswordPolicyStatus {
  return {
    minLength: password.length >= 8,
    hasLetter: /\p{L}/u.test(password),
    hasNumber: /\p{N}/u.test(password),
    hasSpecial: /[^\p{L}\p{N}\s]/u.test(password),
  };
}

export function getSignupPasswordPolicyError(password: string): string | null {
  const s = signupPasswordPolicyStatus(password);
  if (!s.minLength) {
    return "Password must be at least 8 characters.";
  }
  if (!s.hasLetter) {
    return "Password must include at least one letter.";
  }
  if (!s.hasNumber) {
    return "Password must include at least one number.";
  }
  if (!s.hasSpecial) {
    return "Password must include at least one special character (e.g. !@#$%).";
  }
  return null;
}
