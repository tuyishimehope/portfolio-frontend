"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, FileText, FolderKanban, LayoutDashboard, Layers, Mail, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { useAdminData } from "./store";

const navigation = [
  { href: "/admin", name: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", name: "Projects", icon: FolderKanban },
  { href: "/admin/posts", name: "Writing", icon: FileText },
  { href: "/admin/messages", name: "Messages", icon: Mail },
  { href: "/admin/settings", name: "Settings", icon: Settings },
];
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const data = useAdminData();
  const unread = data.messages.filter(m => !m.read && !m.archived).length;
  const current = navigation.find(n => n.href === pathname)?.name || "Workspace";
  return (
    <div className="admin-app min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card px-5 py-8 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-3 text-xl font-semibold tracking-tight"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Layers className="size-5" /></span>Hope Studio</Link>
        <p className="mb-3 mt-12 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Manage your space</p>
        <nav aria-label="Admin navigation" className="space-y-1">{navigation.map(({ href, name, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`admin-nav ${pathname === href ? "admin-nav-active" : ""}`}><Icon className="size-[18px]" />{name}{name === "Messages" && unread > 0 && <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{unread}</span>}</Link>)}</nav>
        <div className="mt-auto rounded-2xl border bg-background p-4"><p className="text-sm font-medium">Your public portfolio</p><p className="mt-2 text-xs leading-relaxed text-body">See your work as the world sees it.</p><Link href="/" className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">View portfolio <ArrowUpRight className="size-3.5" /></Link></div>
        <div className="mt-5 flex items-center gap-3 px-2"><span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">HT</span><div><p className="text-sm font-medium">Hope Tuyishime</p><p className="text-xs text-muted-foreground">Development workspace</p></div></div>
      </aside>
      <div className="lg:pl-60">
        <header className="flex h-20 items-center justify-between gap-4 border-b bg-card px-5 sm:px-9"><div className="flex items-center gap-3"><button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-admin-nav" className="admin-icon lg:hidden">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button><p className="text-sm text-body">Workspace <span className="mx-3 text-muted-foreground/50">/</span><span className="font-medium text-foreground">{current}</span></p></div><Link href="/" className="flex items-center gap-2 text-xs text-body hover:text-primary">View site <ArrowUpRight className="size-4" /></Link></header>
        {open && <nav id="mobile-admin-nav" aria-label="Mobile admin navigation" className="grid gap-1 border-b bg-card p-4 lg:hidden">{navigation.map(({ href, name }) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined} className={`admin-nav ${pathname === href ? "admin-nav-active" : ""}`}>{name}</Link>)}</nav>}
        <div className="border-b border-primary/10 bg-primary/5 px-5 py-3 text-xs leading-relaxed text-body sm:px-9"><span className="font-semibold text-primary">Development preview</span><span className="mx-2">·</span>Edits stay in this browser. Publishing and visitor messages aren’t connected. Production access is blocked until owner authentication is added.</div>
        <main id="top" className="mx-auto max-w-[1480px] px-5 py-8 sm:px-9 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
