import type { Metadata } from "next";
import ContentManager from "@/components/admin/content-manager";
export const metadata: Metadata = { title: "Writing" };
export default async function PostsPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const params = await searchParams;
  return <ContentManager kind="posts" create={params.new === "1"} />;
}
