// Single source for site copy. Every claim here comes from the résumé (public/resume.pdf);
// keep it that way so each line is defensible in an interview.

import { allPosts, formatDate, readTime } from "@/lib/posts";

export const site = {
  name: "Hope Tuyishime Wilberforce",
  email: "tuyishimehope01@gmail.com",
  resume: "/resume.pdf", // copied from doc/
  linkedin: "https://www.linkedin.com/in/hope-tuyishime/",
  github: "https://github.com/tuyishimehope",
  location: "Kigali, Rwanda",
};

/** Architecture as data: the fast request path, the queue, the background stages, the stores. */
export type Pipeline = {
  request: string[]; // what happens inside the HTTP request
  response: string; // what the client gets back immediately
  queue: string;
  stages: string[]; // background worker steps, in order
  stores: string[];
};

export type ProjectMedia =
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "video"; src: string; label: string; poster?: string }
  | { type: "diagram"; label: string; pipeline: Pipeline };

export type Project = {
  slug: string;
  title: string;
  problem: string;
  role: string;
  stack: string[];
  year?: string; // omit when unknown; the UI skips it
  visual: string; // describes the placeholder until a real image exists
  media?: ProjectMedia; // real screenshot or screen recording; falls back to the placeholder
  accent: "sky" | "sun" | "pink"; // one pale surface per project
  repo?: string; // public source code
  live?: string; // live product URL
  architecture?: Pipeline; // shown on the case study when the main media isn't already a diagram
  // Case-study body. Keep every claim defensible in an interview.
  caseStudy: { heading: string; body: string; points?: string[] }[];
};

export const flagship: Project = {
  slug: "trustplot",
  title: "Trustplot",
  problem: "Land and property information in Rwanda is fragmented and hard to verify.",
  role: "Founder and engineer",
  stack: ["Next.js", "PostGIS", "ArcGIS REST"],
  year: "2026",
  visual: "Map / search results screenshot",
  media: {
    type: "video",
    src: "/projects/trustplot-demo.mp4",
    label: "Trustplot demo: searching a parcel by UPI and reviewing its boundary, zoning, risk and reference value",
    poster: "/projects/trustplot.webp",
  },
  live: "https://trustplot-frontend.vercel.app/",

  accent: "sky",
  caseStudy: [
    {
      heading: "Context",
      body: "Buyers, lenders and developers in Rwanda have to piece together a plot’s boundaries, zoning, risks and value from separate sources before they can trust a deal. I founded Trustplot in May 2026 to put that picture in one place.",
    },
    {
      heading: "What I built",
      body: "A full-stack land and property intelligence platform: parcel search by UPI, interactive satellite mapping, zoning and risk screening, reference valuation, and automated report generation. Spatial property data lives in PostGIS.",
    },
    {
      heading: "Hard parts",
      body: "Integrating ArcGIS REST services and geospatial datasets into parcel-level answers, and being explicit when a source has no data: the workspace shows “Unavailable” or “Unknown” rather than guessing.",
    },
    {
      heading: "Outcome",
      body: "A working platform where one UPI search returns the parcel boundary, area, location (district, sector, cell), reference land value and screening results, ready to export as a report.",
    },
  ],
};

export const secondary: Project[] = [
  {
    slug: "docflow",
    title: "DocFlow",
    problem: "Long-running AI document analysis shouldn’t block, or break, the API that receives the documents.",
    role: "Personal project · sole engineer",
    stack: ["FastAPI", "Celery + Redis", "PostgreSQL"],
    year: "2026",
    visual: "Upload → queue → workers → storage",
    media: { type: "video", src: "/projects/docflow.mp4", label: "DocFlow screen recording" },
    accent: "sun",
    repo: "https://github.com/tuyishimehope/DOC-FLOW",
    architecture: {
      request: ["Upload", "Validate type", "Store file in MinIO", "Create request"],
      response: "201 · status QUEUED",
      queue: "Redis → Celery",
      stages: ["Extract text (PDF · DOCX · Tesseract OCR)", "Summarise / extract with OpenAI", "Save result + job attempt"],
      stores: ["PostgreSQL", "MinIO"],
    },
    caseStudy: [
      {
        heading: "Context",
        body: "OCR and model calls take seconds to minutes; an HTTP request shouldn’t. DocFlow is a reusable reference implementation of the asynchronous pattern I ran in production at IFAD, rebuilt from scratch in the open.",
      },
      {
        heading: "What I built",
        body: "A FastAPI backend where users upload PDFs, DOCX files or images and ask for a summary, invoice extraction or contract metadata. The upload returns straight away; Celery workers on Redis do the heavy work, and PostgreSQL tracks every request and attempt.",
        points: [
          "JWT authentication, per-user documents and files, and email-based password reset.",
          "Originals stored in MinIO (S3-compatible); metadata, requests, job attempts and results in PostgreSQL, with Alembic migrations.",
          "Text extraction with pypdf, python-docx and Tesseract OCR, then OpenAI for the requested analysis.",
          "Everything runs locally with Docker Compose: API, worker, PostgreSQL, Redis and MinIO.",
        ],
      },
      {
        heading: "Engineering decisions",
        body: "The questions a reviewer should ask of any job system, and how DocFlow answers them today:",
        points: [
          "Why Celery and Redis? A mature Python task queue with retries and backoff built in, and Redis doubles as broker and result backend, so the local stack stays small.",
          "How does the client know a job finished? Each request moves QUEUED → PROCESSING → COMPLETED or FAILED in PostgreSQL. Clients poll the status endpoint; the result endpoint returns 404 until the result exists.",
          "How are duplicate results prevented? The database allows exactly one stored result per processing request, and every attempt is recorded with its attempt number.",
          "What happens when a worker dies mid-job? Today the request stays in PROCESSING: tasks are acknowledged when received, so a crashed worker’s task isn’t redelivered. That is the first thing on the list below.",
        ],
      },
      {
        heading: "What I’d harden next",
        body: "Written down deliberately. These are the gaps between a working reference and a production service:",
        points: [
          "Late acknowledgement (acks_late + reject_on_worker_lost) plus a sweeper that re-queues requests stuck in PROCESSING.",
          "Let failures reach Celery’s retry policy: the task currently records a failure instead of re-raising it, so its declared retries never fire.",
          "Idempotency keys on upload, so a client retrying a slow request can’t create a second job.",
          "Push completion (webhook or server-sent events) instead of polling, and validated structured output for invoices and contracts.",
        ],
      },
    ],
  },
];

