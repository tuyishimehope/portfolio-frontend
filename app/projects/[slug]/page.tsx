import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Code2 } from "lucide-react";
import PipelineDiagram from "@/components/pipeline-diagram";
import Reveal from "@/components/reveal";
import { AccentLabel, BackLink, ProjectVisual, StackBadges, after, container, enter } from "@/components/site";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project" };
  const title = `${project.title} — Hope Tuyishime`;
  const description = `${project.problem} ${project.role}${project.year ? `, ${project.year}` : ""}. Stack: ${project.stack.join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", title, description, url: `/projects/${project.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="top">
      <section className={`${container} pt-24 pb-16 md:pt-32`}>
        <BackLink href="/projects">All work</BackLink>
        <div className={cn(enter, "mt-10")}>
          <AccentLabel project={project}>{[project.role, project.year].filter(Boolean).join(" · ")}</AccentLabel>
        </div>
        <h1
          className={cn(enter, "mt-4 text-[clamp(40px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.03em]")}
          style={after(120)}
        >
          {project.title}
        </h1>
        <div className={cn(enter, "mt-8 grid gap-8 md:grid-cols-12")} style={after(240)}>
          <p className="text-[20px] leading-relaxed text-body md:col-span-7">{project.problem}</p>
          <div className="md:col-span-4 md:col-start-9">
            <p className="meta mb-3">Stack</p>
            <StackBadges project={project} />
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 mr-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                View live site
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Code2 className="size-4" aria-hidden />
                View code on GitHub
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </section>

      <div className={container}>
        <div className="overflow-hidden rounded-xl border bg-card">
          <ProjectVisual project={project} full />
        </div>
      </div>

      {project.architecture && (
        <section className={`${container} pt-16 md:pt-24`}>
          <p className="meta mb-6">Architecture</p>
          <div className="rounded-2xl border bg-card p-4 md:p-8">
            <PipelineDiagram pipeline={project.architecture} label={`${project.title} architecture`} />
          </div>
        </section>
      )}

      <article className={`${container} section`}>
        {project.caseStudy.map((s, i) => (
          <Reveal key={s.heading} className="grid gap-4 border-t py-12 md:grid-cols-12 md:gap-8">
            <h2 className="meta md:col-span-3 md:pt-1.5">
              {String(i + 1).padStart(2, "0")} / {s.heading}
            </h2>
            <div className="md:col-span-8">
              <p className="text-[20px] leading-relaxed">{s.body}</p>
              {s.points && (
                <ul className="mt-6 space-y-3">
                  {s.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[17px] leading-relaxed text-body">
                      <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </article>

      <section className={`${container} border-t py-16`}>
        <p className="meta">Next project</p>
        <Link
          href={`/projects/${next.slug}`}
          className="mt-4 inline-block text-[clamp(28px,4vw,48px)] font-semibold tracking-tight"
        >
          {next.title} <span className="arrow arrow-right text-primary" aria-hidden>→</span>
        </Link>
      </section>
    </main>
  );
}
