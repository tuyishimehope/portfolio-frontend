import { ArrowDown, ArrowRight, Database, Zap } from "lucide-react";
import type { Pipeline } from "@/lib/content";
import { cn } from "@/lib/utils";

/*
  Architecture diagram drawn from data, in the site's palette:
  request path (fast) → queue → background stages (slow) → stores.
  `compact` fits inside project-card frames; the full size is for case studies.
*/
export default function PipelineDiagram({
  pipeline,
  label,
  compact = false,
}: {
  pipeline: Pipeline;
  label: string;
  compact?: boolean;
}) {
  const chip = cn(
    "rounded-lg border bg-card font-medium text-ink shadow-[0_1px_2px_rgb(10_37_64/0.06)]",
    compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-[13px]",
  );
  const laneLabel = cn("font-mono uppercase tracking-[0.1em] text-muted-foreground", compact ? "text-[9px]" : "text-[11px]");
  const arrow = cn("shrink-0 text-muted-foreground", compact ? "size-3" : "size-3.5");

  return (
    <figure role="img" aria-label={label} className={cn("w-full", compact ? "space-y-2" : "space-y-3")}>
      {/* Request path */}
      <div className={cn("rounded-xl border border-dashed bg-card/60", compact ? "p-2.5" : "p-4")}>
        <p className={cn(laneLabel, "mb-2 flex items-center gap-1.5")}>
          <Zap className={compact ? "size-2.5" : "size-3"} aria-hidden /> In the request
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {pipeline.request.map((step, i) => (
            <span key={step} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className={arrow} aria-hidden />}
              <span className={chip}>{step}</span>
            </span>
          ))}
          <ArrowRight className={arrow} aria-hidden />
          <span
            className={cn(
              "rounded-lg border border-primary/30 bg-primary/10 font-semibold text-primary",
              compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-[13px]",
            )}
          >
            {pipeline.response}
          </span>
        </div>
      </div>

      {/* Queue */}
      <div className="flex items-center gap-2 pl-4">
        <ArrowDown className={arrow} aria-hidden />
        <span
          className={cn(
            "rounded-full bg-gradient-to-r from-[#8fa8ff] to-[#56dff5] font-semibold text-[#06152a] shadow-[0_4px_16px_-6px_rgb(80_70_228/0.6)]",
            compact ? "px-2.5 py-0.5 text-[10px]" : "px-3.5 py-1 text-[12px]",
          )}
        >
          {pipeline.queue}
        </span>
        <ArrowDown className={arrow} aria-hidden />
      </div>

      {/* Background stages */}
      <div className={cn("rounded-xl border bg-card/80", compact ? "p-2.5" : "p-4")}>
        <p className={cn(laneLabel, "mb-2")}>Background workers</p>
        <ol className="flex flex-wrap items-center gap-1.5">
          {pipeline.stages.map((stage, i) => (
            <li key={stage} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className={arrow} aria-hidden />}
              <span className={cn(chip, "flex items-center gap-1.5")}>
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full bg-primary/10 font-mono text-primary",
                    compact ? "size-3.5 text-[8px]" : "size-4 text-[10px]",
                  )}
                >
                  {i + 1}
                </span>
                {stage}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Stores */}
      <div className="flex flex-wrap items-center gap-2 pl-1">
        <span className={laneLabel}>Stores</span>
        {pipeline.stores.map((store) => (
          <span key={store} className={cn(chip, "flex items-center gap-1.5")}>
            <Database className={compact ? "size-3" : "size-3.5"} aria-hidden />
            {store}
          </span>
        ))}
      </div>
    </figure>
  );
}
