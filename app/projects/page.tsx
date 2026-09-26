import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import { PageHeader, ProjectCard, container } from "@/components/site";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work — Hope Tuyishime",
  description: "Case studies: Trustplot, land and property intelligence for Rwanda, and DocFlow, an asynchronous AI document-processing backend.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Work — Hope Tuyishime", description: "Case studies: Trustplot, land and property intelligence for Rwanda, and DocFlow, an asynchronous AI document-processing backend.", url: "/projects" },
};

export default function WorkPage() {
  return (
    <main id="top">
      <PageHeader
        label="Work"
        title="Systems built for people who depend on them."
        intro="A property-intelligence platform I founded, and an asynchronous document-processing backend built in the open."
      />
      <section className={`${container} pb-24 md:pb-40`}>
        <div className="space-y-16 md:space-y-24">
          {projects.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
