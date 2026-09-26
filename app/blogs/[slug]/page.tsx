import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostBody from "@/components/post-body";
import ReadTracker from "@/components/read-tracker";
import { BackLink, after, container, enter } from "@/components/site";
import { cn } from "@/lib/utils";
import { projects, site } from "@/lib/content";
import { allPosts, formatDate, getPost, readTime } from "@/lib/posts";

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return { title: "Post" };
  const title = `${post.title} — Hope Tuyishime`;
  return {
    title,
    description: post.description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description: post.description,
      url: `/blogs/${post.slug}`,
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description: post.description },
  };
}

export default async function PostPage(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();
  const project = projects.find((p) => p.slug === post.project);
  const toc = post.blocks.flatMap((b) => (b.type === "h2" ? [{ id: b.id, text: b.text }] : []));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: site.name, url: site.linkedin },
    keywords: post.tags.join(", "),
  };

  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className={cn(container, "pt-16 pb-12 md:pt-24 md:pb-16")}>
        <BackLink href="/blogs">All posts</BackLink>
        <p className={cn(enter, "mt-10 font-mono text-[13px] text-muted-foreground")}>
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {readTime(post)}
        </p>
        <h1
          className={cn(enter, "mt-4 max-w-[20ch] text-[clamp(40px,5.6vw,76px)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink")}
          style={after(100)}
        >
          {post.title}
        </h1>
        <p className={cn(enter, "mt-6 max-w-[60ch] text-[20px] leading-[1.55] text-body")} style={after(200)}>
          {post.description}
        </p>
        <ul className={cn(enter, "mt-7 flex flex-wrap gap-2")} style={after(280)}>
          {post.tags.map((t) => (
            <li key={t} className="rounded-full border bg-card px-3 py-1 font-mono text-[12px] text-ink">
              {t}
            </li>
          ))}
        </ul>
      </header>

      <div className={cn(container, "grid grid-cols-[minmax(0,1fr)] gap-12 border-t pt-4 pb-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 md:pb-32")}>
        {/* Table of contents (wide screens) */}
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 pt-12">
            <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">On this page</p>
            <ol className="mt-4 space-y-2.5 border-l text-[14px]">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="-ml-px block border-l border-transparent pl-4 text-body hover:border-primary hover:text-ink">
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0 max-w-[68ch] pt-6">
          <PostBody blocks={post.blocks} />
          <ReadTracker slug={post.slug} />

          {project && (
            <aside className="mt-16 rounded-3xl bg-sky-50 p-6 ring-1 ring-ink/[0.06] md:p-8">
              <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">Related case study</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{project.title}</p>
              <p className="mt-2 text-[16px] leading-relaxed text-body">{project.problem}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  Read the case study <span className="arrow arrow-right" aria-hidden>→</span>
                </Link>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 rounded-full border bg-card px-5 text-[15px] font-medium text-ink hover:border-primary hover:text-primary"
                  >
                    Try Trustplot <span className="arrow arrow-up" aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </aside>
          )}
        </article>
      </div>
    </main>
  );
}
