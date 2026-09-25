import posthog from "posthog-js";

/*
  Analytics (PostHog) helpers.

  Consent model (GDPR-friendly, PostHog's recommended banner pattern):
  - pending:  anonymous pageviews only, kept in memory (no cookies, no replay)
  - granted:  cookies/localStorage persistence + session replay
  - denied:   nothing is captured

  Private routes (admin, auth) are never tracked or recorded.
*/

export type Consent = "granted" | "denied" | "pending";

const CONSENT_KEY = "analytics-consent";
const INTERNAL_KEY = "analytics-internal"; // set via ?notrack=1 to exclude your own visits
export const CONSENT_EVENT = "analytics-consent-open";

export const PRIVATE_PATHS = /^\/(admin|login|signup|reset-password)(\/|$)/;

export const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage blocked: consent then lasts for this page only */
  }
}

export function getConsent(): Consent {
  const value = read(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : "pending";
}

export function isInternal(): boolean {
  return read(INTERNAL_KEY) === "1";
}

export function markInternal() {
  write(INTERNAL_KEY, "1");
}

export function setConsent(consent: Exclude<Consent, "pending">) {
  write(CONSENT_KEY, consent);
  if (!analyticsEnabled || isInternal()) return;

  if (consent === "granted") {
    if (!posthog.__loaded) return initAnalytics(); // was declined before: start fresh with consent
    posthog.set_config({ persistence: "localStorage+cookie" });
    posthog.opt_in_capturing();
    if (!PRIVATE_PATHS.test(window.location.pathname)) posthog.startSessionRecording();
  } else if (posthog.__loaded) {
    posthog.stopSessionRecording();
    posthog.opt_out_capturing();
  }
}

/** Reopen the consent banner (e.g. from the footer). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Named product events. Never pass personal data (names, emails, message text). */
export function track(event: string, properties?: Record<string, string | number | boolean>) {
  if (!analyticsEnabled) return;
  try {
    posthog.capture(event, properties);
  } catch {
    /* analytics must never break the page */
  }
}

/*
  PostHog, initialised once before the app becomes interactive.

  What it answers:
  - Where visitors come from: referrer, referring domain and UTM tags are captured
    automatically on every pageview ($referrer, $initial_referrer, utm_*).
  - How long they stay and how far they read: pageleave events carry time on page
    and scroll depth; sessions give total duration and pages per visit.
  - What they do: pageviews on client-side navigation, autocaptured clicks, heatmaps,
    rage clicks, named conversion events (below), and session replays (with consent).

  Not used for error monitoring (exception capture is off).
*/

let listening = false;

export function initAnalytics() {
  if (posthog.__loaded) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!analyticsEnabled || !key) return;

  // Your own visits: open any page once with ?notrack=1 to exclude this browser for good.
  if (new URLSearchParams(window.location.search).get("notrack") === "1") markInternal();
  if (isInternal()) return;

  // Keep local development out of production data unless explicitly enabled.
  const dev = process.env.NODE_ENV === "development";
  if (dev) {
    try {
      if (window.localStorage.getItem("analytics-dev") !== "1") return;
    } catch {
      return;
    }
  }

  const consent = getConsent();
  if (consent === "denied") return;
  const granted = consent === "granted";
  const onPrivatePage = PRIVATE_PATHS.test(window.location.pathname);

  posthog.init(key, {
    api_host: "/ingest", // reverse proxy (next.config.ts)
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30", // pageviews on client-side navigation + pageleave (time on page, scroll depth)
    person_profiles: "identified_only", // anonymous visitors don't create person profiles
    persistence: granted ? "localStorage+cookie" : "memory", // no cookies until consent
    respect_dnt: true,
    capture_exceptions: false,
    enable_heatmaps: true,
    disable_session_recording: !granted || onPrivatePage,
    session_recording: {
      maskAllInputs: true, // form fields never appear in replays
    },
    // Never send anything from admin or sign-in pages.
    before_send: (event) => {
      const url = event?.properties?.$current_url;
      if (typeof url === "string") {
        try {
          if (PRIVATE_PATHS.test(new URL(url).pathname)) return null;
        } catch {
          /* keep the event */
        }
      }
      return event;
    },
    loaded: (ph) => {
      if (dev) ph.debug();
    },
  });

  if (!listening) {
    document.addEventListener("click", trackLinkClick, { capture: true });
    listening = true;
  }
}

// Named events for the clicks that matter, so funnels and insights are one click away.
// Autocapture still records every click; these just give them readable names.
function trackLinkClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!link) return;

  const href = link.getAttribute("href") ?? "";
  const location =
    (link.closest("[data-dark-hero]") && "hero") ||
    (link.closest("header") && "header") ||
    (link.closest("footer") && "footer") ||
    link.closest("section[id]")?.id ||
    window.location.pathname;

  if (href.endsWith("resume.pdf")) return track("resume_opened", { location });
  if (href.startsWith("mailto:")) return track("contact_clicked", { channel: "email", location });

  let url: URL;
  try {
    url = new URL(link.href);
  } catch {
    return;
  }

  if (url.hostname.endsWith("linkedin.com")) return track("contact_clicked", { channel: "linkedin", location });
  if (url.hostname.endsWith("github.com")) return track("contact_clicked", { channel: "github", location });

  const project = url.origin === window.location.origin && url.pathname.match(/^\/projects\/([^/]+)$/);
  if (project) return track("case_study_opened", { project: project[1], location });

  if (url.origin !== window.location.origin) track("outbound_link_clicked", { domain: url.hostname, location });
}


/** Keep session replay off private routes during client-side navigation. */
export function handleRouteChange(url: string) {
  if (!posthog.__loaded || getConsent() !== "granted") return;
  const path = new URL(url, window.location.origin).pathname;
  if (PRIVATE_PATHS.test(path)) posthog.stopSessionRecording();
  else if (!posthog.sessionRecordingStarted()) posthog.startSessionRecording();
}
