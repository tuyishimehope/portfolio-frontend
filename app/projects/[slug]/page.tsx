import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/reveal";
import { AccentLabel, ContactCTA, ProjectVisual, StackBadges, container } from "@/components/site";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} — Hope Tuyishime` : "Project" };
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
        <Link href="/projects" className="meta hover:text-primary">
          ← All work
        </Link>
        <div className="mt-10">
          <AccentLabel project={project}>{`${project.role} · ${project.year}`}</AccentLabel>
        </div>
        <h1 className="mt-4 text-[clamp(40px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.03em]">
          {project.title}
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <p className="text-[20px] leading-relaxed text-body md:col-span-7">{project.problem}</p>
          <div className="md:col-span-4 md:col-start-9">
            <p className="meta mb-3">Stack</p>
            <StackBadges project={project} />
          </div>
        </div>
      </section>

      <div className={container}>
        <div className="overflow-hidden rounded-xl border bg-card">
          <ProjectVisual project={project} tall />
        </div>
      </div>

      <article className={`${container} section`}>
        {project.caseStudy.map((s, i) => (
          <Reveal key={s.heading} className="grid gap-4 border-t py-12 md:grid-cols-12 md:gap-8">
            <p className="meta md:col-span-3 md:pt-1.5">
              {String(i + 1).padStart(2, "0")} / {s.heading}
            </p>
            <p className="text-[20px] leading-relaxed md:col-span-8">{s.body}</p>
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

      <ContactCTA />
    </main>
  );
}
