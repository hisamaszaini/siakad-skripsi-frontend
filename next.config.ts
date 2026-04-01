import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => [
    {
      source: '/uploads/:path*',
      destination: 'http://127.0.0.1:4000/uploads/:path*',
    },
  ],
};

export default nextConfig;
