import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import {
  AboutBento,
  CapabilitiesGrid,
  ExperienceList,
  MoreLink,
  PostList,
  ProjectCard,
  SectionLabel,
  container,
} from "@/components/site";
import { flagship, posts, secondary } from "@/lib/content";

export default function Home() {
  return (
    <main id="top">
      <Hero />

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

      {/* About: bento */}
      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="02">About</SectionLabel>
          <AboutBento />
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
    </main>
  );
}
