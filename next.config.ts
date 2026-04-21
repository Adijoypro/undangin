import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pjzoptjskecuhnebwxta.supabase.co",
      },
    ],
  },
  eslint: {
    // Biar gak ganggu pas build di Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
