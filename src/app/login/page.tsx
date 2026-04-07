import type { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in | 4C Research Group",
  description: "Sign in to your 4C Research Group account",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
