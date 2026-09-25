import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, UserRound } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { container } from "@/components/site";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Contact — Hope Tuyishime" };

const channels = [
  { label: "Email me", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "Connect on LinkedIn", value: "Let’s stay in touch", href: site.linkedin, icon: UserRound },
];

export default function ContactPage() {
  return (
    <main id="top" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-0 -z-10 size-[600px] max-w-full rounded-full bg-primary/8 blur-3xl" />
      <section className={`${container} grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-start lg:gap-16`}>
        <div className="min-w-0">
          <p className="meta mb-6">Contact</p>
          <h1 className="text-[clamp(40px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em]">Get in touch.</h1>
          <p className="mt-6 max-w-md text-xl leading-relaxed text-body">
            Have a project in mind or an opportunity to share? I’d love to hear what you’re building.
          </p>
          <div className="mt-10 space-y-3 lg:mt-14">
            {channels.map(({ label, value, href, icon: Icon }) => (
              <a key={label} href={href} className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50 sm:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted"><Icon className="size-5 text-primary" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">{label}</span>
                  <span className="mt-1 block break-words text-sm text-body">{value}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
              </a>
            ))}
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 sm:p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted"><MapPin className="size-5 text-primary" aria-hidden="true" /></span>
              <div>
                <p className="text-base font-semibold">{site.location}</p>
                <p className="mt-1 text-sm text-body">Open to relocation</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-6 text-sm text-body">
            <a href={site.github} className="hover:text-primary">GitHub ↗</a>
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Download résumé ↗</a>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
