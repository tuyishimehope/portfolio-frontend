import type { Metadata } from "next";
import { ArrowUpRight, Code2, FileText, Mail, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { after, container, enter, pillPrimary } from "@/components/site";
import { cn } from "@/lib/utils";
import { facts, site } from "@/lib/content";

const description =
  "Get in touch with Hope Tuyishime, backend engineer in Kigali, open to relocation. Email, LinkedIn, GitHub and résumé.";

export const metadata: Metadata = {
  title: "Contact — Hope Tuyishime",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Hope Tuyishime", description, url: "/contact" },
};

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail, external: false },
  { label: "LinkedIn", value: "hope-tuyishime", href: site.linkedin, icon: UserRound, external: true },
  { label: "GitHub", value: "tuyishimehope", href: site.github, icon: Code2, external: true },
  { label: "Résumé", value: "PDF, one page", href: site.resume, icon: FileText, external: true },
];

const emblem =
  "flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 shadow-[0_0_24px_-6px] shadow-primary/30";

export default function ContactPage() {
  return (
    <main id="top" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 -z-10 size-[600px] max-w-full rounded-full bg-primary/8 blur-3xl"
      />
      <section className={`${container} grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-start lg:gap-16`}>
        {/* Pitch */}
        <div className="min-w-0 lg:sticky lg:top-28">
          <p className={cn(enter, "eyebrow mb-6")}>Contact</p>
          <h1
            className={cn(enter, "text-[clamp(40px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em]")}
            style={after(120)}
          >
            Building something that has to work?
          </h1>
          <p className={cn(enter, "mt-6 max-w-md text-xl leading-relaxed text-body")} style={after(240)}>
            I&apos;m looking for a backend role where reliability and data are the job. Email is the fastest way to
            reach me.
          </p>
          <div className={cn(enter, "mt-9")} style={after(360)}>
            <Button asChild size="lg" className={pillPrimary}>
              <a href={`mailto:${site.email}`}>
                Email me <span className="arrow arrow-right" aria-hidden>→</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Channels */}
        <div className={cn(enter, "min-w-0 space-y-3")} style={after(300)}>
          {channels.map(({ label, value, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_28px_-14px_rgb(10_37_64/0.25)] motion-reduce:transform-none sm:p-6"
            >
              <span className={emblem}>
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold">{label}</span>
                <span className="mt-1 block break-words text-sm text-body">{value}</span>
              </span>
              <ArrowUpRight
                className="size-5 shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </a>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 sm:p-6">
            <span className={emblem}>
              <MapPin className="size-5 text-primary" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold">{site.location}</p>
              <p className="mt-1 text-sm text-body">{facts.sponsorship}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
