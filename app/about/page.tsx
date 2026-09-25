import type { Metadata } from "next";
import { CapabilitiesGrid, ExperienceList, Portrait, SectionLabel, container } from "@/components/site";

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
              <p>
                I started with multi-tenant Node.js and PostgreSQL APIs at Andela, then built real-time
                telemetry pipelines at NetFella and Spring Boot services for academic and financial systems at
                the AUCA Innovation Center (Mastercard Program). At IFAD, the UN&apos;s International Fund for
                Agricultural Development in Rome, I built FastAPI services that ingest, read, review and archive
                documents, with background workers on Azure Service Bus and the retry and recovery logic that
                keeps them dependable.
              </p>
              <p>
                In May 2026 I founded Trustplot because land and property information in Rwanda is scattered
                and hard to verify. It brings parcel boundaries, zoning, risk and reference value into one UPI
                search, built on PostGIS and ArcGIS data.
              </p>
              <p>
                I hold a BSc (Honours) in Software Engineering with Distinction from the Adventist University of
                Central Africa. Next, I want to join a backend team working on reliable, data-heavy systems. I&apos;m
                a Rwandan citizen, ready to relocate, and familiar with the EU Blue Card and Dutch Highly Skilled
                Migrant processes.
              </p>
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
    </main>
  );
}
