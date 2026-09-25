import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageShell from "@/components/page-shell";
import AnalyticsConsent from "@/components/analytics-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Absolute URLs for social previews. Set NEXT_PUBLIC_SITE_URL once you have your own domain.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const description =
  "Backend engineer in Kigali building reliable systems: APIs, asynchronous workflows and AI-powered products. Previously IFAD (UN, Rome). Open to relocation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hope Tuyishime — Backend Engineer",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Hope Tuyishime",
    title: "Hope Tuyishime — Backend Engineer",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "Hope Tuyishime — Backend Engineer", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(()=>{let t="system";try{t=localStorage.getItem("theme")||"system"}catch{}const d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"})()` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <PageShell header={<Header />} footer={<Footer />}>
          {children}
        </PageShell>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