export const capabilities = [
  { label: "Backend", items: ["Python · FastAPI", "SQLAlchemy · Celery", "Java · Spring Boot", "Node.js · TypeScript"] },
  { label: "Data & messaging", items: ["PostgreSQL · PostGIS", "Redis", "Azure Service Bus", "ETL pipelines"] },
  { label: "Infrastructure", items: ["Docker · Linux", "GitHub Actions CI/CD", "Azure · AWS · GCP"] },
  { label: "AI & testing", items: ["OCR · information extraction", "RAG", "Pytest · Playwright"] },
];

export type Experience = {
  start: string;
  end: string; // "Now" for a current role
  role: string;
  org: string;
  impact: string;
  href?: string; // internal case study, when there is one
  kind?: "education"; // a milestone rather than a job
};

export const experience: Experience[] = [
  {
    start: "May 2026",
    end: "Now",
    role: "Founder",
    org: "Trustplot, Kigali",
    impact:
      "Founded and engineered a land and property intelligence platform for Rwanda: UPI parcel search, interactive mapping, zoning and risk screening, reference valuation and automated reports, on PostGIS and ArcGIS data.",
    href: "/projects/trustplot",
  },
  {
    start: "Oct 2025",
    end: "Graduated",
    role: "BSc (Honours) Software Engineering",
    org: "Adventist University of Central Africa (AUCA)",
    impact: "Graduated in software engineering with Distinction.",
    kind: "education",
  },
  {
    start: "Mar 2025",
    end: "Apr 2026",
    role: "Full-stack Software Engineer (Internship)",
    org: "IFAD, Rome",
    impact:
      "Built FastAPI and PostgreSQL services for document ingestion, OCR, extraction and review (~100 documents a day), with Azure Service Bus workers that kept APIs under 200 ms and cut failed jobs by 60%.",
  },
  {
    start: "Aug 2024",
    end: "Feb 2025",
    role: "Software Engineer Apprentice",
    org: "AUCA Innovation Center (Mastercard Program)",
    impact:
      "Developed Java, Spring Boot and PostgreSQL REST APIs for academic and financial management systems, with relational models and tuned SQL for transactional workloads.",
  },
  {
    start: "Jul 2024",
    end: "Dec 2024",
    role: "Software Engineer Intern",
    org: "NetFella",
    impact:
      "Built Node.js and TypeScript services and event-driven pipelines for real-time telemetry, with secure REST APIs and access control between distributed components.",
  },
  {
    start: "Nov 2023",
    end: "Dec 2024",
    role: "Software Engineer Apprentice",
    org: "Andela (remote, part-time)",
    impact:
      "Developed multi-tenant REST APIs for authentication and authorisation, improved database performance with indexing and SQL optimisation, and contributed GitHub Actions CI/CD.",
  },
];

// Short facts for the bento tiles (all from the résumé).
export const facts = {
  education: {
    degree: "Bachelor of Science (Honours) in Software Engineering",
    short: "BSc Software Engineering",
    graduated: "Oct 2025",
    honours: "Distinction",
    school: "Adventist University of Central Africa",
    schoolShort: "AUCA",
    year: "2025",
  },
  sponsorship: "Requires visa sponsorship · Open to relocation within the EU",
  relocation: "Rwandan citizen · familiar with the EU Blue Card and Dutch Highly Skilled Migrant processes",
  // Homepage leads with the two strongest numbers; volume (~100 docs/day) stays in the case study.
  impact: [
    { value: "<200 ms", label: "API responses while document analysis ran in the background" },
    { value: "−60%", label: "failed jobs after retry and recovery work" },
  ],
};

export const projects = [flagship, ...secondary];

// Blog listing, derived from lib/posts.ts (newest first). Empty → blog stays hidden.
export const posts = [...allPosts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    date: formatDate(p.date),
    readTime: readTime(p),
    href: `/blogs/${p.slug}`,
  }));
