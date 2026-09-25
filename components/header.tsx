"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { site } from "@/lib/content";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  // True while the header sits over a dark "space" hero (only the homepage has one).
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const hero = document.querySelector("[data-dark-hero]");
      setOverDark(hero ? hero.getBoundingClientRect().bottom > 64 : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        overDark
          ? scrolled
            ? "border-white/10 bg-[#061327]/60 backdrop-blur-xl"
            : "border-transparent bg-transparent"
          : scrolled
            ? "border-border bg-background/90 backdrop-blur"
            : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
        <Link href="/" className={cn("text-lg font-semibold tracking-tight", overDark ? "text-white" : "text-ink")}>
          Hope<span className={overDark ? "text-[#8b85ff]" : "text-primary"}>.</span>
        </Link>

        <ul className="hidden items-center gap-8 text-[15px] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center transition-colors",
                  overDark
                    ? isActive(l.href)
                      ? "font-medium text-white"
                      : "text-[#c3cde1] hover:text-white"
                    : isActive(l.href)
                      ? "font-medium text-ink"
                      : "text-body hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Button
              asChild
              variant="outline"
              className={cn(
                "h-9 rounded-full px-4 text-[15px]",
                overDark
                  ? "border-white/20 bg-white/[0.06] text-white hover:bg-white/15 hover:text-white"
                  : "border-ink bg-transparent text-ink hover:bg-ink hover:text-background",
              )}
            >
              <a href={site.resume} target="_blank" rel="noopener noreferrer">
                Résumé <span className="arrow arrow-up" aria-hidden>↗</span>
              </a>
            </Button>
          </li>
        </ul>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", overDark && "text-white hover:bg-white/10 hover:text-white")}
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background px-6 pt-16">
            <SheetTitle className="meta">Menu</SheetTitle>
            <ul className="mt-2 flex flex-col gap-1 text-[22px] font-semibold tracking-tight">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={cn("block py-2", isActive(l.href) ? "text-primary" : "text-ink")}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 h-11 rounded-full text-[16px] hover:bg-primary-hover">
              <a href={site.resume} target="_blank" rel="noopener noreferrer">
                Résumé ↗
              </a>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
