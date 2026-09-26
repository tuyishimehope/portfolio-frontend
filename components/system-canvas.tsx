"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check, RotateCcw, Zap } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/*
  Live system canvas (hero).

  1. A short intro (~9 s): feature request → spec → architecture → code + AI agent
     → tests → deploy. Then it stops.
  2. A live job system: API → queue → three workers. Visitors can crash a worker
     and watch the job time out, get retried on a healthy worker, and complete.

  Colours carry meaning: spec = sky · architecture = cobalt · code = orange ·
  AI agent = pink · processing/retry = sun · healthy/done = green · failure = coral.
*/

type WorkerStatus = "idle" | "busy" | "offline";
type Job = { id: number; retry: boolean };
type Worker = { status: WorkerStatus; job: Job | null; flash: boolean };
type Point = { x: number; y: number }; // percentages of the stage
type Packet = { id: number; from: Point; to: Point; tone: "cobalt" | "sun" };
type LogLine = { id: number; text: string; tone: "coral" | "sun" | "green" | "ink" };

const STAGES = [
  { label: "Feature request", detail: "“Uploads time out when documents are large.”", color: "var(--ink)" },
  { label: "Specification", detail: "Accept in under 200 ms · process in the background · never lose a job", color: "var(--sky)" },
  { label: "Architecture", detail: "API → queue → workers, with retries and recovery", color: "var(--primary)" },
  { label: "Implementation + agent", detail: "worker.process(job) · an AI agent drafts edge-case tests", color: "var(--orange)", agent: true },
  { label: "Tests", detail: "All checks passing", color: "var(--green)" },
  { label: "Deploy", detail: "Rolled out · health checks green", color: "var(--green)" },
] as const;

const STEP_MS = 1500;
const TRAVEL_MS = 650;
const WORK_MS = 1600;
const SPAWN_MS = 1700;

const API: Point = { x: 50, y: 13 };
const QUEUE: Point = { x: 50, y: 44 };
const WORKERS: Point[] = [
  { x: 17, y: 80 },
  { x: 50, y: 80 },
  { x: 83, y: 80 },
];

// Jobs travel edge-to-edge between nodes, never over their labels.
const API_OUT: Point = { x: 50, y: 20 };
const QUEUE_IN: Point = { x: 50, y: 35 };
const QUEUE_OUT: Point = { x: 50, y: 53 };
const WORKER_IN = WORKERS.map((w) => ({ x: w.x, y: w.y - 11 }));

const pad = (n: number) => String(n).padStart(3, "0");
const toneVar: Record<LogLine["tone"], string> = {
  coral: "var(--coral)",
  sun: "var(--sun)",
  green: "var(--green)",
  ink: "var(--muted-foreground)",
};

type View = {
  queued: number;
  workers: Worker[];
  packets: Packet[];
  log: LogLine[];
  completed: number;
  recovered: boolean;
};

