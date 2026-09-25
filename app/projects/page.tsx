import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import { ContactCTA, PageHeader, ProjectCard, container } from "@/components/ui";
import { flagship, secondary } from "@/lib/content";

export const metadata: Metadata = { title: "Work — Hope Tuyishime" };

export default function WorkPage() {
  return (
    <main id="top">
      <PageHeader
        label="Work"
        title="Systems built for people who depend on them."
        intro="A founder-built property platform, a document-processing backend, and an LLM tool shipped inside an organization's constraints."
      />
      <section className={`${container} pb-24 md:pb-40`}>
        <Reveal>
          <ProjectCard project={flagship} flagship />
        </Reveal>
        <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-8">
          {secondary.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>
      <ContactCTA />
    </main>
  );
}
