import Reveal from "@/components/reveal";
import {
  capabilities,
  experience,
  flagship,
  posts,
  secondary,
  site,
  type Project,
} from "@/lib/content";
import Image from "next/image";

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8";

function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <p className="meta mb-10 md:mb-14">
      {n} / {children}
    </p>
  );
}

// Grayscale stand-in until real screenshots / diagrams exist.
function Placeholder({ label, tall }: { label: string; tall?: boolean }) {
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

function ProjectCard({ project, flagship }: { project: Project; flagship?: boolean }) {
  return (
    <a href={`/projects/${project.slug}`} className="group block">
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
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
            <dt>Role</dt>
            <dd className="text-foreground">{project.role}</dd>
            <dt>Stack</dt>
            <dd className="text-foreground">{project.stack.join(" · ")}</dd>
            <dt>Year</dt>
            <dd className="text-foreground">{project.year}</dd>
          </dl>
          <p className="mt-5 text-[16px] text-accent">
            Read case study <span className="arrow arrow-right" aria-hidden>→</span>
          </p>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <main id="top">
      {/* 02 Hero */}
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

      {/* 03 Credibility strip */}
      <div className="border-y border-border">
        <p className={`${container} meta py-5 leading-relaxed`}>
          IFAD (UN agency, Rome) · Andela · NetFella · AUCA Innovation Center · Founder, Trustplot
        </p>
      </div>

      {/* 04 Selected work */}
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
      </section>

      {/* 05 About preview */}
      <section id="about" className="section border-t border-border">
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
              <a href="/about" className="mt-8 inline-block text-accent">
                More about me <span className="arrow arrow-right" aria-hidden>→</span>
              </a>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              {/* [TODO] Replace with portrait via next/image */}
              <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-surface">
                <span className="meta">
                  <Image src="/hope-photo.jpg" alt={""} width={300} height={300}/>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 06 Capabilities */}
      <section className="section border-t border-border">
        <div className={container}>
          <SectionLabel n="03">Capabilities</SectionLabel>
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
        </div>
      </section>

      {/* 07 Experience */}
      <section className="section border-t border-border">
        <div className={container}>
          <SectionLabel n="04">Experience</SectionLabel>
          <Reveal>
            <ol className="border-t border-border">
              {experience.map((e) => (
                <li
                  key={e.org}
                  className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-8"
                >
                  <span className="meta md:col-span-2 md:pt-1">{e.years}</span>
                  <div className="md:col-span-5">
                    <p className="font-semibold">{e.role}</p>
                    <p className="text-muted">{e.org}</p>
                  </div>
                  <p className="text-muted md:col-span-5">{e.impact}</p>
                </li>
              ))}
            </ol>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-accent"
            >
              Full résumé <span className="arrow arrow-up" aria-hidden>↗</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* 08 Writing: hidden until real posts exist */}
      {posts.length > 0 && (
        <section id="writing" className="section border-t border-border">
          <div className={container}>
            <SectionLabel n="05">Writing</SectionLabel>
            <ul className="border-t border-border">
              {posts.slice(0, 3).map((p) => (
                <li key={p.href} className="border-b border-border">
                  <a href={p.href} className="group grid gap-2 py-6 md:grid-cols-12 md:gap-8">
                    <span className="meta md:col-span-2 md:pt-1">{p.date}</span>
                    <span className="text-xl font-semibold md:col-span-8">{p.title}</span>
                    <span className="meta md:col-span-2 md:pt-1 md:text-right">{p.readTime}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 09 CTA */}
      <section
        id="contact"
        className={`${container} flex min-h-[50vh] flex-col justify-center border-t border-border py-24`}
      >
        <Reveal>
          <h2 className="max-w-[16ch] text-[clamp(40px,5.5vw,72px)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Building something that has to work?
          </h2>
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

      {/* 10 Footer */}
      <footer className="border-t border-border">
        <div className={`${container} meta flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between`}>
          <span className="!text-foreground">{site.name}</span>
          <ul className="flex gap-6">
            <li><a href={site.linkedin} className="hover:text-foreground">LinkedIn</a></li>
            <li><a href={site.github} className="hover:text-foreground">GitHub</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-foreground">Email</a></li>
          </ul>
          <span>
            {site.location} · {new Date().getFullYear()}
          </span>
          <a href="#top" className="hover:text-foreground">
            Back to top <span className="arrow arrow-up" aria-hidden>↑</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
