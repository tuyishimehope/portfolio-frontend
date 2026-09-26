import type { NextConfig } from "next";

const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");
const posthogAssets = posthogHost === "https://eu.i.posthog.com"
  ? "https://eu-assets.i.posthog.com"
  : posthogHost === "https://us.i.posthog.com" ? "https://us-assets.i.posthog.com" : posthogHost;

const nextConfig: NextConfig = {
  // PostHog reverse proxy: analytics go through this site's own domain (/ingest),
  // so ad blockers don't silently drop visitor data. Region follows the configured host.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssets}/static/:path*` },
      { source: "/ingest/array/:path*", destination: `${posthogAssets}/array/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
  // PostHog API paths end in a trailing slash; don't redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
