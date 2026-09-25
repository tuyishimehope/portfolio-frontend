"use client";

import { useMemo, useSyncExternalStore } from "react";
import { projects, site } from "@/lib/content";

export type Entry = { id: string; title: string; slug: string; summary: string; body: string; status: "draft" | "published"; updated: string; role: string; stack: string; year: string };
export type Message = { id: string; name: string; email: string; subject: string; body: string; date: string; read: boolean; archived: boolean };
export type AdminData = { projects: Entry[]; posts: Entry[]; messages: Message[]; profile: { name: string; email: string; location: string; linkedin: string; github: string; resume: string; bio: string } };
const initial: AdminData = {
  projects: projects.map(p => ({ id: p.slug, title: p.title, slug: p.slug, summary: p.problem, body: p.caseStudy.map(s => `${s.heading}\n${s.body}`).join("\n\n"), status: "published", updated: "", role: p.role, stack: p.stack.join(", "), year: p.year ?? "" })),
  posts: [], messages: [], profile: { ...site, bio: "Backend engineer in Kigali building reliable systems for real-world problems. Open to relocation." },
};
const key = "hope-admin-preview-v1";
const initialSnapshot = JSON.stringify(initial);
function snapshot() { try { return localStorage.getItem(key) || initialSnapshot; } catch { return initialSnapshot; } }
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("admin-data", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("admin-data", callback); };
}
function parse(raw: string): AdminData {
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.projects) && Array.isArray(data.posts) && Array.isArray(data.messages) && data.profile) return data;
  } catch { /* Recover the original content if browser data is damaged. */ }
  return initial;
}
export function useAdminData() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => initialSnapshot);
  return useMemo(() => parse(raw), [raw]);
}
export function updateAdminData(change: (data: AdminData) => AdminData) {
  try {
    localStorage.setItem(key, JSON.stringify(change(parse(snapshot()))));
    window.dispatchEvent(new Event("admin-data"));
    return true;
  } catch { return false; }
}
export function newEntry(): Entry {
  return { id: crypto.randomUUID(), title: "", slug: "", summary: "", body: "", status: "draft", updated: "", role: "", stack: "", year: String(new Date().getFullYear()) };
}
export const sampleMessages: Message[] = [
  { id: "sample-1", name: "Alex Morgan", email: "alex@example.com", subject: "A backend project to explore", body: "Hi Hope,\n\nThis is a sample message showing how a project inquiry will appear in your inbox. Once your backend is connected, contact form submissions will appear here.\n\nThanks,\nAlex", date: "2026-09-25", read: false, archived: false },
  { id: "sample-2", name: "Sam Rivera", email: "sam@example.com", subject: "Enjoyed your portfolio", body: "Hi Hope,\n\nThis is a sample networking message. Use the read and archive controls to try out the inbox. No real visitor data is included.", date: "2026-09-24", read: true, archived: false },
];
