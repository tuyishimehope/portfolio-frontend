"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, RotateCcw } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/*
  Live system canvas (hero). Everything here is simulated, and labelled so.

  1. Intro (~10 s): feature request → spec → architecture → code + AI agent →
     tests → deploy → observe. Then it stops on the live system.
  2. Live system: load balancer → api-1 / api-2 → job queue → three workers.
     - "Take down api-1": health checks fail twice, the instance leaves the pool,
       traffic shifts to api-2 (p95 rises), then it restarts and rejoins.
     - "Crash a worker": the job times out, is requeued with its idempotency key,
       and completes on a healthy worker.
  3. Observability: metrics with sparklines, a log stream, and a trace of the
     latest job (a retried job shows its failed attempt).

  Colours carry meaning: spec = sky · architecture = cobalt · code = orange ·
  AI agent = pink · processing/retry = sun · healthy/done = green · failure = coral.
*/

// ---- Geometry (SVG viewBox 600 × 350; nodes use the same coordinates) ------
// Kept compact so the hero plus the proof line fit in one desktop screen.

const VB = { w: 600, h: 350 };
const LB = { x: 300, y: 38 };
const APIS = [
  { x: 170, y: 124 },
  { x: 430, y: 124 },
];
const QUEUE = { x: 300, y: 210 };
const WORKERS = [
  { x: 100, y: 302 },
  { x: 300, y: 302 },
  { x: 500, y: 302 },
];
const HALF = 26; // half a node's height, in viewBox units

// Connectors run from the bottom edge of one node to the top edge of the next.
const link = (x1: number, y1: number, x2: number, y2: number) => {
  const m = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
};
const lbToApi = (i: number) => link(LB.x, LB.y + HALF + 2, APIS[i].x, APIS[i].y - HALF);
const apiToQueue = (i: number) => link(APIS[i].x, APIS[i].y + HALF, QUEUE.x, QUEUE.y - HALF);
const queueToWorker = (i: number) => link(QUEUE.x, QUEUE.y + HALF, WORKERS[i].x, WORKERS[i].y - HALF);

const STAGES = [
  { label: "Feature request", detail: "“Uploads time out when documents are large.”", color: "var(--ink)" },
  { label: "Specification", detail: "Accept in under 200 ms · process in the background · never lose a job", color: "var(--sky)" },
  { label: "Architecture", detail: "Load balancer → APIs → queue → workers, with retries", color: "var(--primary)" },
  { label: "Implementation + agent", detail: "worker.process(job) · an AI agent drafts edge-case tests", color: "var(--orange)", agent: true },
  { label: "Tests", detail: "All checks passing", color: "var(--green)" },
  { label: "Deploy", detail: "Rolled out behind the load balancer · health checks green", color: "var(--green)" },
  { label: "Observe", detail: "Metrics, logs and traces wired in before the first user arrives", color: "var(--sky)" },
] as const;

const STEP_MS = 1400;
const TRAVEL_MS = 520;
const WORK_MS = 1700;
const REQUEST_MS = 1300;
const CHECK_MS = 1000;

// ---- Types ------------------------------------------------------------------

type Level = "INFO" | "WARN" | "ERROR";
type Attempt = { worker: number; start: number; end?: number; failed?: boolean };
type Job = { id: number; api: number; apiMs: number; created: number; enqueued: number; attempts: Attempt[]; retry: boolean };
type Worker = { status: "idle" | "busy" | "offline"; job: Job | null; flash: boolean };
type Api = { name: string; up: boolean; inPool: boolean; failedChecks: number };
type Packet = { id: number; path: string; tone: "cobalt" | "sun" | "coral" };
type Log = { id: number; at: number; level: Level; msg: string };
type Span = { label: string; start: number; end: number; tone: "cobalt" | "muted" | "sun" | "green" | "coral"; depth: number };

type View = {
  apis: Api[];
  workers: Worker[];
  queued: number;
  packets: Packet[];
  logs: Log[];
  done: number;
  latency: number[];
  jobsPerMin: number[];
  errors: number[];
  trace: { id: number; spans: Span[]; total: number } | null;
  incident: string | null;
  recovered: boolean;
  announce: string;
};

