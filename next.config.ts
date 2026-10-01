import type { NextConfig } from "next";

// Hide the Next.js dev badge (bottom-left "N"); compile and runtime errors still show.
const nextConfig: NextConfig = { devIndicators: false };

export default nextConfig;
