import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import {
  AboutBento,
  CapabilitiesGrid,
  ExperienceList,
  ImpactSection,
  MoreLink,
  PostList,
  ProjectCard,
  ProofLine,
  SectionLabel,
  container,
} from "@/components/site";
import { posts, projects } from "@/lib/content";

/*
  Rhythm: warm-white hero with the live system → quiet proof line → pastel project
  cards on the neutral canvas → colourless IFAD numbers → About (portrait lives here)
  → capabilities → experience → the one dark section (CTA + footer, in the layout).
*/
export default function Home() {
  return (
    <main id="top">
      <Hero />
      <ProofLine />

      {/* Selected work */}
      <section id="work" className={`${container} section`}>
        <SectionLabel n="01">Selected work</SectionLabel>
        <h2 className="-mt-4 mb-12 max-w-[18ch] text-[clamp(36px,4.6vw,60px)] leading-[1.02] font-semibold tracking-[-0.03em] md:-mt-6 md:mb-16">
          Work that had to keep working.
        </h2>
        <div className="space-y-16 md:space-y-24">
          {projects.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
        <MoreLink href="/projects">All work</MoreLink>
      </section>

      <ImpactSection />

      {/* About */}
      <section className="section">
        <div className={container}>
          <SectionLabel n="03">About</SectionLabel>
          <AboutBento />
        </div>
      </section>

      {/* Capabilities */}
      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="04">Capabilities</SectionLabel>
          <CapabilitiesGrid />
        </div>
      </section>

      {/* Experience */}
      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="05">Experience</SectionLabel>
          <ExperienceList />
        </div>
      </section>

      {/* Writing: hidden until real posts exist */}
      {posts.length > 0 && (
        <section className="section border-t">
          <div className={container}>
            <SectionLabel n="06">Writing</SectionLabel>
            <PostList limit={3} />
            <MoreLink href="/blogs">All writing</MoreLink>
          </div>
        </section>
      )}
    </main>
  );
}
