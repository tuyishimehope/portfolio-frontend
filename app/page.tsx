import Reveal from "@/components/reveal";
import { Button } from "@/components/ui/button";
import {
  CapabilitiesGrid,
  ContactCTA,
  ExperienceList,
  MoreLink,
  Portrait,
  PostList,
  ProjectCard,
  SectionLabel,
  container,
  pillOutline,
  pillPrimary,
} from "@/components/site";
import { flagship, posts, secondary, site } from "@/lib/content";

export default function Home() {
  return (
    <main id="top">
      {/* Hero: headline on the light page, gradient band as the visual beneath it */}
      <section className="relative overflow-hidden">
        <div className={`${container} relative z-10 flex min-h-[85vh] flex-col justify-center pt-24 pb-44 md:pb-80`}>
          <h1 className="max-w-[14ch] text-[clamp(44px,7vw,96px)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Backend engineer building reliable systems for real-world problems.
          </h1>
          <p className="mt-8 max-w-2xl text-[20px] leading-relaxed text-body">
            I&apos;m Hope. I design APIs, data pipelines, and AI-powered products with Python, FastAPI, and
            PostgreSQL.
          </p>
          <p className="meta mt-8">Kigali, Rwanda · Open to relocation · Previously IFAD</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className={pillPrimary}>
              <a href="#work">
                Selected work <span className="arrow arrow-down" aria-hidden>↓</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className={pillOutline}>
              <a href={site.resume} target="_blank" rel="noopener noreferrer">
                Résumé <span className="arrow arrow-up" aria-hidden>↗</span>
              </a>
            </Button>
          </div>
        </div>
        <div
          aria-hidden
          className="brand-gradient absolute inset-x-0 -bottom-24 h-52 origin-bottom-left -skew-y-6 md:-bottom-32 md:h-72"
        />
      </section>

      {/* Credibility strip */}
      <div className="border-b">
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
      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="02">About</SectionLabel>
          <Reveal className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <p className="text-[clamp(24px,2.6vw,32px)] leading-snug tracking-tight">
                I like problems where software has to keep working after the demo: messy data, long-running
                jobs, integrations, and people who depend on it.
              </p>
              <p className="mt-6 max-w-xl leading-relaxed text-body">
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
      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="03">Capabilities</SectionLabel>
          <CapabilitiesGrid />
        </div>
      </section>

      {/* Experience */}
      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="04">Experience</SectionLabel>
          <ExperienceList />
        </div>
      </section>

      {/* Writing: hidden until real posts exist */}
      {posts.length > 0 && (
        <section className="section border-t">
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
