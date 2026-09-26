import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Container, Database, GraduationCap, MapPin, Server, Sparkles, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import AutoVideo from "@/components/auto-video";
import PipelineDiagram from "@/components/pipeline-diagram";
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

// Each project owns one pale surface (the card itself) and a saturated dot.
// Static class names so Tailwind can see them.
const accentStyles: Record<Project["accent"], { tint: string; dot: string }> = {
  sky: { tint: "bg-sky-50", dot: "bg-sky" },
  sun: { tint: "bg-sun-50", dot: "bg-sun" },
  pink: { tint: "bg-pink-50", dot: "bg-pink" },
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

  // Diagrams: drawn, not photographed. Full size on case studies, compact in card frames.
  if (media?.type === "diagram") {
    return full ? (
      <div className={cn("p-4 md:p-12", accentStyles[project.accent].tint)}>
        <div className="rounded-lg bg-background/70 p-4 ring-1 ring-ink/10 backdrop-blur md:p-8">
          <PipelineDiagram pipeline={media.pipeline} label={media.label} />
        </div>
      </div>
    ) : (
      <div className={cn("relative w-full overflow-hidden", accentStyles[project.accent].tint, tall ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/3]")}>
        <div className="absolute inset-x-5 top-5 bottom-0 overflow-hidden rounded-t-lg bg-background/80 p-4 shadow-[0_18px_40px_-18px_rgb(10_37_64/0.35)] ring-1 ring-ink/10 transition-transform duration-300 group-hover:-translate-y-1 md:inset-x-8 md:top-8">
          <PipelineDiagram pipeline={media.pipeline} label={media.label} compact />
        </div>
      </div>
    );
  }

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
            <AutoVideo src={media.src} label={media.label} poster={media.poster} controls className="aspect-video w-full" />
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

// Media-first card: the screenshot or video fills the whole card, edge to edge.
// Hover (or keyboard focus) reveals the problem, stack and a link; touch screens
// get the same details below the title. Everything else lives on the project page.
export function ProjectCard({ project }: { project: Project }) {
  const { media } = project;
  const href = `/projects/${project.slug}`;
  return (
    <article className="group/card">
      <Link
        href={href}
        className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-card ring-1 ring-ink/[0.08] transition-shadow duration-300 hover:shadow-[0_28px_60px_-32px_rgb(11_21_54/0.45)] sm:aspect-[16/10] lg:aspect-[16/9]"
        aria-label={`${project.title} case study`}
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none">
          {media?.type === "image" && (
            <Image src={media.src} alt={media.alt} fill sizes="(min-width: 1200px) 1136px, 100vw" className="object-cover object-top" />
          )}
          {media?.type === "video" && (
            <AutoVideo
              src={media.src}
              label={media.label}
              poster={media.poster}
              className="h-full w-full object-cover object-top"
            />
          )}
          {media?.type === "diagram" && (
            <div className="p-4 md:p-8">
              <PipelineDiagram pipeline={media.pipeline} label={media.label} compact />
            </div>
          )}
          {!media && (
            <div className="flex h-full items-center justify-center">
              <span className="meta px-6 text-center">{project.visual}</span>
            </div>
          )}
        </div>

        {/* Hover details (hover-capable devices only) */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-4 rounded-2xl border bg-card/90 p-5 opacity-0 shadow-[0_20px_40px_-24px_rgb(11_21_54/0.45)] backdrop-blur-xl transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none sm:inset-x-6 sm:bottom-6 sm:p-6 [@media(hover:hover)]:block">
          <p className="max-w-2xl text-[17px] leading-snug text-ink">{project.problem}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="rounded-full border bg-background/70 px-3 py-1 font-mono text-[12px] text-ink">
                  {item}
                </li>
              ))}
            </ul>
            <span className="text-[15px] font-medium text-primary">
              Read case study <span className="arrow arrow-right" aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Link>

      {/* Always visible */}
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <AccentLabel project={project}>{[project.role, project.year].filter(Boolean).join(" · ")}</AccentLabel>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            <Link href={href} className="hover:text-primary">
              {project.title}
            </Link>
          </h3>
          {/* Touch screens can't hover: show the essentials here instead */}
          <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-body [@media(hover:hover)]:hidden">{project.problem}</p>
        </div>
        <div className="mt-5 flex shrink-0 items-center gap-2">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium text-ink transition-colors hover:border-primary hover:text-primary"
            >
              View live
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          )}
          <Link
            href={href}
            aria-label={`Read the ${project.title} case study`}
            className="flex size-11 items-center justify-center rounded-full border text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground group-hover/card:border-primary"
          >
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
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
          const education = e.kind === "education";
          const last = i === experience.length - 1;
          return (
            <li key={e.org} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 md:grid-cols-[120px_40px_minmax(0,1fr)] md:gap-x-6">
              {/* Years (desktop) */}
              <div className="hidden pt-6 text-right font-mono text-[13px] leading-tight tracking-[0.04em] md:block">
                <span className={cn("block", latest ? "text-primary" : "text-ink")}>{e.start}</span>
                <span className={cn("block", latest ? "text-primary" : "text-muted-foreground")}>
                  {education ? e.end : `→ ${e.end}`}
                </span>
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
                {education ? (
                  <span className="relative mt-6 flex size-6 items-center justify-center rounded-full border border-sky bg-sky-50 text-ink">
                    <GraduationCap className="size-3.5" />
                  </span>
                ) : (
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
                )}
              </div>

              {/* Card */}
              <Reveal delay={i * 120} className="pb-5 md:pb-6">
                <div
                  className={cn(
                    "group rounded-2xl border bg-card p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_36px_-18px_rgb(10_37_64/0.3)] motion-reduce:transform-none md:p-6",
                    latest && "border-primary/30 shadow-[0_16px_40px_-24px] shadow-primary/40",
                    education && "border-sky/60 bg-sky-50",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground md:hidden">
                      {education ? `${e.start} · ${e.end}` : `${e.start} – ${e.end}`}
                    </span>
                    {education && (
                      <span className="rounded-full border border-sky bg-card px-2.5 py-0.5 text-[11px] font-medium text-ink">
                        Education
                      </span>
                    )}
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
          <Link href={p.href} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10">
            <p className="font-mono text-[13px] text-muted-foreground md:col-span-3 md:pt-1.5">
              {p.date} · {p.readTime}
            </p>
            <div className="md:col-span-8">
              <h3 className="text-[clamp(22px,2.4vw,30px)] leading-tight font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-primary">
                {p.title}
              </h3>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-body">{p.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-full border bg-card px-3 py-1 font-mono text-[12px] text-ink">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <span
              aria-hidden
              className="hidden size-11 items-center justify-center justify-self-end rounded-full border text-ink transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:col-span-1 md:flex"
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Homepage About preview: warm story tile + the portrait (moved here from the hero),
// then three quiet fact tiles.
const tile =
  "h-full gap-0 rounded-3xl p-6 ring-ink/[0.06] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgb(11_21_54/0.28)] motion-reduce:transform-none";

export function AboutBento() {
  return (
    <div className="grid gap-4 md:grid-cols-12">
      {/* Story */}
      <Reveal className="md:col-span-7 md:row-span-2">
        <div className="flex h-full flex-col rounded-3xl bg-sky-50 p-7 ring-1 ring-ink/[0.06] md:p-10">
          <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">Hello, I&apos;m Hope</p>
          <p className="mt-5 text-[clamp(24px,2.5vw,34px)] leading-[1.2] font-medium tracking-[-0.02em] text-ink">
            I like problems where software has to keep working after the demo:{" "}
            <span className="text-body">messy data, long-running jobs, integrations, and people who depend on it.</span>
          </p>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-body">
            Most recently at IFAD, a UN agency in Rome, I built asynchronous document-processing services with FastAPI,
            PostgreSQL and Azure Service Bus. Now I&apos;m building Trustplot. Next, I want a backend team where
            reliability and data are the job.
          </p>
          <div className="mt-auto pt-8">
            <MoreLink href="/about">More about me</MoreLink>
          </div>
        </div>
      </Reveal>

      {/* Portrait */}
      <Reveal className="md:col-span-5 md:row-span-2" delay={90}>
        <div className="relative h-full min-h-[380px] overflow-hidden rounded-3xl bg-muted ring-1 ring-ink/[0.06]">
          <Image
            src="/hope-photo.jpg"
            alt="Portrait of Hope Tuyishime"
            fill
            sizes="(min-width: 768px) 460px, 100vw"
            className="object-cover object-[50%_20%]"
          />
        </div>
      </Reveal>

      {/* Now */}
      <Reveal className="md:col-span-4" delay={180}>
        <Link href="/projects/trustplot" className="group block h-full rounded-3xl">
          <Card className={tile}>
            <p className="flex items-center gap-2 font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-green" />
              </span>
              Now
            </p>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">Founder, Trustplot</h3>
            <p className="mt-1 text-[15px] text-body">Land and property intelligence for Rwanda · since May 2026</p>
            <p className="mt-4 text-[15px] text-primary">
              Case study <span className="arrow arrow-right" aria-hidden>→</span>
            </p>
          </Card>
        </Link>
      </Reveal>

      {/* Location */}
      <Reveal className="md:col-span-4" delay={270}>
        <Card className={tile}>
          <BentoIcon icon={MapPin} />
          <h3 className="mt-5 text-lg font-semibold tracking-tight">{site.location}</h3>
          <p className="mt-1 text-[15px] text-ink">{facts.sponsorship}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{facts.relocation}</p>
        </Card>
      </Reveal>

      {/* Education */}
      <Reveal className="md:col-span-4" delay={360}>
        <Card className={tile}>
          <BentoIcon icon={GraduationCap} />
          <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight">{facts.education.degree}</h3>
          <p className="mt-2 text-[14px] text-body">
            {facts.education.honours} · {facts.education.school} · {facts.education.year}
          </p>
        </Card>
      </Reveal>
    </div>
  );
}

// Quiet proof line right under the hero: names only, no logos.
export function ProofLine() {
  const rows = [
    { label: "Previously", value: "IFAD · Andela · AUCA Innovation Center · NetFella" },
    { label: "Currently", value: "Founder, Trustplot" },
    { label: "Education", value: `${facts.education.short} · ${facts.education.schoolShort} · ${facts.education.year}` },
  ];
  return (
    <div className="border-y bg-card">
      <dl className={cn(container, "grid gap-3 py-6 md:grid-cols-[1.3fr_0.8fr_1.1fr] md:gap-8")}>
        {rows.map((r) => (
          <div key={r.label} className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <dt className="w-24 font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">{r.label}</dt>
            <dd className="text-[15px] font-medium text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// IFAD results with almost no colour: the numbers carry the authority.
export function ImpactSection() {
  return (
    <section className="border-y bg-card" aria-labelledby="impact-heading">
      <div className={cn(container, "section")}>
        <SectionLabel n="02">Impact at IFAD</SectionLabel>
        <h2 id="impact-heading" className="sr-only">
          Impact at IFAD
        </h2>
        <dl className="grid gap-14 md:grid-cols-2 md:gap-10">
          {facts.impact.map((f) => (
            <Reveal key={f.value}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-[clamp(72px,10vw,148px)] leading-[0.9] font-semibold tracking-[-0.05em] text-ink">
                {f.value}
              </dd>
              <dd className="mt-6 max-w-[24ch] text-[20px] leading-snug text-body">{f.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function BentoIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 text-primary shadow-[0_0_24px_-8px] shadow-primary/40">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}
