import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's image optimizer is metered and the quota ran out (requests
    // returned 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED, breaking every
    // <Image>). Serve files as-is instead — public/ images are pre-sized WebP.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
