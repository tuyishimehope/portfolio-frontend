import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Hope Tuyishime, backend engineer building reliable systems for real-world problems";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Backend engineer · Kigali",
    title: "Building reliable systems for real-world problems.",
    subtitle: "APIs, asynchronous workflows and AI-powered products, from architecture to deployment.",
  });
}