const pad = (n: number, w = 3) => String(n).padStart(w, "0");
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function freshSim() {
  return {
    apis: [
      { name: "api-1", up: true, inPool: true, failedChecks: 0 },
      { name: "api-2", up: true, inPool: true, failedChecks: 0 },
    ] as Api[],
    rr: 0,
    queue: [] as Job[],
    workers: WORKERS.map<Worker>(() => ({ status: "idle", job: null, flash: false })),
    packets: [] as Packet[],
    logs: [] as Log[],
    seq: 127,
    uid: 0,
    done: 0,
    start: Date.now(),
    samples: [] as number[], // recent per-request API latencies
    completions: [] as number[],
    errorTimes: [] as number[],
    latency: [] as number[],
    jobsPerMin: [] as number[],
    errors: [] as number[],
    trace: null as View["trace"],
    tracePinnedUntil: 0, // a retried job's trace stays up long enough to read
    incident: null as string | null,
    recoveredUntil: 0,
    announce: "",
  };
}

const EMPTY: View = {
  apis: freshSim().apis,
  workers: WORKERS.map(() => ({ status: "idle", job: null, flash: false })),
  queued: 0,
  packets: [],
  logs: [],
  done: 0,
  latency: [],
  jobsPerMin: [],
  errors: [],
  trace: null,
  incident: null,
  recovered: false,
  announce: "",
};

// ---- Component ----------------------------------------------------------------

