import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "so-ma.fr",
      },
    ],
  },
};

export default nextConfig;
