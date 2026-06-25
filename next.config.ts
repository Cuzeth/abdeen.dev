import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // updates.abdeen.dev is a domain alias of this same project, so the whole
        // site is also reachable there — a duplicate. Pages already canonicalize
        // to abdeen.dev; this makes it explicit by keeping the alias host out of
        // search indexes entirely. Harmless on the Sparkle appcast it exists for.
        source: "/(.*)",
        has: [{ type: "host", value: "updates.abdeen.dev" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
