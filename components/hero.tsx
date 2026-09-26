import type { CSSProperties } from "react";
import SystemCanvas from "@/components/system-canvas";
import { Button } from "@/components/ui/button";
import { container, pillPrimary } from "@/components/site";
import { cn } from "@/lib/utils";

/*
  Hero: one message, one visual idea.
  Warm-white canvas, readable type on the left; the dawn glow lives only behind
  the interactive system on the right. The portrait now lives in About.
*/

const after = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const enter = "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 motion-reduce:animate-none";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className={cn(
          container,
          "grid gap-12 pt-12 pb-16 md:pt-16 lg:min-h-[calc(90vh-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:items-center lg:gap-14 lg:pb-20",
        )}
      >
        {/* Copy */}
        <div className="relative z-10">
          <p className={cn(enter, "font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase")} style={after(80)}>
            Software engineer · Backend · Distributed systems · AI
          </p>
          <h1
            className={cn(enter, "mt-6 text-[clamp(48px,6vw,92px)] leading-[0.97] font-semibold tracking-[-0.035em] text-ink")}
            style={after(160)}
          >
            Building reliable{" "}
            <span className="font-serif font-normal tracking-[-0.01em] italic">systems</span> for real-world problems.
          </h1>
          <p className={cn(enter, "mt-7 max-w-[540px] text-[19px] leading-[1.55] text-body")} style={after(280)}>
            I&apos;m Hope. I design and build backend systems, distributed workflows and AI products, from architecture
            to deployment.
          </p>
          <div className={cn(enter, "mt-9")} style={after(380)}>
            <Button asChild size="lg" className={pillPrimary}>
              <a href="#work">
                Explore my work <span className="arrow arrow-right" aria-hidden>→</span>
              </a>
            </Button>
          </div>
          <p className={cn(enter, "mt-9 font-mono text-[13px] text-muted-foreground")} style={after(460)}>
            Kigali · Open to relocation
          </p>
        </div>

        {/* Interactive system, floating over the dawn */}
        <div className={cn(enter, "zoom-in-95 relative")} style={after(220)}>
          <div aria-hidden className="dawn-glow pointer-events-none absolute -inset-[30%] -z-10 blur-2xl" />
          <div className="h-[520px] sm:h-[500px]">
            <SystemCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
