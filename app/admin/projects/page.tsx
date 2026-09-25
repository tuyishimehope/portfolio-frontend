import type { Metadata } from "next";
import ContentManager from "@/components/admin/content-manager";
export const metadata: Metadata = { title: "Projects" };
export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const params = await searchParams;
  return <ContentManager kind="projects" create={params.new === "1"} />;
}
