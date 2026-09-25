import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog reverse proxy: analytics go through this site's own domain (/ingest),
  // so ad blockers don't silently drop visitor data. US cloud; for EU use eu.i / eu-assets.i.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // PostHog API paths end in a trailing slash; don't redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
