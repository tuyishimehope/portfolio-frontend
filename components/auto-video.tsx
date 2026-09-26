"use client";

import { useEffect, useRef } from "react";

// Muted looping clip that only plays while on screen, and never autoplays
// for visitors who prefer reduced motion (they get the first frame, or controls).
export default function AutoVideo({
  src,
  label,
  controls = false,
  poster,
  className,
}: {
  src: string;
  label: string;
  controls?: boolean;
  poster?: string; // shown until the first frame is ready
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={`${src}#t=0.1`}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      controls={controls}
      className={className}
    />
  );
}
