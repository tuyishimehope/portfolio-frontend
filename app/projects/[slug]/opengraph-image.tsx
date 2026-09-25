import { ogSize, renderOgImage } from "@/lib/og";
import { projects } from "@/lib/content";

export const alt = "Case study by Hope Tuyishime";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return renderOgImage({
    eyebrow: project ? ["Case study", project.year].filter(Boolean).join(" · ") : "Case study",
    title: project?.title ?? "Case study",
    subtitle: project?.problem ?? "",
  });
}
