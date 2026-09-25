import type { Metadata } from "next";
import { PageHeader, PostList, container } from "@/components/ui";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Blogs — Hope Tuyishime" };

export default function WritingPage() {
  return (
    <main id="top">
      <PageHeader label="Blogs" title="Notes on building systems that last." />
      <section className={`${container} pb-24 md:pb-40`}>
        {posts.length > 0 ? (
          <PostList />
        ) : (
          <p className="text-muted">First posts are in progress.</p>
        )}
      </section>
    </main>
  );
}
