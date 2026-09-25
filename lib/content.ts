// Single source for site copy. Every claim here comes from the résumé (public/resume.pdf);
// keep it that way so each line is defensible in an interview.

export const site = {
  name: "Hope Tuyishime Wilberforce",
  email: "tuyishimehope01@gmail.com",
  resume: "/resume.pdf", // copied from doc/
  linkedin: "https://www.linkedin.com/in/hope-tuyishime/",
  github: "https://github.com/tuyishimehope",
  location: "Kigali, Rwanda",
};

export type ProjectMedia =
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "video"; src: string; label: string };

export type Project = {
  slug: string;
  title: string;
  problem: string;
  role: string;
  stack: string[];
  year?: string; // omit when unknown; the UI skips it
  visual: string; // describes the placeholder until a real image exists
  media?: ProjectMedia; // real screenshot or screen recording; falls back to the placeholder
  accent: "growth" | "energy" | "playful"; // one decorative color per project
  // Case-study body. Keep every claim defensible in an interview.
  caseStudy: { heading: string; body: string }[];
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
    type: "image",
    src: "/projects/trustplot.webp",
    alt: "Trustplot property workspace: satellite map with a parcel boundary and site intelligence for parcel 11337 in Kanombe, Kicukiro",
    width: 2000,
    height: 1200,
  },
  accent: "growth",
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
    problem: "Long-running document analysis shouldn’t block the API that receives the documents.",
    role: "Personal project",
    stack: ["Celery", "Redis", "Docker"],
    visual: "Upload → queue → workers → storage",
    media: { type: "video", src: "/projects/docflow.mp4", label: "DocFlow screen recording" },
    accent: "energy",
    caseStudy: [
      {
        heading: "Context",
        body: "AI document analysis (OCR, extraction) can take far longer than a web request should. Running it inside the request makes the API slow and fragile.",
      },
      {
        heading: "What I built",
        body: "A distributed AI document-processing platform. Uploads return immediately; Celery workers on Redis pick up the analysis as background jobs.",
      },
      {
        heading: "Hard parts",
        body: "Keeping long-running analysis entirely outside the request–response cycle, and containerising every service with Docker so the whole pipeline runs the same way on any machine.",
      },
      {
        heading: "Outcome",
        body: "A containerised reference implementation of the asynchronous processing pattern I also used in production at IFAD.",
      },
    ],
  },
  {
    slug: "document-intelligence",
    title: "Document intelligence at IFAD",
    problem: "A UN agency needed incoming documents ingested, read, reviewed and archived without slowing its systems down.",
    role: "Full-stack engineer (internship)",
    stack: ["FastAPI", "PostgreSQL", "Azure Service Bus"],
    year: "2025–26",
    visual: "Ingest → OCR → extraction → human review → archive",
    accent: "playful",
    caseStudy: [
      {
        heading: "Context",
        body: "At IFAD, the International Fund for Agricultural Development (a UN specialised agency in Rome), documents had to go through ingestion, OCR, information extraction, human review and archival: around 100 documents a day.",
      },
      {
        heading: "What I built",
        body: "Python FastAPI and PostgreSQL services for the full workflow, with asynchronous pipelines on Azure Service Bus and distributed background workers. I designed the PostgreSQL schemas and optimised the queries for AI-extracted document data, and built the React, Next.js and TypeScript review interfaces.",
      },
      {
        heading: "Hard parts",
        body: "Failure handling in a distributed, long-running workflow. I implemented retry, recovery and failure-handling mechanisms across the asynchronous services.",
      },
      {
        heading: "Outcome",
        body: "API responses stayed under 200 ms while document analysis ran outside the request cycle, and failed jobs dropped by 60%.",
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
    start: "Mar 2025",
    end: "Apr 2026",
    role: "Full-stack Software Engineer (Internship)",
    org: "IFAD, Rome",
    impact:
      "Built FastAPI and PostgreSQL services for document ingestion, OCR, extraction and review (~100 documents a day), with Azure Service Bus workers that kept APIs under 200 ms and cut failed jobs by 60%.",
    href: "/projects/document-intelligence",
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
    degree: "BSc (Honours) Software Engineering",
    honours: "Distinction",
    school: "Adventist University of Central Africa",
    year: "2025",
  },
  relocation: "Rwandan citizen · familiar with EU Blue Card and Dutch Highly Skilled Migrant routes",
  impact: [
    { value: "~100", label: "documents a day through the IFAD pipeline" },
    { value: "<200 ms", label: "API responses while analysis ran in the background" },
    { value: "−60%", label: "failed jobs after retry and recovery work" },
  ],
};

export const projects = [flagship, ...secondary];

// Leave empty until real posts exist; the Writing section hides itself.
export const posts: { date: string; title: string; readTime: string; href: string }[] = [];
