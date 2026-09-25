import Image from "next/image";
import Link from "next/link";
import AutoVideo from "@/components/auto-video";
import Reveal from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { capabilities, experience, posts, site, type Project } from "@/lib/content";

export const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8";

// Pill buttons on top of shadcn's Button. Primary is the only filled interactive color.
export const pill = "h-11 rounded-full px-6 text-[16px]";
export const pillPrimary = cn(pill, "hover:bg-primary-hover");
export const pillOutline = cn(pill, "border-ink bg-transparent text-ink hover:bg-ink hover:text-background");

// Static class names so Tailwind can see them. Accents are decoration only.
const accentStyles: Record<Project["accent"], { tint: string; dot: string }> = {
  growth: { tint: "bg-growth/8", dot: "bg-growth" },
  energy: { tint: "bg-energy/8", dot: "bg-energy" },
  playful: {
    tint: "bg-gradient-to-br from-playful/10 to-primary/8",
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

// Top of an inner page: mono label, big title, optional intro line.
export function PageHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <section className={`${container} pt-24 pb-16 md:pt-32 md:pb-24`}>
      <p className="meta mb-8">{label}</p>
      <h1 className="max-w-[18ch] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.03em]">
        {title}
      </h1>
      {intro && <p className="mt-8 max-w-2xl text-[20px] leading-relaxed text-body">{intro}</p>}
    </section>
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
      <dt>Year</dt>
      <dd className="text-ink">{project.year}</dd>
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

export function CapabilitiesGrid() {
  return (
    <Reveal className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
      {capabilities.map((c) => (
        <div key={c.label}>
          <h3 className="text-xl font-semibold tracking-tight">{c.label}</h3>
          <ul className="mt-4 space-y-1.5 text-body">
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
      <Separator />
      <ol>
        {experience.map((e) => (
          <li key={e.org}>
            <div className="grid gap-2 py-6 md:grid-cols-12 md:gap-8">
              <span className="meta md:col-span-2 md:pt-1">{e.years}</span>
              <div className="md:col-span-5">
                <p className="font-semibold">{e.role}</p>
                <p className="text-body">{e.org}</p>
              </div>
              <p className="text-body md:col-span-5">{e.impact}</p>
            </div>
            <Separator />
          </li>
        ))}
      </ol>
      <a
        href={site.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block text-primary hover:text-primary-hover"
      >
        Full résumé <span className="arrow arrow-up" aria-hidden>↗</span>
      </a>
    </Reveal>
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
