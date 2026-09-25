// Single source for homepage copy. Anything marked [TODO] still needs a real, defensible fact.

export const site = {
  name: "Hope Tuyishime Wilberforce",
  email: "tuyishimehope01@gmail.com",
  resume: "/resume.pdf", // copied from doc/
  linkedin: "https://www.linkedin.com/in/hope-tuyishime/",
  github: "https://github.com/tuyishimehope",
  location: "Kigali, Rwanda",
};

export type Project = {
  slug: string;
  title: string;
  problem: string;
  role: string;
  stack: string[];
  year: string;
  visual: string; // describes the placeholder until a real image exists
  accent: "growth" | "energy" | "playful"; // one decorative color per project
  // Case-study body. Keep every claim defensible in an interview.
  caseStudy: { heading: string; body: string }[];
};

const caseStudyTodo = [
  { heading: "Context", body: "[TODO] Who had the problem and why it mattered." },
  { heading: "What I built", body: "[TODO] Architecture, key decisions, and trade-offs." },
  { heading: "Hard parts", body: "[TODO] Failure modes, data issues, or scaling limits you handled." },
  { heading: "Outcome", body: "[TODO] Scope or real results only. No invented metrics." },
];

export const flagship: Project = {
  slug: "trustplot",
  title: "Trustplot",
  problem:
    "Land and property information in Rwanda is fragmented and hard to verify.",
  role: "Founder and engineer",
  stack: ["[TODO]", "[TODO]", "[TODO]"],
  year: "2026",
  visual: "Map / search results screenshot",
  accent: "growth",
  caseStudy: caseStudyTodo,
};

export const secondary: Project[] = [
  {
    slug: "docflow",
    title: "DocFlow",
    problem: "[TODO] One-sentence problem statement.",
    role: "[TODO]",
    stack: ["FastAPI", "PostgreSQL", "Queue workers"],
    year: "[TODO]",
    visual: "Upload → queue → workers → storage",
    accent: "energy",
    caseStudy: caseStudyTodo,
  },
  {
    slug: "ai-assistant",
    // [TODO] Anonymize if this was built at IFAD.
    title: "[TODO] AI enterprise project",
    problem: "[TODO] One-sentence problem statement.",
    role: "[TODO]",
    stack: ["Python", "LLM APIs", "[TODO]"],
    year: "[TODO]",
    visual: "Workflow diagram",
    accent: "playful",
    caseStudy: caseStudyTodo,
  },
];

export const capabilities = [
  { label: "Backend", items: ["Python", "FastAPI", "Java", "Spring Boot"] },
  { label: "Data", items: ["PostgreSQL", "Queues", "Background jobs"] },
  { label: "Infrastructure", items: ["Docker", "CI/CD"] },
  {
    label: "Product & AI",
    items: ["React / Next.js", "TypeScript", "LLM applications"],
  },
];

export const experience = [
  {
    years: "2025–26",
    role: "Full-stack Engineer Intern",
    org: "IFAD, Rome",
    impact: "[TODO] One line of scope or impact, no invented numbers.",
  },
  {
    years: "2024–25",
    role: "Software Engineer Apprentice",
    org: "AUCA Innovation Center",
    impact: "[TODO]",
  },
  {
    years: "2024",
    role: "Software Engineer Intern",
    org: "NetFella",
    impact: "[TODO]",
  },
  {
    years: "2023–24",
    role: "Software Engineer Apprentice",
    org: "Andela",
    impact: "[TODO]",
  },
];

export const projects = [flagship, ...secondary];

// Leave empty until real posts exist; the Writing section hides itself.
export const posts: { date: string; title: string; readTime: string; href: string }[] = [];
