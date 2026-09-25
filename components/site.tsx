import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Container, Database, GraduationCap, MapPin, Server, Sparkles, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import AutoVideo from "@/components/auto-video";
import Reveal from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { capabilities, experience, facts, posts, site, type Project } from "@/lib/content";

export const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8";

// Pill buttons on top of shadcn's Button. Primary is the only filled interactive color.
export const pill = "h-11 rounded-full px-6 text-[16px]";
export const pillPrimary = cn(pill, "btn-glow hover:bg-primary-hover");
export const pillOutline = cn(pill, "border-ink bg-transparent text-ink hover:bg-ink hover:text-background");

// Static class names so Tailwind can see them. Accents are decoration only.
const accentStyles: Record<Project["accent"], { tint: string; dot: string }> = {
  growth: { tint: "bg-growth/8 dark:bg-transparent dark:bg-[radial-gradient(ellipse_at_50%_0%,rgb(66_211_146/0.16),transparent_70%)]", dot: "bg-growth" },
  energy: { tint: "bg-energy/8 dark:bg-transparent dark:bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_138_61/0.16),transparent_70%)]", dot: "bg-energy" },
  playful: {
    tint: "bg-gradient-to-br from-playful/10 to-primary/8 dark:from-playful/12 dark:to-primary/10",
    dot: "bg-gradient-to-br from-playful to-primary",
  },
};

export function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <p className="meta mb-10 md:mb-14">
      {n} / {children}
    </p>
  );
}

export function MoreLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="mt-8 inline-block text-primary hover:text-primary-hover">
      {children} <span className="arrow arrow-right" aria-hidden>→</span>
    </Link>
  );
}

// Staggered entrance shared by page intros (same pattern as the auth pages).
export const enter = "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 motion-reduce:animate-none";
export const after = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

// Top of an inner page: eyebrow, big title, optional intro line.
export function PageHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <section className={`${container} pt-24 pb-16 md:pt-32 md:pb-24`}>
      <p className={cn(enter, "eyebrow mb-6")}>{label}</p>
      <h1
        className={cn(enter, "max-w-[18ch] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.03em]")}
        style={after(120)}
      >
        {title}
      </h1>
      {intro && (
        <p className={cn(enter, "mt-8 max-w-2xl text-[20px] leading-relaxed text-body")} style={after(240)}>
          {intro}
        </p>
      )}
    </section>
  );
}

// "Back to …" link with the arrow nudging left on hover (auth header pattern).
export function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group -ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-body transition-colors hover:text-primary"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" aria-hidden />
      {children}
    </Link>
  );
}

