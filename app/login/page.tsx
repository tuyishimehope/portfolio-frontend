import type { Metadata } from "next";
import AuthPage from "@/components/auth-page";

export const metadata: Metadata = { title: "Sign in — Hope Tuyishime", robots: { index: false, follow: false } };

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
