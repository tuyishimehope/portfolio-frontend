import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { capabilities, experience, posts, site, type Project } from "@/lib/content";

export const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8";

export function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <p className="meta mb-10 md:mb-14">
      {n} / {children}
    </p>
  );
}

// Top of an inner page: mono label, big title, optional intro line.
export function PageHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <section className={`${container} pt-24 pb-16 md:pt-32 md:pb-24`}>
      <p className="meta mb-8">{label}</p>
      <h1 className="max-w-[18ch] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.03em]">
        {title}
      </h1>
      {intro && <p className="mt-8 max-w-2xl text-[20px] leading-relaxed text-muted">{intro}</p>}
    </section>
  );
}

// Grayscale stand-in until real screenshots / diagrams exist.
export function Placeholder({ label, tall }: { label: string; tall?: boolean }) {
  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden rounded-sm bg-surface transition-transform duration-300 group-hover:scale-[1.02] ${
        tall ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/3]"
      }`}
    >
      <span className="meta px-6 text-center">[Visual] {label}</span>
    </div>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
      <dt>Role</dt>
      <dd className="text-foreground">{project.role}</dd>
      <dt>Stack</dt>
      <dd className="text-foreground">{project.stack.join(" · ")}</dd>
      <dt>Year</dt>
      <dd className="text-foreground">{project.year}</dd>
    </dl>
  );
}

export function ProjectCard({ project, flagship }: { project: Project; flagship?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="overflow-hidden rounded-sm">
        <Placeholder label={project.visual} tall={flagship} />
      </div>
      <div className={`mt-6 ${flagship ? "md:grid md:grid-cols-12 md:gap-8" : ""}`}>
        <div className={flagship ? "md:col-span-7" : ""}>
          <h3 className={`font-semibold tracking-tight ${flagship ? "text-3xl md:text-4xl" : "text-2xl"}`}>
            {project.title}
          </h3>
          <p className="mt-3 max-w-xl text-muted">{project.problem}</p>
        </div>
        <div className={`mt-5 ${flagship ? "md:col-span-5 md:mt-1" : ""}`}>
          <ProjectMeta project={project} />
          <p className="mt-5 text-[16px] text-accent">
            Read case study <span className="arrow arrow-right" aria-hidden>→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export function Portrait() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface">
      <Image
        src="/hope-photo.jpg"
        alt="Portrait of Hope Tuyishime"
        fill
        sizes="(min-width: 768px) 400px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export function CapabilitiesGrid() {
  return (
    <Reveal className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
      {capabilities.map((c) => (
        <div key={c.label}>
          <h3 className="text-xl font-semibold tracking-tight">{c.label}</h3>
          <ul className="mt-4 space-y-1.5 text-muted">
            {c.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </Reveal>
  );
}

export function ExperienceList() {
  return (
    <Reveal>
      <ol className="border-t border-border">
        {experience.map((e) => (
          <li key={e.org} className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-8">
            <span className="meta md:col-span-2 md:pt-1">{e.years}</span>
            <div className="md:col-span-5">
              <p className="font-semibold">{e.role}</p>
              <p className="text-muted">{e.org}</p>
            </div>
            <p className="text-muted md:col-span-5">{e.impact}</p>
          </li>
        ))}
      </ol>
      <a href={site.resume} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block text-accent">
        Full résumé <span className="arrow arrow-up" aria-hidden>↗</span>
      </a>
    </Reveal>
  );
}

export function PostList({ limit }: { limit?: number }) {
  return (
    <ul className="border-t border-border">
      {posts.slice(0, limit).map((p) => (
        <li key={p.href} className="border-b border-border">
          <Link href={p.href} className="group grid gap-2 py-6 md:grid-cols-12 md:gap-8">
            <span className="meta md:col-span-2 md:pt-1">{p.date}</span>
            <span className="text-xl font-semibold md:col-span-8">{p.title}</span>
            <span className="meta md:col-span-2 md:pt-1 md:text-right">{p.readTime}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ContactCTA({ as: Heading = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section className={`${container} flex min-h-[50vh] flex-col justify-center border-t border-border py-24`}>
      <Reveal>
        <Heading className="max-w-[16ch] text-[clamp(40px,5.5vw,72px)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Building something that has to work?
        </Heading>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-accent px-6 py-3 text-[16px] text-background transition-opacity hover:opacity-90"
          >
            Let&apos;s talk <span className="arrow arrow-right" aria-hidden>→</span>
          </a>
          <span className="font-mono text-[15px] text-muted">{site.email}</span>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className={`${container} meta flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between`}>
        <span className="!text-foreground">{site.name}</span>
        <ul className="flex gap-6">
          <li><a href={site.linkedin} className="hover:text-foreground">LinkedIn</a></li>
          <li><a href={site.github} className="hover:text-foreground">GitHub</a></li>
          <li><a href={`mailto:${site.email}`} className="hover:text-foreground">Email</a></li>
        </ul>
        <span>{site.location} · 2026</span>
        <a href="#top" className="hover:text-foreground">
          Back to top <span className="arrow arrow-up" aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
