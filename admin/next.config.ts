import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    // The redesign previewed at /alternate before replacing the homepage.
    return [
      { source: "/alternate", destination: "/", permanent: true },
      { source: "/alternate/catalog", destination: "/catalog", permanent: true },
    ];
  },
};

export default nextConfig;
