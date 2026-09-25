import type { Metadata } from "next";
import { container } from "@/components/ui";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Contact — Hope Tuyishime" };

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "LinkedIn", value: "LinkedIn profile", href: site.linkedin },
  { label: "GitHub", value: "GitHub profile", href: site.github },
  { label: "Résumé", value: "Download PDF", href: site.resume },
];

export default function ContactPage() {
  return (
    <main id="top" className={`${container} flex min-h-[80vh] flex-col justify-center py-24`}>
      <p className="meta mb-8">Contact</p>
      <h1 className="max-w-[16ch] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.03em]">
        Building something that has to work?
      </h1>
      <p className="mt-8 max-w-2xl text-[20px] leading-relaxed text-muted">
        Based in {site.location} and open to relocation. The fastest way to reach me is email.
      </p>
      <a
        href={`mailto:${site.email}`}
        className="mt-10 self-start rounded-full bg-accent px-6 py-3 text-[16px] text-background transition-opacity hover:opacity-90"
      >
        Let&apos;s talk <span className="arrow arrow-right" aria-hidden>→</span>
      </a>
      <dl className="mt-20 border-t border-border">
        {channels.map((c) => (
          <div key={c.label} className="grid gap-1 border-b border-border py-5 md:grid-cols-12 md:gap-8">
            <dt className="meta md:col-span-3 md:pt-1">{c.label}</dt>
            <dd className="md:col-span-9">
              <a href={c.href} className="hover:text-accent">
                {c.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
