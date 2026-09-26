/*
  Blog posts as typed content: no MDX pipeline, no extra dependencies.
  Inline markup inside text: `code` and **bold**.
  Every technical claim must match the real system; nothing here exposes
  hosts, credentials, dataset paths or environment values.
*/

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "note"; text: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  project?: string; // related case study slug
  blocks: Block[];
};

export const allPosts: Post[] = [
  {
    slug: "how-i-built-the-trustplot-api",
    title: "How I built the Trustplot API",
    description:
      "The FastAPI monolith behind Trustplot: parcel lookups over Kigali GIS data, risk ratings that admit what they don’t know, screening that survives failing layers, and PDF reports.",
    date: "2026-09-26",
    tags: ["FastAPI", "PostGIS", "GIS", "System design"],
    project: "trustplot",
    blocks: [
      {
        type: "p",
        text: "Buying land in Rwanda means answering a handful of questions before anyone signs anything: where exactly is the plot, what is it zoned for, is part of it wetland, can you reach it by road, and what is it roughly worth? The answers exist, but they are spread across different maps and records. Trustplot pulls them into one search by parcel number (the UPI) and one downloadable report.",
      },
      {
        type: "p",
        text: "This post is about the backend that does that work: a Python API for property intelligence and preliminary land due diligence. It is not a legal service. Results support an investigation; they don’t replace one, and the API is designed to say so in its data, not just in a disclaimer.",
      },

      { type: "h2", id: "monolith", text: "One service, organised by domain" },
      {
        type: "p",
        text: "Trustplot’s API is a monolith, on purpose. I’m one engineer, every feature leans on the same GIS data and the same database, and one deployable is far easier to reason about than five. The boundaries live in the folder structure instead of the network:",
      },
      {
        type: "code",
        lang: "text",
        code: `app/
  api/                HTTP routes and health endpoints
  core/               settings, database, HTTP client, GIS layers, middleware
  db/models/          SQLAlchemy models
  service/
    parcel/           fetching, caching and enrichment
    zoning/           zoning profiles and regulations
    valuation/        reference price calculations
    risk/             parcel risk assessment
    road/             mapped road proximity
    site_screening/   GIS queries, spatial analysis, stored screenings
    report/           report assembly, PDF layout and maps
  utils/              UPI and geometry utilities`,
      },
      {
        type: "p",
        text: "The stack is FastAPI and Pydantic at the edge; SQLAlchemy async sessions over asyncpg into PostgreSQL with PostGIS; Alembic for migrations; HTTPX for GIS calls; Shapely and pyproj for geometry; ReportLab and Pillow for reports.",
      },

      { type: "h2", id: "upi", text: "The UPI is the front door" },
      {
        type: "p",
        text: "Everything starts from a UPI such as `1/01/06/05/499`. Because a UPI contains slashes, it travels as a query parameter rather than a path segment. It is trimmed and validated as numeric segments separated by slashes; anything else is rejected with a `422` before any GIS work happens.",
      },
      {
        type: "table",
        head: ["Method", "Endpoint", "Result"],
        rows: [
          ["GET", "/api/v1/parcels/?upi=…", "Enriched parcel JSON"],
          ["GET", "/api/v1/zoning/{zone_code}", "Zoning profile"],
          ["POST", "/api/v1/site-screenings?upi=…", "Run and store a screening (201)"],
          ["GET", "/api/v1/site-screenings?upi=…", "Latest stored screening"],
          ["GET", "/api/v1/report?upi=…", "PDF report (download=true for an attachment)"],
          ["GET", "/api/health/live · /ready", "Liveness · database readiness (503 if down)"],
        ],
        caption: "The public surface is small on purpose.",
      },
      {
        type: "code",
        lang: "bash",
        code: `curl --get 'http://127.0.0.1:8000/api/v1/parcels/' \\
  --data-urlencode 'upi=1/01/06/05/499'`,
        caption: "Looking up a parcel. Let curl encode the slashes.",
      },

      { type: "h2", id: "gis", text: "Being a good citizen to the GIS services" },
      {
        type: "p",
        text: "Parcel and screening data come from Kigali’s GIS datasets over ArcGIS REST. Those services aren’t mine, so the API treats them carefully:",
      },
      {
        type: "list",
        items: [
          "**One shared HTTP client** for the whole application, instead of a new connection per request.",
          "**A configurable concurrency limit** on outbound GIS requests per worker (six by default, between 1 and 32), so a burst of screenings can’t flood the upstream service.",
          "**Pagination handled explicitly** when a layer returns more features than one page.",
          "**A PostgreSQL parcel cache** with a refresh interval (30 days by default), plus primary and fallback sources with timestamps, so every answer says where it came from and how fresh it is.",
        ],
      },

      { type: "h2", id: "unknown", text: "Unknown is not zero" },
      {
        type: "p",
        text: "This is the rule the whole system is built around. When you’re helping someone decide whether to buy land, a confident wrong answer is worse than an honest gap. So missing data is never quietly turned into a reassuring number:",
      },
      {
        type: "list",
        items: [
          "If a GIS layer fails or comes back incomplete, it is marked **unavailable** in the sources, and the fields it feeds become **unknown**, not zero.",
          "Screening keeps the layers that succeeded when another one fails. Only when **every** layer fails does it give up, with a `502`.",
          "Risk assessment carries an **evidence-completeness** indicator, and incomplete evidence **cannot** produce an overall low rating.",
          "Screening results are `clear`, `review` or `unknown`. `evidence_complete` is only true when every layer was available and every component status is known.",
          "Unrecognised slope classes are marked unknown instead of being guessed.",
        ],
      },
      {
        type: "note",
        text: "A `clear` screening is not a guarantee of development approval or infrastructure availability, and mapped road proximity does not establish legal access. The API encodes those limits in its responses so the frontend and the PDF can’t accidentally overstate them.",
      },

      { type: "h2", id: "valuation", text: "Reference valuation, and when to refuse" },
      {
        type: "p",
        text: "The reference value is deliberately simple: parcel area multiplied by the published transaction price for the parcel’s cell. The interesting part is when it declines to answer. If the reference data holds conflicting active prices, or prices in different currencies, the estimate is suppressed rather than averaged into something plausible-looking. It is a reference figure, not a certified valuation, and it is labelled that way.",
      },

      { type: "h2", id: "async", text: "Keeping slow work out of the way" },
      {
        type: "p",
        text: "The API is async end to end, which only pays off if nothing blocks the event loop or hogs the database. Two rules keep it honest:",
      },
      {
        type: "list",
        items: [
          "**CPU-heavy work runs in worker threads**: spatial calculations with Shapely and pyproj, and PDF and image rendering with ReportLab and Pillow.",
          "**Database transactions cover only database reads and writes.** GIS requests, spatial analysis and PDF rendering all happen outside them, so a slow upstream map service never holds a database connection hostage.",
        ],
      },

      { type: "h2", id: "screenings", text: "Screenings are records, not views" },
      {
        type: "p",
        text: "A site screening checks terrain, road access, rights-of-way, nearby infrastructure and environmental constraints. Each `POST` runs a fresh analysis and stores it (`201`); a `GET` returns the latest stored screening without re-running anything. Stored results keep their failed layers and evidence flags, so reading a screening later tells you exactly what was and wasn’t known when it ran.",
      },
      {
        type: "code",
        lang: "bash",
        code: `# Run a screening (the UPI goes in the query string, not a JSON body)
curl -X POST \\
  'http://127.0.0.1:8000/api/v1/site-screenings?upi=1%2F01%2F06%2F05%2F499'

# Save the PDF report
curl --fail --get 'http://127.0.0.1:8000/api/v1/report' \\
  --data-urlencode 'upi=1/01/06/05/499' \\
  --data-urlencode 'download=true' \\
  --output trustplot-report.pdf`,
      },
      {
        type: "p",
        text: "The report is rendered directly with ReportLab: property summary cards, parcel maps, valuation evidence, zoning, risk labels, findings, warnings and sources, with page headers and footers. The sources and warnings travel with the PDF, because that is the version people forward.",
      },

      { type: "h2", id: "auth", text: "Authentication, kept minimal and fail-closed" },
      {
        type: "p",
        text: "Property endpoints are public. Accounts exist for what comes next, so authentication is deliberately small:",
      },
      {
        type: "list",
        items: [
          "Email and password registration and login, with bearer tokens and a `/me` endpoint.",
          "Passwords of 8–128 characters, stored as **Argon2id** hashes; emails normalised to lowercase and unique. Public responses never include the password hash.",
          "**No default signing key.** Until a strong secret is configured, login returns `503` instead of silently signing tokens with something guessable.",
          "Clear status codes: `401` for bad credentials or expired tokens, `409` for duplicate registrations.",
        ],
      },
      {
        type: "p",
        text: "It doesn’t yet have refresh tokens, password resets, email verification or token revocation, and the documentation says so plainly. Knowing what a system doesn’t do is part of operating it.",
      },

      { type: "h2", id: "operations", text: "Operations: make the dangerous steps explicit" },
      {
        type: "list",
        items: [
          "**Liveness and readiness are separate**: `/api/health/live` says the process is up; `/api/health/ready` checks the database and returns `503` when it isn’t reachable.",
          "**Migrations are an explicit step**, never a side effect of the API starting.",
          "**Reference-data imports are deliberate commands**, because the transaction-price import replaces its table. Nothing destructive runs just because a container restarted.",
          "**Interactive docs are off in production**, and in Docker Compose the database is only reachable inside the Compose network.",
        ],
      },

      { type: "h2", id: "lessons", text: "What I’d tell myself at the start" },
      {
        type: "list",
        items: [
          "**Model uncertainty as data.** `unknown` and `evidence_complete` are fields, not footnotes. It made the frontend and the PDF honest for free.",
          "**Partial success is a feature.** One failing map layer shouldn’t cost the user the other six.",
          "**Keep slow things out of transactions and off the event loop** from day one; retrofitting that is painful.",
          "**Make irreversible operations boring and explicit**: migrations, imports and secrets should never happen by accident.",
        ],
      },
      {
        type: "p",
        text: "Trustplot is live. If you want to see these decisions from the user’s side, search a parcel and download its report.",
      },
    ],
  },
];

/** Plain words in a post, for reading time. */
function wordCount(post: Post) {
  const text = post.blocks
    .map((b) => {
      switch (b.type) {
        case "list":
          return b.items.join(" ");
        case "table":
          return [...b.head, ...b.rows.flat()].join(" ");
        case "code":
          return "";
        default:
          return b.text;
      }
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function readTime(post: Post) {
  return `${Math.max(1, Math.round(wordCount(post) / 220))} min read`;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getPost(slug: string) {
  return allPosts.find((p) => p.slug === slug);
}
