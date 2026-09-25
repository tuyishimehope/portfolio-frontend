import type { Metadata } from "next";
import { PageHeader, PostList, container } from "@/components/site";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Blogs — Hope Tuyishime" };

export default function WritingPage() {
  // No dead ends: the blog stays hidden (404, unlinked) until the first real post exists.
  if (posts.length === 0) notFound();
  return (
    <main id="top">
      <PageHeader label="Blogs" title="Notes on building systems that last." />
      <section className={`${container} pb-24 md:pb-40`}>
        <PostList />
      </section>
    </main>
  );
}