// Real media sits inset in a tinted frame, top-anchored and cropped at the bottom
// (Stripe-style product shot). Without media, a labelled placeholder stands in.
export function ProjectVisual({
  project,
  tall,
  full,
}: {
  project: Project;
  tall?: boolean;
  full?: boolean; // case-study view: whole shot, uncropped, video with controls
}) {
  const { media } = project;

  if (media && full) {
    return (
      <div className={cn("p-4 md:p-12", accentStyles[project.accent].tint)}>
        <div className="overflow-hidden rounded-lg bg-card shadow-[0_18px_40px_-18px_rgb(10_37_64/0.35)] ring-1 ring-ink/10">
          {media.type === "image" ? (
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              sizes="(min-width: 1200px) 1040px, 100vw"
              className="h-auto w-full"
              priority
            />
          ) : (
            <AutoVideo src={media.src} label={media.label} controls className="aspect-video w-full" />
          )}
        </div>
      </div>
    );
  }

  const frame = cn(
    "relative w-full overflow-hidden",
    accentStyles[project.accent].tint,
    tall || full ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/3]",
  );

  if (!media) {
    return (
      <div className={cn(frame, "flex items-center justify-center")}>
        <span className="meta px-6 text-center">[Visual] {project.visual}</span>
      </div>
    );
  }

  const shot =
    "overflow-hidden rounded-t-lg shadow-[0_18px_40px_-18px_rgb(10_37_64/0.35)] ring-1 ring-ink/10 transition-transform duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1";

  return (
    <div className={frame}>
      <div className={cn("absolute inset-x-5 top-5 bottom-0 md:inset-x-10 md:top-10", tall && "md:inset-x-16")}>
        {media.type === "image" ? (
          <div className={cn(shot, "relative h-full w-full bg-card")}>
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes={tall ? "(min-width: 1200px) 1100px, 100vw" : "(min-width: 768px) 560px, 100vw"}
              className="object-cover object-top"
              priority={tall}
            />
          </div>
        ) : (
          <div className={cn(shot, "h-full w-full bg-card")}>
            <AutoVideo
              src={media.src}
              label={media.label}
              className="h-full w-full object-cover object-top"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function AccentLabel({ project, children }: { project: Project; children: string }) {
  return (
    <p className="meta flex items-center gap-2">
      <span className={cn("size-2 rounded-full", accentStyles[project.accent].dot)} aria-hidden />
      {children}
    </p>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
      <dt>Role</dt>
      <dd className="text-ink">{project.role}</dd>
      <dt>Stack</dt>
      <dd className="text-ink">{project.stack.join(" · ")}</dd>
      {project.year && (
        <>
          <dt>Year</dt>
          <dd className="text-ink">{project.year}</dd>
        </>
      )}
    </dl>
  );
}

export function ProjectCard({ project, flagship }: { project: Project; flagship?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full rounded-xl">
      <Card className="h-full gap-0 py-0 ring-border transition-shadow duration-300 group-hover:shadow-[0_12px_32px_-12px_rgb(10_37_64/0.18)]">
        <ProjectVisual project={project} tall={flagship} />
        <div className={cn("p-6 md:p-8", flagship && "md:grid md:grid-cols-12 md:gap-8")}>
          <div className={flagship ? "md:col-span-7" : ""}>
            <AccentLabel project={project}>{flagship ? "Flagship" : "Case study"}</AccentLabel>
            <h3
              className={cn(
                "mt-4 font-semibold tracking-tight text-ink",
                flagship ? "text-3xl md:text-4xl" : "text-2xl",
              )}
            >
              {project.title}
            </h3>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-body">{project.problem}</p>
          </div>
          <div className={cn("mt-6", flagship && "md:col-span-5 md:mt-9")}>
            <ProjectMeta project={project} />
            <p className="mt-6 text-[16px] text-primary">
              Read case study <span className="arrow arrow-right" aria-hidden>→</span>
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function StackBadges({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.stack.map((s, i) => (
        <Badge key={`${s}-${i}`} variant="outline" className="h-7 bg-card px-3 font-mono text-[12px] text-ink">
          {s}
        </Badge>
      ))}
    </div>
  );
}

export function Portrait() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
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

// Bento: Backend is the large tile, the rest fill around it.
const capabilityTiles: Record<string, { icon: LucideIcon; span: string; blurb: string }> = {
  Backend: { icon: Server, span: "md:col-span-2 md:row-span-2", blurb: "APIs and services that stay fast under real load." },
  "Data & messaging": { icon: Database, span: "md:col-span-2", blurb: "Schemas, queues and pipelines." },
  Infrastructure: { icon: Container, span: "", blurb: "Ship it the same way every time." },
  "AI & testing": { icon: Sparkles, span: "", blurb: "Extraction, retrieval, and proof it works." },
};

export function CapabilitiesGrid() {
  return (
    <div className="grid gap-4 md:auto-rows-[minmax(180px,auto)] md:grid-cols-4">
      {capabilities.map((c, i) => {
        const tile = capabilityTiles[c.label];
        const big = i === 0;
        const Icon = tile?.icon ?? Server;
        return (
          <Reveal key={c.label} delay={i * 90} className={cn("h-full", tile?.span)}>
            <Card
              className={cn(
                "group h-full gap-0 rounded-2xl p-6 ring-border transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgb(10_37_64/0.3)] motion-reduce:transform-none",
                big && "md:p-8",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 text-primary shadow-[0_0_24px_-8px] shadow-primary/40",
                  big ? "size-12" : "size-10",
                )}
              >
                <Icon className={big ? "size-6" : "size-5"} aria-hidden />
              </span>
              <h3 className={cn("mt-5 font-semibold tracking-tight", big ? "text-2xl md:text-3xl" : "text-lg")}>{c.label}</h3>
              <p className="mt-1.5 text-[15px] text-body">{tile?.blurb}</p>
              {big && (
                <pre
                  aria-label="Example: an upload is accepted immediately and processed by background workers"
                  className="mt-6 hidden overflow-x-auto rounded-xl border bg-muted/60 p-4 font-mono text-[12.5px] leading-6 text-body md:block"
                >
                  <span className="text-primary">POST</span> /documents{"      "}<span className="text-ink">→ 202 Accepted</span>
                  {"\n"}<span className="text-muted-foreground">  ↳ queue</span>{"    "}document.analyze
                  {"\n"}<span className="text-muted-foreground">  ↳ worker</span>{"   "}ocr · extract · review
                  {"\n"}<span className="text-muted-foreground">  ↳ on fail</span>{"  "}retry, then recover
                </pre>
              )}
              <ul className={cn("mt-auto flex flex-wrap gap-2 pt-6", big && "md:pt-10")}>
                {c.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border bg-background/60 px-3 py-1 font-mono text-[12px] text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}

// Vertical timeline: years | rail with nodes | card. Latest role glows.
// On mobile the rail moves to the left edge and the years sit inside the card.
export function ExperienceList() {
  return (
    <div>
      <ol className="relative">
        {experience.map((e, i) => {
          const latest = e.end === "Now";
          const last = i === experience.length - 1;
          return (
            <li key={e.org} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 md:grid-cols-[120px_40px_minmax(0,1fr)] md:gap-x-6">
              {/* Years (desktop) */}
              <div className="hidden pt-6 text-right font-mono text-[13px] leading-tight tracking-[0.04em] md:block">
                <span className={cn("block", latest ? "text-primary" : "text-ink")}>{e.start}</span>
                <span className={cn("block", latest ? "text-primary" : "text-muted-foreground")}>→ {e.end}</span>
              </div>

              {/* Rail + node */}
              <div className="relative flex justify-center" aria-hidden>
                <span
                  className={cn(
                    "absolute w-px bg-gradient-to-b from-primary/70 via-primary/35 to-sky/40",
                    i === 0 ? "top-9" : "top-0",
                    last ? "h-9" : "bottom-0",
                  )}
                />
                <span className="relative mt-7 flex size-4 items-center justify-center">
                  {latest && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 motion-reduce:hidden" />
                  )}
                  <span
                    className={cn(
                      "relative size-4 rounded-full border-2",
                      latest
                        ? "border-transparent bg-gradient-to-br from-[#8fa8ff] via-primary to-[#56dff5] shadow-[0_0_16px] shadow-primary/60"
                        : "border-primary/60 bg-background",
                    )}
                  />
                </span>
              </div>

              {/* Card */}
              <Reveal delay={i * 120} className="pb-5 md:pb-6">
                <div
                  className={cn(
                    "group rounded-2xl border bg-card p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_36px_-18px_rgb(10_37_64/0.3)] motion-reduce:transform-none md:p-6",
                    latest && "border-primary/30 shadow-[0_16px_40px_-24px] shadow-primary/40",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground md:hidden">
                      {e.start} – {e.end}
                    </span>
                    {latest && (
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-col gap-1 md:mt-0 md:flex-row md:items-baseline md:justify-between md:gap-6">
                    <h3 className="text-[19px] font-semibold tracking-tight">{e.role}</h3>
                    <p className="shrink-0 text-[15px] font-medium text-primary">{e.org}</p>
                  </div>
                  <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-body">{e.impact}</p>
                  {e.href && (
                    <Link href={e.href} className="mt-3 inline-flex min-h-11 items-center text-[15px] text-primary hover:text-primary-hover">
                      Read case study <span className="arrow arrow-right ml-1" aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
      <a
        href={site.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-primary hover:text-primary-hover md:ml-[208px]"
      >
        Full résumé <span className="arrow arrow-up" aria-hidden>↗</span>
      </a>
    </div>
  );
}

export function PostList({ limit }: { limit?: number }) {
  return (
    <ul className="border-t">
      {posts.slice(0, limit).map((p) => (
        <li key={p.href} className="border-b">
          <Link href={p.href} className="group grid gap-2 py-6 md:grid-cols-12 md:gap-8">
            <span className="meta md:col-span-2 md:pt-1">{p.date}</span>
            <span className="text-xl font-semibold group-hover:text-primary md:col-span-8">{p.title}</span>
            <span className="meta md:col-span-2 md:pt-1 md:text-right">{p.readTime}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Homepage "About" bento: one dark story tile, then small fact tiles and an impact strip.
const tile =
  "h-full gap-0 rounded-2xl p-6 ring-border transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgb(10_37_64/0.3)] motion-reduce:transform-none";

export function AboutBento() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Story (2×2), in the hero's space palette */}
      <Reveal className="md:col-span-2 md:row-span-2">
        <div className="auth-page relative isolate flex h-full flex-col overflow-hidden rounded-2xl p-7 ring-1 ring-white/10 md:p-9">
          <div aria-hidden className="auth-stars pointer-events-none absolute inset-0 -z-10" />
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#a9d8ff] uppercase">Hello, I&apos;m Hope</p>
          <p className="mt-5 text-[clamp(22px,2.3vw,30px)] leading-snug tracking-tight">
            I like problems where software has to keep working after the demo:{" "}
            <span className="space-gradient-text">messy data, long-running jobs, integrations, and people who depend on it.</span>
          </p>
          <p className="mt-6 text-[16px] leading-relaxed text-[#b8c4d9]">
            Most recently at IFAD, a UN agency in Rome, I built asynchronous document-processing services with
            FastAPI, PostgreSQL and Azure Service Bus. Now I&apos;m building Trustplot. Next, I want a backend team
            where reliability and data are the job.
          </p>
          <div className="mt-auto pt-8">
            <Link href="/about" className="auth-social w-fit px-5 text-[15px]">
              More about me <span className="arrow arrow-right" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Now: Trustplot (2 wide) */}
      <Reveal className="md:col-span-2" delay={90}>
        <Link href="/projects/trustplot" className="group block h-full rounded-2xl">
          <Card className={cn(tile, "relative overflow-hidden")}>
            <div className="relative z-10 sm:max-w-[54%]">
              <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-primary uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-growth opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-growth" />
                </span>
                Now
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">Founder, Trustplot</h3>
              <p className="mt-1.5 text-[15px] text-body">Land and property intelligence for Rwanda · since May 2026</p>
              <p className="mt-5 text-[15px] text-primary">
                Read case study <span className="arrow arrow-right" aria-hidden>→</span>
              </p>
            </div>
            <div className="absolute top-6 -right-10 bottom-0 hidden w-[44%] overflow-hidden sm:block rounded-tl-xl bg-growth/10 shadow-[0_12px_32px_-12px_rgb(10_37_64/0.35)] ring-1 ring-ink/10 transition-transform duration-300 group-hover:-translate-y-1">
              <Image src="/projects/trustplot.webp" alt="" fill sizes="300px" className="object-cover object-left-top" />
            </div>
          </Card>
        </Link>
      </Reveal>

      {/* Location */}
      <Reveal delay={180}>
        <Card className={tile}>
          <BentoIcon icon={MapPin} />
          <h3 className="mt-5 text-lg font-semibold tracking-tight">{site.location}</h3>
          <p className="mt-1 text-[15px] font-medium text-primary">Open to relocation</p>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{facts.relocation}</p>
        </Card>
      </Reveal>

      {/* Education */}
      <Reveal delay={270}>
        <Card className={tile}>
          <BentoIcon icon={GraduationCap} />
          <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight">{facts.education.degree}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {facts.education.honours}
            </span>
            {facts.education.school} · {facts.education.year}
          </p>
        </Card>
      </Reveal>

      {/* Impact strip (full width) */}
      <Reveal className="md:col-span-4" delay={360}>
        <Card className={cn(tile, "md:p-8")}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-primary uppercase">Impact at IFAD</p>
            <Link href="/projects/document-intelligence" className="group inline-flex items-center gap-1 text-[14px] text-body hover:text-primary">
              How it was built
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </Link>
          </div>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x">
            {facts.impact.map((f) => (
              <div key={f.value} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <dt className="sr-only">{f.label}</dt>
                <dd className="stat-gradient-text text-[clamp(40px,4.6vw,60px)] leading-none font-semibold tracking-[-0.04em]">
                  {f.value}
                </dd>
                <dd className="mt-3 max-w-[26ch] text-[15px] text-body">{f.label}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </Reveal>
    </div>
  );
}

function BentoIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 text-primary shadow-[0_0_24px_-8px] shadow-primary/40">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}
