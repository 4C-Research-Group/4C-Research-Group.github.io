import type { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign up | 4C Research Group",
  description: "Create a 4C Research Group account",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
