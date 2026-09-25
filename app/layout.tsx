import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageShell from "@/components/page-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hope Tuyishime — Backend Engineer",
  description:
    "Backend engineer in Kigali building reliable systems for real-world problems. Open to relocation.",
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
        <PageShell header={<Header />} footer={<Footer />}>
          {children}
        </PageShell>
      </body>
    </html>
  );
}
