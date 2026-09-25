import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, UserRound } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { after, container, enter } from "@/components/site";
import { cn } from "@/lib/utils";
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
          <p className={cn(enter, "eyebrow mb-6")}>Contact</p>
          <h1 className={cn(enter, "text-[clamp(40px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em]")} style={after(120)}>Get in touch.</h1>
          <p className={cn(enter, "mt-6 max-w-md text-xl leading-relaxed text-body")} style={after(240)}>
            Have a project in mind or an opportunity to share? I’d love to hear what you’re building.
          </p>
          <div className={cn(enter, "mt-10 space-y-3 lg:mt-14")} style={after(360)}>
            {channels.map(({ label, value, href, icon: Icon }) => (
              <a key={label} href={href} className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_28px_-14px_rgb(10_37_64/0.25)] motion-reduce:transform-none sm:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 shadow-[0_0_24px_-6px] shadow-primary/30"><Icon className="size-5 text-primary" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">{label}</span>
                  <span className="mt-1 block break-words text-sm text-body">{value}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
              </a>
            ))}
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 sm:p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 shadow-[0_0_24px_-6px] shadow-primary/30"><MapPin className="size-5 text-primary" aria-hidden="true" /></span>
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
        <div className={cn(enter, "zoom-in-95 min-w-0")} style={after(300)}>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
