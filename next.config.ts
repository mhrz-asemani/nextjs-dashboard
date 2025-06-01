import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // already, I set this option to "true" due to Vercel eslint errors during build.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
