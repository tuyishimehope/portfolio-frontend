import type { Metadata } from "next";
import { PageHeader, PostList, container } from "@/components/site";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";

const description = "Notes by Hope Tuyishime on building backend systems that keep working: APIs, GIS data, asynchronous jobs and honest failure handling.";

export const metadata: Metadata = {
  title: "Blogs — Hope Tuyishime",
  description,
  alternates: { canonical: "/blogs" },
  openGraph: { title: "Blogs — Hope Tuyishime", description, url: "/blogs" },
};

export default function WritingPage() {
  // No dead ends: the blog stays hidden (404, unlinked) until the first real post exists.
  if (posts.length === 0) notFound();
  return (
    <main id="top">
      <PageHeader
        label="Blogs"
        title="Notes on building systems that last."
        intro="How I design and build backend systems: the decisions, the trade-offs, and what I’d do differently."
      />
      <section className={`${container} pb-24 md:pb-40`}>
        <PostList />
      </section>
    </main>
  );
}
