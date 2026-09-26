"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires once when a reader reaches the end of an article.
export default function ReadTracker({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const started = Date.now();
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      track("post_read_complete", { slug, seconds: Math.round((Date.now() - started) / 1000) });
      io.disconnect();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);
  return <div ref={ref} aria-hidden className="h-px" />;
}
