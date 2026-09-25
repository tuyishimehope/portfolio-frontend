"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Monitor, MoonStar, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Theme = "light" | "system" | "dark";
let fallback: Theme = "system";

function getTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return fallback;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("theme-change", callback);
  };
}

function choose(value: Theme) {
  fallback = value;
  try {
    localStorage.setItem("theme", value);
  } catch {
    // Keep the choice for this visit when storage is unavailable.
  }
  window.dispatchEvent(new Event("theme-change"));
  track("theme_changed", { theme: value });
}

const options = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "system", label: "System theme", icon: Monitor },
  { value: "dark", label: "Dark theme", icon: MoonStar },
] as const;

export default function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "system" as const);

  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && system.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    system.addEventListener("change", apply);
    return () => system.removeEventListener("change", apply);
  }, [theme]);


  return (
    <div role="group" aria-label="Color theme" className="inline-flex items-center rounded-full border bg-card p-1">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          title={label}
          onClick={() => choose(value)}
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-colors",
            theme === value ? "bg-muted text-ink" : "text-muted-foreground hover:bg-muted hover:text-ink",
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
