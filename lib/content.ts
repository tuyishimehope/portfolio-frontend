// Single source for site copy. Every claim here comes from the résumé (public/resume.pdf);
// keep it that way so each line is defensible in an interview.

import { allPosts, formatDate, readTime } from "@/lib/posts";

export const site = {
  name: "Hope Tuyishime Wilberforce",
  email: "tuyishimehope01@gmail.com",
  resume: "/resume.pdf/?utm_source=cv&utm_medium=pdf", // copied from doc/
  linkedin: "https://www.linkedin.com/in/hope-tuyishime/?utm_source=cv&utm_medium=pdf",
  github: "https://github.com/tuyishimehope/?utm_source=cv&utm_medium=pdf",
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
  screenshots?: { src: string; alt: string; width: number; height: number }[]; // case-study page only
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
  live: "https://trustplot.hopetuyishime.com/",
  screenshots: [
    {
      src: "/projects/trustplot.webp",
      alt: "Trustplot property workspace: a parcel boundary on the satellite map beside its details",
      width: 2000,
      height: 1200,
    },
  ],

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
  {
    // Metrics and the async architecture come from the résumé. The feature list, the
    // React/TypeScript work and the two deep dives come from the case-study outline:
    // confirm each against what shipped before publishing. Details are generalised for
    // confidentiality: no internal names, document types, teams or screenshots.
    slug: "ai-workspace",
    title: "AI Workspace at IFAD",
    problem:
      "Staff spent hours reading, translating and pulling tables out of long documents by hand. The goal was one workspace where those jobs took seconds.",
    role: "Full-stack engineer (internship)",
    stack: ["React + TypeScript", "FastAPI", "PostgreSQL", "Azure Service Bus", "LLM APIs"],
    year: "2025–2026",
    visual: "Upload → parse & OCR → LLM step → validation → result",
    media: {
      type: "diagram",
      label: "AI Workspace architecture: fast upload request, queued background processing, validated results",
      pipeline: {
        request: ["Upload", "Validate size and type", "Create job"],
        response: "Job accepted · processing",
        queue: "Azure Service Bus",
        stages: [
          "Parse and OCR (text, layout, tables)",
          "LLM step (prompt per feature)",
          "Validate output (rules per feature)",
          "Save result for the interface",
        ],
        stores: ["PostgreSQL"],
      },
    },
    accent: "pink",
    caseStudy: [
      {
        heading: "Context",
        body: "Staff across the organisation worked with long documents every day: reading them, translating them, pulling out tables, rewriting sections. Most of it was manual and slow. The goal was one internal workspace where these jobs took seconds.",
      },
      {
        heading: "What I built",
        body: "Fourteen document and language tools in four families, each owned end to end, from the React interface to the Python API.",
        points: [
          "Document understanding: OCR conversion, table extraction, image extraction, document comparison and document translation.",
          "Chat with documents: file chat and text reasoning.",
          "Language tools: translation, generation, content polish, transcription and narration.",
          "Visual generation: icon generation and word clouds.",
        ],
      },
      {
        heading: "The platform",
        body: "Every feature follows the same path: upload, parse and OCR, an LLM step, validation, then the result in the interface. Uploads return straight away and Azure Service Bus workers do the heavy work, so the APIs stayed under 200 ms. Building that path once meant each new feature was mostly its prompt and its validation rules.",
      },
      {
        heading: "Chatting with a document",
        body: "Long documents don’t fit in a model’s context window.",
        points: [
          "Documents are split into chunks, and only the chunks relevant to each question are sent to the model.",
          "Answers point back to the page they came from, so people can check them.",
          "When the answer isn’t in the document, the assistant says so instead of guessing.",
        ],
      },
      {
        heading: "Extracting tables",
        body: "OCR alone breaks on real-world tables: merged headers, tables spanning pages, faint scans.",
        points: [
          "Azure’s table extraction first, then an LLM repair step for merged headers and rows split across pages.",
          "Every result is validated before it is shown: row and column counts, and unexpected empty cells.",
        ],
      },
      {
        heading: "Hard parts",
        body: "The work that took the most care:",
        points: [
          "Accepting large, image-heavy files without timeouts or memory spikes.",
          "Keeping the interface responsive while long OCR and model jobs ran in the background.",
          "Checking LLM output before trusting it, instead of assuming it was right.",
          "Handling documents that mix several languages.",
        ],
      },
      {
        heading: "Outcome",
        body: "Fourteen features shipped on one shared platform, with background workers that cut failed jobs by 60%.",
        points: [
          "The frontend was migrated from JavaScript to TypeScript, with shared typed contracts between the interface and the API.",
          "The interface was redesigned from Figma into production components.",
          "Details are generalised to respect confidentiality; diagrams are redrawn and no real documents are shown.",
        ],
      },
    ],
  },
];

// Each capability is shown as a miniature system (flow), with its tools as quiet text.
// Every tool listed here is on the résumé.
export const capabilities = [
  {
    label: "Backend",
    flow: ["request", "API", "response"],
    note: "Fast, typed APIs with clear contracts and honest errors.",
    items: ["Python · FastAPI", "Java · Spring Boot", "Node.js · TypeScript", "SQLAlchemy", "Pytest · Playwright"],
  },
  {
    label: "Distributed work",
    flow: ["API", "queue", "workers", "retry"],
    note: "Slow work leaves the request; failures are retried and recovered.",
    items: ["Celery · Redis", "Azure Service Bus", "Docker · Linux", "GitHub Actions CI/CD", "Azure · AWS · GCP"],
  },
  {
    label: "Data",
    flow: ["event", "pipeline", "PostgreSQL / PostGIS"],
    note: "Schemas, spatial data and queries tuned for real workloads.",
    items: ["PostgreSQL · PostGIS", "ETL pipelines", "Data modelling", "Query optimisation"],
  },
  {
    label: "AI",
    flow: ["document", "OCR", "extract", "retrieve", "review"],
    note: "AI features with a human in the loop where it matters.",
    items: ["OCR · information extraction", "RAG", "LLM applications"],
  },
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
    role: "Founder & Software Engineer",
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
    href: "/projects/ai-workspace",
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
    { value: "<200 ms", label: "API response while document analysis ran asynchronously" },
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
