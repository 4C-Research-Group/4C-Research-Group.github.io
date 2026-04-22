export function friendlyAuthMessage(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("rate limit") ||
    m.includes("email rate") ||
    m.includes("too many requests")
  ) {
    return (
      "This project has sent too many auth emails for the moment (Supabase’s default mail cap). " +
      "Wait a bit and retry; for local testing turn off \"Confirm email\" under Authentication → Email; " +
      "for production add Custom SMTP under Project Settings → Auth."
    );
  }
  if (m.includes("email not confirmed")) {
    return (
      "Confirm your email first (check inbox/spam), or ask an admin to disable \"Confirm email\" for testing."
    );
  }
  return message;
}