const EMPTY_VIEW: View = {
  queued: 0,
  workers: WORKERS.map(() => ({ status: "idle", job: null, flash: false })),
  packets: [],
  log: [],
  completed: 0,
  recovered: false,
};

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SystemCanvas() {
  const [phase, setPhase] = useState<"intro" | "live">("intro");
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  // Mutable simulation, re-rendered on demand.
  const sim = useRef({
    queue: [] as Job[],
    workers: WORKERS.map<Worker>(() => ({ status: "idle", job: null, flash: false })),
    packets: [] as Packet[],
    log: [] as LogLine[],
    seq: 41,
    completed: 0,
    uid: 0,
    recovered: false,
  });
  // What the UI draws: a snapshot of the simulation, published after each change.
  const [view, setView] = useState<View>(EMPTY_VIEW);
  const render = useCallback(() => {
    const s = sim.current;
    setView({
      queued: s.queue.length,
      workers: s.workers.map((w) => ({ ...w })),
      packets: s.packets,
      log: s.log,
      completed: s.completed,
      recovered: s.recovered,
    });
  }, []);
  const timers = useRef(new Set<number>());

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // Pause when off-screen or the tab is hidden.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden));
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // ---- Intro ---------------------------------------------------------------
  useEffect(() => {
    if (phase !== "intro") return;
    if (reducedMotion()) {
      // Reduced motion: no intro, straight to the live system.
      const id = window.setTimeout(() => setPhase("live"), 0);
      return () => window.clearTimeout(id);
    }
    if (!visible) return;
    const id = window.setTimeout(() => {
      if (step < STAGES.length - 1) setStep(step + 1);
      else setPhase("live");
    }, step === STAGES.length - 1 ? STEP_MS + 600 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [phase, step, visible]);

  // ---- Live simulation -----------------------------------------------------
  const log = useCallback((text: string, tone: LogLine["tone"]) => {
    const s = sim.current;
    s.log = [...s.log, { id: ++s.uid, text, tone }].slice(-3);
  }, []);

  const send = useCallback(
    (from: Point, to: Point, tone: Packet["tone"]) => {
      const s = sim.current;
      const packet = { id: ++s.uid, from, to, tone };
      s.packets = [...s.packets, packet];
      later(() => {
        s.packets = s.packets.filter((p) => p.id !== packet.id);
        render();
      }, TRAVEL_MS + 50);
    },
    [later, render],
  );

  // dispatch re-invokes itself when a worker frees up; go through a ref to do that.
  const dispatchRef = useRef<() => void>(() => {});
  const dispatch = useCallback(() => {
    const s = sim.current;
    s.workers.forEach((w, i) => {
      if (w.status !== "idle" || s.queue.length === 0) return;
      const job = s.queue.shift()!;
      w.status = "busy";
      w.job = job;
      send(QUEUE_OUT, WORKER_IN[i], job.retry ? "sun" : "cobalt");
      later(() => {
        // Only complete if this worker still holds this job (it may have crashed).
        if (w.status !== "busy" || w.job?.id !== job.id) return;
        s.completed += 1;
        w.status = "idle";
        w.job = null;
        w.flash = true;
        if (job.retry) {
          log(`Completed ✓ job #${pad(job.id)} on Worker ${i + 1}`, "green");
          s.recovered = true;
        }
        later(() => {
          w.flash = false;
          render();
        }, 450);
        dispatchRef.current();
        render();
      }, TRAVEL_MS + WORK_MS);
    });
    render();
  }, [later, log, render, send]);

  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  const spawn = useCallback(() => {
    const s = sim.current;
    const job = { id: ++s.seq, retry: false };
    send(API_OUT, QUEUE_IN, "cobalt");
    later(() => {
      s.queue.push(job);
      dispatch();
    }, TRAVEL_MS);
    render();
  }, [dispatch, later, render, send]);

  useEffect(() => {
    if (phase !== "live" || !visible) return;
    spawn();
    const id = window.setInterval(spawn, SPAWN_MS);
    return () => window.clearInterval(id);
  }, [phase, visible, spawn]);

  const healthy = view.workers.filter((w) => w.status !== "offline").length;

  const crash = useCallback(
    (index?: number) => {
      const s = sim.current;
      // Prefer a worker that is mid-job, so the recovery is visible.
      const i =
        index ??
        (() => {
          const busy = s.workers.findIndex((w) => w.status === "busy");
          return busy >= 0 ? busy : s.workers.findIndex((w) => w.status !== "offline");
        })();
      const w = s.workers[i];
      if (!w || w.status === "offline") return;
      if (s.workers.filter((x) => x.status !== "offline").length <= 1) return; // keep one alive

      track("demo_worker_crashed", { worker: i + 1 });
      const lost = w.job;
      w.status = "offline";
      w.job = null;
      s.recovered = false;
      log(`Worker ${i + 1} crashed`, "coral");

      if (lost) {
        later(() => {
          log(`Timeout detected · job #${pad(lost.id)}`, "sun");
          render();
        }, 1100);
        later(() => {
          log("Retry scheduled", "sun");
          s.queue.unshift({ id: lost.id, retry: true });
          dispatch();
        }, 1900);
      } else {
        later(() => {
          log("No job in flight · the queue keeps flowing", "ink");
          render();
        }, 800);
      }

      later(() => {
        w.status = "idle";
        log(`Worker ${i + 1} restarted`, "green");
        dispatch();
      }, 7000);
      render();
    },
    [dispatch, later, log, render],
  );

  const replay = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
    sim.current = {
      queue: [],
      workers: WORKERS.map(() => ({ status: "idle", job: null, flash: false })),
      packets: [],
      log: [],
      seq: 41,
      completed: 0,
      uid: 0,
      recovered: false,
    };
    setView(EMPTY_VIEW);
    setStep(0);
    setPhase("intro");
  };

  const s = view;

  return (
    <div
      ref={root}
      role="region"
      aria-label="Interactive demo: a job queue with three workers. Crash a worker and watch the job recover."
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-40px_rgb(11_21_54/0.35)]"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b px-4 py-3 md:px-5">
        <p className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
          <span className="relative flex size-2">
            {phase === "live" && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60 motion-reduce:hidden" />
            )}
            <span className={cn("relative inline-flex size-2 rounded-full", phase === "live" ? "bg-green" : "bg-sky")} />
          </span>
          <span className="whitespace-nowrap">
            {phase === "live" ? "live" : "building"}
            <span className="hidden sm:inline"> · document-pipeline</span>
          </span>
        </p>
        <div className="flex items-center gap-3 font-mono text-[12px] text-muted-foreground">
          {phase === "live" ? (
            <>
              <span className="whitespace-nowrap">
                done <span className="text-ink">{s.completed}</span>
              </span>
              <button
                type="button"
                onClick={replay}
                className="inline-flex min-h-8 items-center gap-1 rounded-full px-2 hover:bg-muted hover:text-ink"
                aria-label="Replay the intro"
              >
                <RotateCcw className="size-3.5" aria-hidden /> replay
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setPhase("live")}
              className="inline-flex min-h-8 items-center rounded-full px-2 hover:bg-muted hover:text-ink"
            >
              skip intro →
            </button>
          )}
        </div>
      </div>

      {phase === "intro" ? (
        <ol className="flex flex-1 flex-col justify-center gap-1.5 p-4 md:p-6" aria-live="polite">
          {STAGES.map((stage, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li
                key={stage.label}
                className={cn(
                  "rounded-2xl border px-3.5 py-2.5 transition-all duration-500",
                  active ? "bg-background shadow-[0_8px_24px_-16px_rgb(11_21_54/0.4)]" : "border-transparent",
                  !done && !active && "opacity-40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ background: done || active ? stage.color : "var(--border)" }}
                  >
                    {done ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  <span className={cn("text-[14px] font-medium", active ? "text-ink" : "text-body")}>{stage.label}</span>
                  {"agent" in stage && active && (
                    <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[11px] font-medium text-ink ring-1 ring-pink/40">
                      AI agent
                    </span>
                  )}
                </div>
                {active && (
                  <div className="mt-2 pl-8">
                    <p className="text-[13px] leading-snug text-body">{stage.detail}</p>
                    <span className="mt-2 block h-1 overflow-hidden rounded-full bg-muted">
                      <span
                        key={step}
                        className="block h-full origin-left rounded-full"
                        style={{ background: stage.color, animation: `canvas-progress ${STEP_MS}ms linear forwards` } as CSSProperties}
                      />
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="animate-in fade-in flex flex-1 flex-col duration-700 motion-reduce:animate-none">
          {/* Stage */}
          <div className="relative min-h-[260px] flex-1">
            <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
              {[API, ...WORKERS].map((p, i) => (
                <line
                  key={i}
                  x1={QUEUE.x}
                  y1={QUEUE.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--border)"
                  strokeWidth="0.6"
                  strokeDasharray="1.5 1.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {s.packets.map((p) => (
              <PacketDot key={p.id} packet={p} />
            ))}

            <Node at={API} className="px-3 py-1.5">
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
                <Zap className="size-3.5 text-primary" aria-hidden /> API
                <span className="font-mono text-[11px] font-normal text-muted-foreground">POST /documents</span>
              </span>
            </Node>

            <Node at={QUEUE} className="px-3.5 py-2">
              <span className="block font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Job queue</span>
              <span className="mt-0.5 flex items-center gap-2">
                <span className="font-mono text-[15px] font-semibold text-ink">{pad(s.queued).slice(1)}</span>
                <span className="text-[11px] text-body">pending</span>
                <span className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 4 }, (_, i) => (
                    <span
                      key={i}
                      className={cn("h-3 w-1.5 rounded-sm transition-colors", i < s.queued ? "bg-primary" : "bg-muted")}
                    />
                  ))}
                </span>
              </span>
            </Node>

            {s.workers.map((w, i) => {
              const status =
                w.status === "offline" ? "Offline" : w.flash ? "Done" : w.status === "busy" ? (w.job?.retry ? "Retrying" : "Working") : "Healthy";
              const dot =
                w.status === "offline" ? "var(--coral)" : w.flash ? "var(--green)" : w.status === "busy" ? "var(--sun)" : "var(--green)";
              return (
                <Node key={i} at={WORKERS[i]} as="button">
                  <button
                    type="button"
                    onClick={() => crash(i)}
                    disabled={w.status === "offline" || healthy <= 1}
                    title={w.status === "offline" ? `Worker ${i + 1} is restarting` : `Crash Worker ${i + 1}`}
                    aria-label={`Worker ${i + 1}: ${status}. ${w.status === "offline" ? "" : "Press to crash it."}`}
                    className={cn(
                      "block w-[92px] rounded-xl border px-2.5 py-2 text-left transition-[background-color,border-color,box-shadow] duration-300 sm:w-[112px]",
                      w.status === "offline"
                        ? "border-coral/50 bg-coral-50"
                        : w.flash
                          ? "border-green/50 bg-green-50"
                          : "bg-card hover:border-coral/50 hover:shadow-[0_8px_20px_-12px_var(--coral)]",
                    )}
                  >
                    <span className="block text-[12px] font-semibold text-ink">Worker {i + 1}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-body">
                      <span className="size-1.5 rounded-full transition-colors" style={{ background: dot }} />
                      {status}
                    </span>
                  </button>
                </Node>
              );
            })}

            {s.recovered && (
              <p className="animate-in fade-in slide-in-from-bottom-2 absolute inset-x-0 top-[26%] text-center font-serif text-[20px] text-ink italic duration-700 motion-reduce:animate-none sm:text-[22px]">
                Systems fail. Reliable systems recover.
              </p>
            )}
          </div>

          {/* Log + action */}
          <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-end sm:justify-between md:px-5">
            <ul aria-live="polite" className="min-h-[54px] space-y-1 font-mono text-[11.5px] text-body">
              {s.log.length === 0 && <li className="text-muted-foreground">Jobs flowing · 3 workers healthy</li>}
              {s.log.map((l) => (
                <li key={l.id} className="animate-in fade-in flex items-center gap-2 duration-300 motion-reduce:animate-none">
                  <span className="size-1.5 shrink-0 rounded-full" style={{ background: toneVar[l.tone] }} />
                  {l.text}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => crash()}
              disabled={healthy <= 1}
              className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-coral/40 bg-coral-50 px-4 text-[13px] font-medium text-ink transition-colors hover:border-coral disabled:opacity-50"
            >
              <span className="size-1.5 rounded-full bg-coral" aria-hidden />
              Crash a worker
              <span className="arrow arrow-right" aria-hidden>
                →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Node({
  at,
  children,
  className,
  as,
}: {
  at: Point;
  children: ReactNode;
  className?: string;
  as?: "button";
}) {
  return (
    <div
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        as ? "" : "rounded-xl border bg-card shadow-[0_6px_18px_-12px_rgb(11_21_54/0.35)]",
        className,
      )}
      style={{ left: `${at.x}%`, top: `${at.y}%` }}
    >
      {children}
    </div>
  );
}

// A job travelling between two nodes (CSS transition from → to).
function PacketDot({ packet }: { packet: Packet }) {
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setArrived(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  const at = arrived ? packet.to : packet.from;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${at.x}%`,
        top: `${at.y}%`,
        background: packet.tone === "sun" ? "var(--sun)" : "var(--primary)",
        boxShadow: `0 0 0 3px ${packet.tone === "sun" ? "rgb(255 216 77 / 0.35)" : "rgb(54 92 245 / 0.2)"}`,
        transition: `left ${TRAVEL_MS}ms cubic-bezier(.4,0,.2,1), top ${TRAVEL_MS}ms cubic-bezier(.4,0,.2,1)`,
      }}
    />
  );
}
