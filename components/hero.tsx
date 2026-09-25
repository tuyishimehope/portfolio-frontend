import Image from "next/image";
import { ArrowDown, ArrowUpRight, Briefcase, Database, Server, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { container } from "@/components/site";
import { cn } from "@/lib/utils";
import { site } from "@/lib/content";

/*
  Full-bleed "space" hero in the auth pages' palette: deep navy with a blue
  glow from above, faint stars and orbits, glass surfaces, and the
  periwinkle → cyan gradient on the main action. It runs up under the
  transparent header (data-dark-hero tells the header to switch to white).
*/

const after = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const enter = "animate-in fade-in fill-mode-both duration-700 motion-reduce:animate-none";

const focus = [
  { icon: Server, title: "APIs", text: "FastAPI · Spring Boot" },
  { icon: Database, title: "Data", text: "PostgreSQL · queues" },
  { icon: Sparkles, title: "AI", text: "LLM applications" },
  { icon: Briefcase, title: "Previously", text: "IFAD, Rome" },
];


export default function Hero() {
  return (
    <section data-dark-hero className="auth-page relative isolate -mt-16 overflow-hidden rounded-b-[32px] pt-16 md:rounded-b-[48px] dark:border-b dark:border-white/10">
      <div aria-hidden className="auth-stars pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="auth-orbit auth-orbit-one" />
      <div aria-hidden className="auth-orbit auth-orbit-two" />

      <div
        className={cn(
          container,
          "grid gap-12 pt-14 pb-16 md:pt-20 lg:min-h-[calc(92vh-4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:pb-20",
        )}
      >
        {/* Copy */}
        <div>
          <p
            className={cn(enter, "slide-in-from-bottom-4 mb-5 text-[11px] font-medium tracking-[0.22em] text-[#a9d8ff] uppercase")}
            style={after(100)}
          >
            Backend engineer · Kigali
          </p>
          <h1
            className={cn(enter, "slide-in-from-bottom-4 text-[clamp(42px,5.8vw,82px)] font-semibold leading-[1.02] tracking-[-0.035em]")}
            style={after(200)}
          >
            Building reliable systems <span className="space-gradient-text">for real-world problems.</span>
          </h1>
          <p
            className={cn(enter, "slide-in-from-bottom-4 mt-7 max-w-xl text-[19px] leading-relaxed text-[#b8c4d9]")}
            style={after(350)}
          >
            I&apos;m Hope. I design and build backend systems, asynchronous workflows, and AI-powered products,
            from architecture to deployment.
          </p>
          <p
            className={cn(enter, "mt-6 font-mono text-[12px] tracking-[0.08em] text-[#95a7c7] uppercase")}
            style={after(450)}
          >
            Kigali, Rwanda · Open to relocation · Previously IFAD
          </p>
          <div className={cn(enter, "slide-in-from-bottom-4 mt-9 flex flex-wrap gap-3")} style={after(550)}>
            <a
              href="#work"
              className="auth-submit group inline-flex h-14 items-center gap-2.5 rounded-full px-7 text-[15px] font-semibold"
            >
              Selected work
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="auth-social group h-14 px-6 text-[15px]"
            >
              Résumé
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>
        </div>

        {/* Portrait in a glass frame */}
        <div className={cn(enter, "zoom-in-95 relative mx-auto w-full max-w-[520px] lg:max-w-none")} style={after(250)}>
          <div className="auth-card rounded-[32px] p-2.5 sm:p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] lg:aspect-[5/6]">
              <div className="animate-drift absolute inset-0 origin-[50%_30%] motion-reduce:animate-none">
                <Image
                  src="/hope-photo.jpg"
                  alt="Portrait of Hope Tuyishime"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-[50%_18%]"
                />
              </div>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060c17] via-[#060c17]/60 to-transparent" />

              <span
                className={cn(enter, "absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-[#060c17]/50 px-3 py-1.5 text-xs backdrop-blur-md")}
                style={after(700)}
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#80e9ff] opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#80e9ff]" />
                </span>
                Open to relocation
              </span>

              {/* Floating glass card */}
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                <div className={cn(enter, "slide-in-from-bottom-6 duration-1000")} style={after(900)}>
                  <div className="auth-card animate-float rounded-3xl p-4 motion-reduce:animate-none">
                    <div className="flex items-center gap-3">
                      <span className="auth-emblem flex size-11 shrink-0 items-center justify-center rounded-2xl">
                        <Image src="/trustplot-logo.png" alt="Trustplot logo" width={32} height={32} className="size-8" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-[#a9b5cb]">Currently building</p>
                        <p className="text-[17px] font-semibold tracking-tight">Trustplot</p>
                      </div>
                      <span className="rounded-full border border-[#80e9ff40] bg-[#80e9ff15] px-2.5 py-0.5 text-[11px] font-medium text-[#a9eaff]">
                        Founder
                      </span>
                    </div>
                    <ul className="mt-3.5 hidden grid-cols-2 gap-2 sm:grid">
                      {focus.map(({ icon: Icon, title, text }, i) => (
                        <li
                          key={title}
                          className={cn(enter, "zoom-in-95 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5")}
                          style={after(1150 + i * 110)}
                        >
                          <Icon className="size-4 shrink-0 text-[#a9eaff]" aria-hidden />
                          <span className="min-w-0 leading-tight">
                            <strong className="block text-[13px] font-semibold">{title}</strong>
                            <span className="block truncate text-[11px] text-[#a9b5cb]">{text}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
