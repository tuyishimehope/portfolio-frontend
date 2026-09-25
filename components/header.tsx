"use client";

import { useEffect, useState } from "react";
import { posts, site } from "@/lib/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  ...(posts.length ? [{ href: "#writing", label: "Writing" }] : []),
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-border bg-background" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
        <a href="#top" className="text-lg font-semibold tracking-tight">
          Hope<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 text-[15px] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-muted transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-foreground px-4 py-1.5 transition-colors hover:bg-foreground hover:text-background"
            >
              Résumé <span className="arrow arrow-up" aria-hidden>↗</span>
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="meta !text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-4 gap-y-3 px-4 pb-5 text-[17px] md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.resume} target="_blank" rel="noopener noreferrer">
              Résumé ↗
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
