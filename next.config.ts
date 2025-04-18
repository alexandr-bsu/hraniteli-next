import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns:[
      {
          protocol: 'https',
          hostname:"drive.google.com",
          
      }
    ]
  }
};

export default nextConfig;
