import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/shell";

export const metadata: Metadata = { title: { default: "Dashboard — Hope Studio", template: "%s — Hope Studio" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Fail closed until server-side authentication and owner authorization are integrated.
  // Never replace this with a localStorage flag or a client-only route guard.
  if (process.env.NODE_ENV !== "development") notFound();
  return <AdminShell>{children}</AdminShell>;
}
