import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "tamedbeautyhaven.com" },
      { protocol: "https", hostname: "cdn.shopify.com" }
    ]
  }
};

export default nextConfig;
