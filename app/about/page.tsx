import type { Metadata } from "next";
import { CapabilitiesGrid, ContactCTA, ExperienceList, Portrait, SectionLabel, container } from "@/components/site";

export const metadata: Metadata = { title: "About — Hope Tuyishime" };

export default function AboutPage() {
  return (
    <main id="top">
      <section className={`${container} pt-24 pb-24 md:pt-32 md:pb-40`}>
        <p className="meta mb-8">About</p>
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <h1 className="text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1] tracking-[-0.02em]">
              I like problems where software has to keep working after the demo.
            </h1>
            <div className="mt-8 max-w-xl space-y-5 text-[18px] leading-relaxed text-body">
              <p>
                Messy data, long-running jobs, integrations, and people who depend on it. That&apos;s the work
                I&apos;m drawn to.
              </p>
              <p>[TODO] Your path: Andela, AUCA Innovation Center, NetFella, then IFAD in Rome.</p>
              <p>[TODO] Why you founded Trustplot and what it taught you.</p>
              <p>[TODO] What you want to work on next, and that you&apos;re open to relocating.</p>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Portrait />
          </div>
        </div>
      </section>

      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="01">Capabilities</SectionLabel>
          <CapabilitiesGrid />
        </div>
      </section>

      <section className="section border-t">
        <div className={container}>
          <SectionLabel n="02">Experience</SectionLabel>
          <ExperienceList />
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
