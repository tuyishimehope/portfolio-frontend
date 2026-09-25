"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONSENT_EVENT, PRIVATE_PATHS, analyticsEnabled, getConsent, isInternal, setConsent } from "@/lib/analytics";

// Small, non-blocking consent card. Shown once (until a choice is made) and
// reopenable from the footer's "Cookie settings".
export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled || isInternal()) return;
    // Read after mount: localStorage isn't available during server rendering.
    const id = window.setTimeout(() => setOpen(getConsent() === "pending"), 800);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(CONSENT_EVENT, reopen);
    };
  }, []);

  if (!open || PRIVATE_PATHS.test(pathname)) return null;

  const choose = (consent: "granted" | "denied") => {
    setConsent(consent);
    setOpen(false);
  };

  return (
    <section
      role="region"
      aria-label="Analytics consent"
      className="animate-in fade-in slide-in-from-bottom-4 fixed right-3 bottom-3 left-3 z-[60] duration-500 motion-reduce:animate-none sm:right-auto sm:left-5 sm:bottom-5 sm:w-[380px]"
    >
      <div className="rounded-2xl border bg-card/95 p-5 shadow-[0_24px_60px_-20px_rgb(10_37_64/0.35)] backdrop-blur-xl dark:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-sky/25 to-primary/10 text-primary">
            <BarChart3 className="size-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Help me improve this site?</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-body">
              I use PostHog to see which pages are useful and to replay visits. Form fields are always hidden, and
              nothing is sold or shared. Allow cookies and replays?
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => choose("granted")} className="btn-glow h-10 flex-1 rounded-full hover:bg-primary-hover">
            Allow
          </Button>
          <Button onClick={() => choose("denied")} variant="outline" className="h-10 flex-1 rounded-full">
            Decline
          </Button>
        </div>
      </div>
    </section>
  );
}
