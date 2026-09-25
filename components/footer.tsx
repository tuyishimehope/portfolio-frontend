"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, FileText, Mail, Sparkle } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import Reveal from "@/components/reveal";
import ThemeSwitcher from "@/components/theme-switcher";
import { container } from "@/components/site";
import { cn } from "@/lib/utils";
import { projects, site } from "@/lib/content";
import { analyticsEnabled, openConsentSettings } from "@/lib/analytics";

// Lucide dropped brand marks, so these two are inline.
function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

type Channel = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
  tile: string; // pastel icon tile, decorative
};

const channels: Channel[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: Mail, tile: "bg-joy/45" },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon, external: true, tile: "bg-sky/40" },
  { label: "GitHub", href: site.github, icon: GitHubIcon, external: true, tile: "bg-playful/25" },
  { label: "Résumé", href: site.resume, icon: FileText, external: true, tile: "bg-energy/25" },
];

const columns = [
  {
    title: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/projects", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/blogs", label: "Blogs" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Case studies",
    links: projects.map((p) => ({ href: `/projects/${p.slug}`, label: p.title })),
  },
];

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Footer() {
  // The contact page already carries the pitch; don't repeat it right below.
  const showPitch = usePathname() !== "/contact";

  return (
    <footer className="px-2 pb-2 md:px-4 md:pb-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-card text-ink ring-1 ring-border">
        {/* Joy wash: pastel sweep in the top-right corner, decorative only */}
        <div aria-hidden className="joy-wash pointer-events-none absolute -top-24 right-0 -z-10 h-[620px] w-full md:w-[70%]" />
        {/* Soft glow that the wordmark sits in */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px]">
          <div className="absolute bottom-[-180px] left-[5%] size-[460px] rounded-full bg-joy/30 blur-[120px]" />
          <div className="absolute bottom-[-200px] left-[38%] size-[460px] rounded-full bg-playful/20 blur-[120px]" />
          <div className="absolute bottom-[-180px] right-[5%] size-[420px] rounded-full bg-sky/30 blur-[120px]" />
        </div>

        <div className={cn(container, "pt-20 md:pt-28")}>
          {showPitch && (
            <Reveal className="mb-16 md:mb-24">
              <p className="flex items-center gap-2 text-[14px] font-medium text-primary">
                <Sparkle className="size-3.5 fill-current" aria-hidden />
                Contact
              </p>
              <h2 className="mt-5 max-w-[20ch] text-[clamp(34px,4.6vw,60px)] font-semibold leading-[1.06] tracking-[-0.03em]">
                Building something that has to work?{" "}
                <span className="text-muted-foreground">Let&apos;s talk about backend systems, data, or AI.</span>
              </h2>
              <p className="mt-10 text-[14px] text-muted-foreground">Write to me at</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 inline-flex items-center gap-2 text-[clamp(20px,2.4vw,28px)] font-medium tracking-tight hover:text-primary"
              >
                {site.email}
                <ArrowUpRight className="arrow arrow-up size-6 text-primary" aria-hidden />
              </a>
            </Reveal>
          )}

          {/* Channel cards */}
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {channels.map(({ label, href, icon: Icon, external, tile }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? newTab : {})}
                  className="group flex items-center justify-between gap-3 rounded-2xl border bg-card/80 p-3 shadow-[0_1px_2px_rgb(10_37_64/0.04)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(10_37_64/0.2)] md:p-4"
                >
                  <span className="flex items-center gap-3 text-[16px] font-medium">
                    <span className={cn("flex size-10 items-center justify-center rounded-xl text-ink", tile)}>
                      <Icon className="size-[18px]" />
                    </span>
                    {label}
                  </span>
                  <ArrowUpRight
                    className="arrow arrow-up size-5 text-muted-foreground group-hover:text-primary"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-12 md:py-20">
            <div className="col-span-2 md:col-span-5">
              <p className="max-w-[34ch] text-[16px] leading-relaxed text-body">
                Backend engineer building dependable systems for real institutions. {site.location}, open to
                relocation.
              </p>
            </div>
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="md:col-span-3">
                <p className="meta">{col.title}</p>
                <ul className="mt-5 space-y-3 text-[16px]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-body transition-colors hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Giant gradient wordmark, cropped by the bottom bar */}
        <div className={cn(container, "pointer-events-none select-none")} aria-hidden>
          <p className="joy-text -mb-[0.2em] text-[clamp(120px,30vw,400px)] font-semibold leading-[0.85] tracking-[-0.065em]">
            Hope.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t bg-card/70 backdrop-blur">
          <div
            className={cn(
              container,
              "flex flex-col items-start gap-4 py-6 text-[13px] text-muted-foreground md:flex-row md:items-center md:justify-between",
            )}
          >
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>© 2026 {site.name}</span>
              {analyticsEnabled && (
                <button type="button" onClick={openConsentSettings} className="underline-offset-4 hover:text-primary hover:underline">
                  Cookie settings
                </button>
              )}
            </span>
            <ThemeSwitcher />
            <a href="#top" className="hover:text-primary">
              Back to top <span className="arrow arrow-up" aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
