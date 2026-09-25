import type { Metadata } from "next";
import AuthPage from "@/components/auth-page";

export const metadata: Metadata = { title: "Create account — Hope Tuyishime", robots: { index: false, follow: false } };

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
