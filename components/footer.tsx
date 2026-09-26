"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import Reveal from "@/components/reveal";
import ThemeSwitcher from "@/components/theme-switcher";
import { container } from "@/components/site";
import { cn } from "@/lib/utils";
import { posts, projects, site } from "@/lib/content";
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
};

const channels: Channel[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon, external: true },
  { label: "GitHub", href: site.github, icon: GitHubIcon, external: true },
  { label: "Résumé", href: site.resume, icon: FileText, external: true },
];

const columns = [
  {
    title: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/projects", label: "Work" },
      { href: "/about", label: "About" },
      ...(posts.length ? [{ href: "/blogs", label: "Blogs" }] : []),
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
    // Follows the site theme: white in light mode, deep navy in dark mode.
    <footer className="relative isolate overflow-hidden border-t bg-card text-foreground dark:bg-[#0b1536]">
      <div aria-hidden className="dawn-band pointer-events-none absolute inset-x-0 top-0 -z-10 h-56" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent dark:via-white/25" />

      <div className={cn(container, "pt-24 md:pt-32")}>
        {showPitch && (
          <Reveal className="mb-20 md:mb-28">
            <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">Contact</p>
            <h2 className="mt-6 max-w-[14ch] text-[clamp(44px,7vw,104px)] leading-[0.96] font-semibold tracking-[-0.04em] text-ink">
              Building something that has to work?
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[16px] font-semibold text-background transition-transform hover:-translate-y-0.5 motion-reduce:transform-none dark:bg-white dark:text-[#0b1536]"
              >
                Let&apos;s talk <span className="arrow arrow-right" aria-hidden>→</span>
              </a>
              <a href={`mailto:${site.email}`} className="font-mono text-[15px] text-body hover:text-ink">
                {site.email}
              </a>
            </div>
          </Reveal>
        )}

        {/* Channels */}
        <ul className="grid grid-cols-2 border-t border-l md:grid-cols-4">
          {channels.map(({ label, href, icon: Icon, external }) => (
            <li key={label} className="border-r border-b">
              <a
                href={href}
                {...(external ? newTab : {})}
                className="group flex items-center justify-between gap-3 px-4 py-5 transition-colors hover:bg-muted md:px-6 dark:hover:bg-white/[0.05]"
              >
                <span className="flex items-center gap-3 text-[16px] text-ink">
                  <Icon className="size-[18px] text-body" />
                  {label}
                </span>
                <ArrowUpRight className="arrow arrow-up size-5 text-muted-foreground group-hover:text-primary" aria-hidden />
              </a>
            </li>
          ))}
        </ul>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-12 md:py-20">
          <p className="col-span-2 max-w-[34ch] text-[16px] leading-relaxed text-body md:col-span-6">
            Backend engineer building dependable systems for real institutions. {site.location} · open to relocation.
          </p>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-3">
              <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">{col.title}</p>
              <ul className="mt-5 space-y-3 text-[16px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-body transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div
          className={cn(
            container,
            "flex flex-col items-start gap-4 py-6 text-[13px] text-muted-foreground md:flex-row md:items-center md:justify-between",
          )}
        >
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 {site.name}</span>
            {analyticsEnabled && (
              <button type="button" onClick={openConsentSettings} className="underline-offset-4 hover:text-ink hover:underline">
                Cookie settings
              </button>
            )}
          </span>
          <ThemeSwitcher />
          <a href="#top" className="hover:text-ink">
            Back to top <span className="arrow arrow-up" aria-hidden>↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