export default function SystemCanvas({ className }: { className?: string }) {
  const [phase, setPhase] = useState<"intro" | "live">("intro");
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [tab, setTab] = useState<"metrics" | "logs" | "trace">("metrics");
  const root = useRef<HTMLDivElement>(null);
  const sim = useRef(freshSim());
  const [view, setView] = useState<View>(EMPTY);
  const timers = useRef(new Set<number>());
  const motion = useRef(true);

  const render = useCallback(() => {
    const s = sim.current;
    setView({
      apis: s.apis.map((a) => ({ ...a })),
      workers: s.workers.map((w) => ({ ...w })),
      queued: s.queue.length,
      packets: s.packets,
      logs: s.logs,
      done: s.done,
      latency: s.latency,
      jobsPerMin: s.jobsPerMin,
      errors: s.errors,
      trace: s.trace,
      incident: s.incident,
      recovered: Date.now() < s.recoveredUntil,
      announce: s.announce,
    });
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  useEffect(() => {
    motion.current = !reducedMotion();
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // Pause when off-screen or the tab is hidden.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden));
    io.observe(el);
    const onVis = () => {
      const r = el.getBoundingClientRect();
      setVisible(!document.hidden && r.bottom > 0 && r.top < window.innerHeight);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // ---- Intro ----
  useEffect(() => {
    if (phase !== "intro") return;
    if (reducedMotion()) {
      const id = window.setTimeout(() => setPhase("live"), 0);
      return () => window.clearTimeout(id);
    }
    if (!visible) return;
    const last = step === STAGES.length - 1;
    const id = window.setTimeout(() => (last ? setPhase("live") : setStep(step + 1)), last ? STEP_MS + 500 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [phase, step, visible]);

  // ---- Simulation helpers ----
  const log = useCallback((level: Level, msg: string) => {
    const s = sim.current;
    s.logs = [{ id: ++s.uid, at: Date.now() - s.start, level, msg }, ...s.logs].slice(0, 40);
    if (level !== "INFO") s.announce = msg;
  }, []);

  const send = useCallback(
    (path: string, tone: Packet["tone"]) => {
      if (!motion.current) return;
      const s = sim.current;
      const packet = { id: ++s.uid, path, tone };
      s.packets = [...s.packets, packet];
      later(() => {
        s.packets = s.packets.filter((p) => p.id !== packet.id);
        render();
      }, TRAVEL_MS + 60);
    },
    [later, render],
  );

  const recover = useCallback((msg: string) => {
    const s = sim.current;
    const stillBroken = s.apis.some((a) => !a.inPool || !a.up) || s.workers.some((w) => w.status === "offline");
    if (stillBroken) return;
    s.incident = null;
    s.recoveredUntil = Date.now() + 5000;
    s.announce = msg;
  }, []);

  const dispatchRef = useRef<() => void>(() => {});
  const dispatch = useCallback(() => {
    const s = sim.current;
    s.workers.forEach((w, i) => {
      if (w.status !== "idle" || s.queue.length === 0) return;
      const job = s.queue.shift()!;
      const attempt: Attempt = { worker: i, start: Date.now() };
      job.attempts.push(attempt);
      w.status = "busy";
      w.job = job;
      send(queueToWorker(i), job.retry ? "sun" : "cobalt");
      later(() => {
        if (w.status !== "busy" || w.job?.id !== job.id) return; // crashed mid-job
        attempt.end = Date.now();
        s.done += 1;
        s.completions.push(Date.now());
        w.status = "idle";
        w.job = null;
        w.flash = true;
        log("INFO", `job #${pad(job.id)} completed · worker-${i + 1}${job.retry ? ` · attempt=${job.attempts.length}` : ""}`);
        if (job.retry) {
          s.trace = buildTrace(job);
          s.tracePinnedUntil = Date.now() + 12_000;
          recover(`job #${pad(job.id)} recovered on worker-${i + 1}`);
        } else if (Date.now() > s.tracePinnedUntil) {
          s.trace = buildTrace(job);
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
  }, [later, log, recover, render, send]);

  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  const request = useCallback(() => {
    const s = sim.current;
    const pool = s.apis.map((a, i) => ({ a, i })).filter(({ a }) => a.inPool);
    if (pool.length === 0) return;
    const { a: api, i } = pool[s.rr++ % pool.length];
    send(lbToApi(i), "cobalt");
    later(() => {
      if (!api.up) {
        s.errorTimes.push(Date.now());
        log("ERROR", `${api.name} 502 · upstream not responding`);
        render();
        return;
      }
      const healthy = s.apis.filter((a) => a.inPool && a.up).length;
      const apiMs = Math.round(healthy > 1 ? rand(38, 62) : rand(96, 142));
      s.samples = [...s.samples, apiMs].slice(-20);
      const job: Job = { id: ++s.seq, api: i, apiMs, created: Date.now(), enqueued: 0, attempts: [], retry: false };
      send(apiToQueue(i), "cobalt");
      later(() => {
        job.enqueued = Date.now();
        s.queue.push(job);
        dispatchRef.current();
      }, TRAVEL_MS);
      render();
    }, TRAVEL_MS);
    render();
  }, [later, log, render, send]);

  // Load-balancer health checks.
  const healthCheck = useCallback(() => {
    const s = sim.current;
    s.apis.forEach((api) => {
      if (!api.up && api.inPool) {
        api.failedChecks += 1;
        log("WARN", `lb health check failed · ${api.name} (${api.failedChecks}/2)`);
        if (api.failedChecks >= 2) {
          api.inPool = false;
          const other = s.apis.find((a) => a !== api)!;
          log("ERROR", `lb health check failed ×2 · ${api.name} removed from pool · traffic → ${other.name}`);
        }
      } else if (api.up && !api.inPool) {
        api.inPool = true;
        api.failedChecks = 0;
        log("INFO", `${api.name} passed health check · rejoined pool`);
        recover(`${api.name} rejoined the pool`);
      }
    });
    render();
  }, [log, recover, render]);

  // Metrics sampled once a second.
  const sample = useCallback(() => {
    const s = sim.current;
    const now = Date.now();
    s.completions = s.completions.filter((t) => now - t < 60_000);
    s.errorTimes = s.errorTimes.filter((t) => now - t < 60_000);
    const sorted = [...s.samples].sort((a, b) => a - b);
    const p95 = sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : 0;
    const recent = s.completions.filter((t) => now - t < 20_000).length * 3; // per-minute rate from the last 20 s
    s.latency = [...s.latency, p95].slice(-40);
    s.jobsPerMin = [...s.jobsPerMin, recent].slice(-40);
    s.errors = [...s.errors, s.errorTimes.length].slice(-40);
    render();
  }, [render]);

  useEffect(() => {
    if (phase !== "live" || !visible) return;
    request();
    const ids = [
      window.setInterval(request, REQUEST_MS),
      window.setInterval(healthCheck, CHECK_MS),
      window.setInterval(sample, 1000),
    ];
    return () => ids.forEach((id) => window.clearInterval(id));
  }, [phase, visible, request, healthCheck, sample]);

  // ---- Interactions ----
  const takeDownApi = useCallback(() => {
    const s = sim.current;
    const api = s.apis[0];
    if (!api.up || !api.inPool) return;
    track("demo_api_taken_down", {});
    api.up = false;
    api.failedChecks = 0;
    s.incident = "api-1 down";
    s.recoveredUntil = 0;
    log("ERROR", "api-1 stopped responding");
    later(() => {
      api.up = true;
      log("INFO", "api-1 restarted · waiting for health check");
      render();
    }, 9000);
    render();
  }, [later, log, render]);

  const crashWorker = useCallback(
    (index?: number) => {
      const s = sim.current;
      const alive = s.workers.filter((w) => w.status !== "offline").length;
      if (alive <= 1) return;
      const i =
        index ??
        (() => {
          const busy = s.workers.findIndex((w) => w.status === "busy");
          return busy >= 0 ? busy : s.workers.findIndex((w) => w.status !== "offline");
        })();
      const w = s.workers[i];
      if (!w || w.status === "offline") return;
      track("demo_worker_crashed", { worker: i + 1 });
      const lost = w.job;
      const attempt = lost?.attempts[lost.attempts.length - 1];
      w.status = "offline";
      w.job = null;
      s.incident = `worker-${i + 1} crashed`;
      s.recoveredUntil = 0;
      log("ERROR", `worker-${i + 1} crashed`);

      if (lost && attempt) {
        later(() => {
          attempt.end = Date.now();
          attempt.failed = true;
          s.errorTimes.push(Date.now());
          log("WARN", `timeout detected · job #${pad(lost.id)}`);
          render();
        }, 1100);
        later(() => {
          lost.retry = true;
          s.queue.unshift(lost);
          log("WARN", `requeued · job #${pad(lost.id)} · attempt=${lost.attempts.length + 1} · idempotency key reused`);
          dispatchRef.current();
        }, 1900);
      } else {
        later(() => {
          log("INFO", "no job in flight · queue keeps flowing");
          render();
        }, 700);
      }

      later(() => {
        w.status = "idle";
        log("INFO", `worker-${i + 1} restarted`);
        recover(`worker-${i + 1} back online`);
        dispatchRef.current();
      }, 7500);
      render();
    },
    [later, log, recover, render],
  );

  const replay = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
    sim.current = freshSim();
    setView(EMPTY);
    setStep(0);
    setPhase("intro");
  };

  // ---- Render ----
  const s = view;
  const inPool = s.apis.filter((a) => a.inPool).length;
  const aliveWorkers = s.workers.filter((w) => w.status !== "offline").length;
  const apiDown = !s.apis[0].up || !s.apis[0].inPool;

  const status = s.recovered
    ? null
    : !s.apis[0].inPool
      ? "Traffic shifted to api-2 · api-1 out of the pool"
      : !s.apis[0].up
        ? "api-1 not responding · health checks running"
        : aliveWorkers < 3
          ? `${3 - aliveWorkers} worker offline · jobs requeued`
          : `Traffic balanced across ${inPool} APIs · ${aliveWorkers} workers healthy`;

  return (
    <div
      ref={root}
      role="region"
      aria-label="Interactive demo of a simulated system: a load balancer, two APIs, a job queue and three workers, with metrics, logs and traces."
      className={cn(
        "@container/canvas relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-40px_rgb(11_21_54/0.35)]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5 md:px-5">
        <p className="flex min-w-0 items-center gap-2 font-mono text-[12px] text-muted-foreground">
          <span className="relative flex size-2 shrink-0">
            {phase === "live" && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60 motion-reduce:hidden" />
            )}
            <span className={cn("relative inline-flex size-2 rounded-full", phase === "live" ? "bg-green" : "bg-sky")} />
          </span>
          <span className="truncate">
            {phase === "live" ? "live" : "building"}
            <span className="hidden sm:inline"> · document-pipeline</span>
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2 font-mono text-[12px] text-muted-foreground">
          {phase === "live" && s.incident && (
            <span className="flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral-50 px-2.5 py-0.5 text-ink">
              <span className="size-1.5 rounded-full bg-coral" aria-hidden /> {s.incident}
            </span>
          )}
          {phase === "live" && !s.incident && s.recovered && (
            <span className="flex items-center gap-1.5 rounded-full border border-green/40 bg-green-50 px-2.5 py-0.5 text-ink">
              <span className="size-1.5 rounded-full bg-green" aria-hidden /> recovered
            </span>
          )}
          {phase === "live" ? (
            <>
              <span className="hidden whitespace-nowrap sm:inline">
                done <span className="text-ink">{s.done}</span>
              </span>
              <button
                type="button"
                onClick={replay}
                className="inline-flex min-h-8 items-center gap-1 rounded-full px-2 hover:bg-muted hover:text-ink"
                aria-label="Replay the intro"
              >
                <RotateCcw className="size-3.5" aria-hidden />
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
        <ol
          className="flex min-h-[calc(58.34cqw+270px)] flex-col justify-center gap-1 p-4 md:p-6"
          aria-live="polite"
        >
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
        <div className="animate-in fade-in duration-700 motion-reduce:animate-none">
          {/* Diagram */}
          <div
            className="@container relative w-full bg-[radial-gradient(var(--border)_1px,transparent_1.2px)] bg-[size:18px_18px]"
            style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
          >
            <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 size-full" aria-hidden>
              {APIS.map((_, i) => (
                <path key={`a${i}`} d={lbToApi(i)} fill="none" stroke="var(--border)" strokeWidth="2.5" />
              ))}
              {APIS.map((_, i) => (
                <path
                  key={`q${i}`}
                  d={apiToQueue(i)}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="2.5"
                  strokeDasharray={s.apis[i].inPool ? undefined : "6 6"}
                />
              ))}
              {WORKERS.map((_, i) => (
                <path key={`w${i}`} d={queueToWorker(i)} fill="none" stroke="var(--border)" strokeWidth="2.5" />
              ))}
              {s.packets.map((p) => (
                <PacketDot key={p.id} packet={p} />
              ))}
            </svg>

            <Node at={LB} width="auto">
              <div className="rounded-full bg-[#0b1536] px-[4.5cqw] py-[1.8cqw] whitespace-nowrap text-white shadow-[0_10px_24px_-12px_rgb(11_21_54/0.6)] dark:ring-1 dark:ring-white/15">
                <p className="text-[clamp(11px,3cqw,16px)] leading-tight font-semibold">Load balancer</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[clamp(9px,2.3cqw,12.5px)] text-white/75">
                  <Dot tone={inPool === 2 ? "green" : "coral"} /> round robin · {inPool}/2 healthy
                </p>
              </div>
            </Node>

            {s.apis.map((api, i) => (
              <Node key={api.name} at={APIS[i]} width="30%">
                <Card tone={!api.up || !api.inPool ? "coral" : "idle"}>
                  <p className="text-[clamp(11px,3cqw,16px)] leading-tight font-semibold text-ink">{api.name}</p>
                  <StatusLine
                    tone={!api.up ? "coral" : !api.inPool ? "sun" : "green"}
                    text={!api.up ? (api.inPool ? "not responding" : "out of pool") : !api.inPool ? "rejoining" : "healthy"}
                  />
                </Card>
              </Node>
            ))}

            <Node at={QUEUE} width="38%">
              <Card tone="idle">
                <p className="text-[clamp(11px,3cqw,16px)] leading-tight font-semibold text-ink">Job queue</p>
                <StatusLine tone={s.queued > 2 ? "sun" : "green"} text={`${pad(s.queued, 2)} pending`} />
              </Card>
            </Node>

            {s.workers.map((w, i) => {
              const tone = w.status === "offline" ? "coral" : w.flash ? "green" : w.status === "busy" ? "sun" : "idle";
              const text =
                w.status === "offline" ? "offline" : w.flash ? "done ✓" : w.job ? `job #${pad(w.job.id)}${w.job.retry ? " ↻" : ""}` : "idle";
              return (
                <Node key={i} at={WORKERS[i]} width="30%">
                  <button
                    type="button"
                    onClick={() => crashWorker(i)}
                    disabled={w.status === "offline" || aliveWorkers <= 1}
                    title={w.status === "offline" ? `worker-${i + 1} is restarting` : `Crash worker-${i + 1}`}
                    aria-label={`worker-${i + 1}: ${text}. ${w.status === "offline" ? "" : "Press to crash it."}`}
                    className="block w-full text-left disabled:cursor-not-allowed"
                  >
                    <Card tone={tone} interactive={w.status !== "offline"}>
                      <p className="text-[clamp(11px,3cqw,16px)] leading-tight font-semibold text-ink">worker-{i + 1}</p>
                      <StatusLine tone={tone === "idle" ? "green" : tone} text={text} />
                    </Card>
                  </button>
                </Node>
              );
            })}
          </div>

          {/* Observability */}
          <Observability view={s} tab={tab} setTab={setTab} />

          {/* Status + actions */}
          <div className="flex flex-col gap-2.5 border-t px-4 py-3 md:px-5">
            <p className="min-h-5 font-mono text-[12px] text-body">
              {status ?? <span className="font-serif text-[16px] text-ink italic">Systems fail. Reliable systems recover.</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={takeDownApi}
                disabled={apiDown}
                className="inline-flex h-9 items-center justify-center rounded-full border bg-card px-4 text-[13px] font-medium text-ink transition-colors hover:border-ink disabled:opacity-50"
              >
                Take down api-1
              </button>
              <button
                type="button"
                onClick={() => crashWorker()}
                disabled={aliveWorkers <= 1}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-coral/40 bg-coral-50 px-4 text-[13px] font-medium text-ink transition-colors hover:border-coral disabled:opacity-50"
              >
                <span className="size-1.5 rounded-full bg-coral" aria-hidden />
                {aliveWorkers < 3 ? "Crash another" : "Crash a worker"}
              </button>
            </div>
          </div>
          {/* Failures and recoveries only; routine INFO lines stay quiet */}
          <p className="sr-only" aria-live="polite">
            {s.announce}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Observability panel -------------------------------------------------------

type Tab = "metrics" | "logs" | "trace";
const TABS: { id: Tab; label: string }[] = [
  { id: "metrics", label: "Metrics" },
  { id: "logs", label: "Logs" },
  { id: "trace", label: "Trace" },
];

function Observability({ view, tab, setTab }: { view: View; tab: Tab; setTab: (t: Tab) => void }) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Which parts of the demo people actually explore.
  const choose = (next: Tab) => {
    if (next !== tab) track("demo_tab_viewed", { tab: next });
    setTab(next);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : (index + delta + TABS.length) % TABS.length;
    if (delta === 0 && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    choose(TABS[to].id);
    refs.current[to]?.focus();
  };

  const latest = (a: number[]) => (a.length ? a[a.length - 1] : 0);
  const p95 = latest(view.latency);
  const jobs = latest(view.jobsPerMin);
  const errors = latest(view.errors);

  return (
    <div className="border-t px-4 pt-2.5 pb-3.5 md:px-5">
      <div className="flex items-center justify-between">
        <div role="tablist" aria-label="Observability" className="flex gap-1">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${id}-${t.id}-tab`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`${id}-${t.id}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => choose(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "min-h-8 rounded-xl px-3.5 text-[14px] transition-colors",
                tab === t.id ? "bg-muted font-medium text-ink" : "text-body hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">simulated</span>
      </div>

      <div
        role="tabpanel"
        id={`${id}-${tab}-panel`}
        aria-labelledby={`${id}-${tab}-tab`}
        className="mt-2.5 h-[118px]"
      >
        {tab === "metrics" && (
          <div className="grid h-full grid-cols-3 gap-2 sm:gap-3">
            <Metric label="API p95 latency" short="p95 latency" value={p95 || "—"} unit={p95 ? "ms" : undefined} series={view.latency} color="var(--primary)" alert={p95 > 100} />
            <Metric label="Jobs completed / min" short="Jobs / min" value={jobs} series={view.jobsPerMin} color="var(--green)" />
            <Metric label="Errors (last min)" short="Errors / min" value={errors} series={view.errors} color="var(--coral)" alert={errors > 0} />
          </div>
        )}

        {tab === "logs" && (
          <ol className="h-full overflow-y-auto rounded-2xl border bg-background px-3 py-2 font-mono text-[11.5px] leading-[1.7]">
            {view.logs.length === 0 && <li className="text-muted-foreground">waiting for traffic…</li>}
            {view.logs.map((l) => (
              <li key={l.id} className="flex gap-2 whitespace-nowrap">
                <span className="text-muted-foreground">{formatClock(l.at)}</span>
                <span
                  className={cn(
                    "w-10 shrink-0 font-semibold",
                    l.level === "ERROR" ? "text-coral" : l.level === "WARN" ? "text-[#b08400] dark:text-sun" : "text-green-700 dark:text-green",
                  )}
                >
                  {l.level}
                </span>
                <span className="truncate text-ink">{l.msg}</span>
              </li>
            ))}
          </ol>
        )}

        {tab === "trace" && <TraceView trace={view.trace} />}
      </div>
    </div>
  );
}

function Metric({
  label,
  short,
  value,
  unit,
  series,
  color,
  alert = false,
}: {
  label: string;
  short: string; // phones
  value: number | string;
  unit?: string;
  series: number[];
  color: string;
  alert?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-2xl border p-2.5 transition-colors sm:p-3.5",
        alert ? "border-coral/50 bg-coral-50" : "bg-card",
      )}
    >
      <p className="truncate text-[11px] text-body sm:text-[12.5px]">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{label}</span>
      </p>
      <p className={cn("mt-1.5 text-[22px] leading-none font-semibold tracking-tight sm:text-[30px]", alert ? "text-coral" : "text-ink")}>
        {value}
        {unit && <span className="ml-1 text-[12px] font-normal text-body sm:text-[15px]">{unit}</span>}
      </p>
      <Sparkline series={series} color={alert ? "var(--coral)" : color} />
    </div>
  );
}

function Sparkline({ series, color }: { series: number[]; color: string }) {
  const w = 120;
  const h = 32;
  const data = series.length > 1 ? series : [0, 0];
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - 2 - (v / max) * (h - 6)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-auto h-6 w-full" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

function TraceView({ trace }: { trace: View["trace"] }) {
  if (!trace) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed text-[13px] text-muted-foreground">
        Waiting for the first job to finish…
      </div>
    );
  }
  const toneColor: Record<Span["tone"], string> = {
    cobalt: "var(--primary)",
    muted: "var(--border)",
    sun: "var(--sun)",
    green: "var(--green)",
    coral: "var(--coral)",
  };
  return (
    <div className="h-full overflow-y-auto rounded-2xl border bg-background px-3 py-2">
      <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">
        trace · job #{pad(trace.id)} · {formatMs(trace.total)}
      </p>
      <ol className="space-y-1">
        {trace.spans.map((span, i) => (
          <li key={i} className="grid grid-cols-[minmax(0,42%)_minmax(0,1fr)] items-center gap-2 text-[11.5px]">
            <span className="truncate font-mono text-ink" style={{ paddingLeft: span.depth * 10 }}>
              {span.label}
            </span>
            <span className="relative h-3.5">
              <span
                className="absolute top-0 h-full rounded"
                style={{
                  left: `${(span.start / trace.total) * 100}%`,
                  width: `max(3px, ${((span.end - span.start) / trace.total) * 100}%)`,
                  background: toneColor[span.tone],
                }}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 pl-1 font-mono text-[10px] text-muted-foreground"
                style={{ left: `min(78%, ${(span.end / trace.total) * 100}%)` }}
              >
                {formatMs(span.end - span.start)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Waterfall for one job. API time is the simulated latency; queue and worker
// time are what actually elapsed in the simulation.
function buildTrace(job: Job): View["trace"] {
  const spans: Span[] = [];
  spans.push({ label: `POST /documents · api-${job.api + 1}`, start: 0, end: job.apiMs, tone: "cobalt", depth: 0 });
  const enq = job.apiMs + 4;
  spans.push({ label: "enqueue", start: job.apiMs, end: enq, tone: "cobalt", depth: 1 });
  const offset = (t: number) => enq + (t - job.enqueued);
  const first = job.attempts[0];
  if (first) spans.push({ label: "queue wait", start: enq, end: offset(first.start), tone: "muted", depth: 0 });
  job.attempts.forEach((a, i) => {
    const start = offset(a.start);
    const end = offset(a.end ?? a.start);
    if (a.failed) {
      spans.push({ label: `worker-${a.worker + 1} · attempt ${i + 1} ✕`, start, end, tone: "coral", depth: 0 });
      return;
    }
    spans.push({ label: `worker-${a.worker + 1} · attempt ${i + 1}`, start, end, tone: job.retry ? "sun" : "green", depth: 0 });
    const ocrEnd = start + (end - start) * 0.6;
    spans.push({ label: "ocr", start, end: ocrEnd, tone: "green", depth: 1 });
    spans.push({ label: "extract", start: ocrEnd, end, tone: "green", depth: 1 });
  });
  const total = Math.max(...spans.map((s) => s.end), 1);
  return { id: job.id, spans, total };
}

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}

function formatClock(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 60), 2)}:${pad(s % 60, 2)}`;
}

// ---- Diagram pieces ---------------------------------------------------------------

function Node({ at, width, children }: { at: { x: number; y: number }; width: string; children: ReactNode }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(at.x / VB.w) * 100}%`, top: `${(at.y / VB.h) * 100}%`, width }}
    >
      {children}
    </div>
  );
}

function Card({
  tone,
  interactive = false,
  children,
}: {
  tone: "idle" | "sun" | "green" | "coral";
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[clamp(10px,2.6cqw,16px)] border px-[3.2cqw] py-[1.8cqw] shadow-[0_6px_18px_-14px_rgb(11_21_54/0.5)] transition-[background-color,border-color,box-shadow] duration-300",
        tone === "coral" && "border-coral/50 bg-coral-50",
        tone === "green" && "border-green/50 bg-green-50",
        tone === "sun" && "border-sun/70 bg-card",
        tone === "idle" && "bg-card",
        interactive && "hover:border-coral/60 hover:shadow-[0_8px_22px_-12px_var(--coral)]",
      )}
    >
      {children}
    </div>
  );
}

function Dot({ tone }: { tone: "green" | "sun" | "coral" }) {
  const bg = tone === "green" ? "bg-green" : tone === "sun" ? "bg-sun" : "bg-coral";
  return <span className={cn("inline-block size-[clamp(6px,1.6cqw,8px)] shrink-0 rounded-full", bg)} aria-hidden />;
}

function StatusLine({ tone, text }: { tone: "green" | "sun" | "coral"; text: string }) {
  return (
    <p className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[clamp(9px,2.4cqw,13px)] text-body">
      <Dot tone={tone} />
      <span className="truncate">{text}</span>
    </p>
  );
}

// A job travelling along a connector (SVG animateMotion, started on mount).
function PacketDot({ packet }: { packet: Packet }) {
  const anim = useRef<SVGAnimateMotionElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    anim.current?.beginElement();
    const id = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const fill = packet.tone === "sun" ? "var(--sun)" : packet.tone === "coral" ? "var(--coral)" : "var(--primary)";
  return (
    <circle r="6" fill={fill} opacity={started ? 1 : 0} stroke="white" strokeWidth="2">
      <animateMotion
        ref={anim}
        dur={`${TRAVEL_MS}ms`}
        path={packet.path}
        begin="indefinite"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.4 0 0.2 1"
      />
    </circle>
  );
}
