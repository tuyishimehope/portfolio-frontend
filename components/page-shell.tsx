"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function PageShell({ children, header, footer }: { children: ReactNode; header: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/signup" || pathname === "/reset-password";
  return <>{!isAuth && header}{children}{!isAuth && footer}</>;
}
