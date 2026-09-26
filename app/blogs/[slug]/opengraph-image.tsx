import { notFound } from "next/navigation";
import { ogSize, renderOgImage } from "@/lib/og";
import { allPosts, formatDate, getPost, readTime } from "@/lib/posts";

export const alt = "Article by Hope Tuyishime";
export const size = ogSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return renderOgImage({
    eyebrow: `Blog · ${formatDate(post.date)} · ${readTime(post)}`,
    title: post.title,
    subtitle: post.description,
  });
}
