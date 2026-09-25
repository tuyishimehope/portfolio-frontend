import { handleRouteChange, initAnalytics } from "@/lib/analytics";

// PostHog analytics: see lib/analytics.ts for what is tracked and the consent model.
try {
  initAnalytics();
} catch {
  /* analytics must never break the site */
}

export function onRouterTransitionStart(url: string) {
  try {
    handleRouteChange(url);
  } catch {
    /* ignore */
  }
}
