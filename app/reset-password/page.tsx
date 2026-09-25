import type { Metadata } from "next";
import AuthPage from "@/components/auth-page";

export const metadata: Metadata = { title: "Reset password — Hope Tuyishime", robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return <AuthPage mode="reset" />;
}
