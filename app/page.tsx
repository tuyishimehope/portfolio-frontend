import Link from "next/link";
import Reveal from "@/components/reveal";
import {
  CapabilitiesGrid,
  ContactCTA,
  ExperienceList,
  Portrait,
  PostList,
  ProjectCard,
  SectionLabel,
  container,
} from "@/components/ui";
import { flagship, posts, secondary, site } from "@/lib/content";

function MoreLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="mt-8 inline-block text-accent">
      {children} <span className="arrow arrow-right" aria-hidden>→</span>
    </Link>
  );
}

export default function Home() {
  return (
    <main id="top">
      {/* Hero */}
      <section className={`${container} flex min-h-[85vh] flex-col justify-center py-24`}>
        <h1 className="max-w-[14ch] text-[clamp(44px,7vw,96px)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Backend engineer building reliable systems for real-world problems.
        </h1>
        <p className="mt-8 max-w-2xl text-[20px] leading-relaxed text-muted">
          I&apos;m Hope. I design APIs, data pipelines, and AI-powered products with Python, FastAPI, and
          PostgreSQL.
        </p>
        <p className="meta mt-8">Kigali, Rwanda · Open to relocation · Previously IFAD</p>
        <div className="mt-10 flex flex-wrap gap-3 text-[16px]">
          <a
            href="#work"
            className="rounded-full bg-foreground px-6 py-3 text-background transition-opacity hover:opacity-85"
          >
            Selected work <span className="arrow arrow-down" aria-hidden>↓</span>
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Résumé <span className="arrow arrow-up" aria-hidden>↗</span>
          </a>
        </div>
      </section>

      {/* Credibility strip */}
      <div className="border-y border-border">
        <p className={`${container} meta py-5 leading-relaxed`}>
          IFAD (UN agency, Rome) · Andela · NetFella · AUCA Innovation Center · Founder, Trustplot
        </p>
      </div>

      {/* Selected work */}
      <section id="work" className={`${container} section`}>
        <SectionLabel n="01">Selected work</SectionLabel>
        <Reveal>
          <ProjectCard project={flagship} flagship />
        </Reveal>
        <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-8">
          {secondary.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
        <MoreLink href="/projects">All work</MoreLink>
      </section>

      {/* About preview */}
      <section className="section border-t border-border">
        <div className={container}>
          <SectionLabel n="02">About</SectionLabel>
          <Reveal className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <p className="text-[clamp(24px,2.6vw,32px)] leading-snug tracking-tight">
                I like problems where software has to keep working after the demo: messy data, long-running
                jobs, integrations, and people who depend on it.
              </p>
              <p className="mt-6 max-w-xl leading-relaxed text-muted">
                [TODO] ~60 more words: IFAD, founding Trustplot, what you want to work on next.
              </p>
              <MoreLink href="/about">More about me</MoreLink>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <Portrait />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section border-t border-border">
        <div className={container}>
          <SectionLabel n="03">Capabilities</SectionLabel>
          <CapabilitiesGrid />
        </div>
      </section>

      {/* Experience */}
      <section className="section border-t border-border">
        <div className={container}>
          <SectionLabel n="04">Experience</SectionLabel>
          <ExperienceList />
        </div>
      </section>

      {/* Writing: hidden until real posts exist */}
      {posts.length > 0 && (
        <section className="section border-t border-border">
          <div className={container}>
            <SectionLabel n="05">Writing</SectionLabel>
            <PostList limit={3} />
            <MoreLink href="/blogs">All writing</MoreLink>
          </div>
        </section>
      )}

      <ContactCTA />
    </main>
  );
}
