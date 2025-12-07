import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cache-eggstv.cdnvideo.ru',
        pathname: '/**',
      }
    ],
  },
  // Конфигурация для работы с CSS модулями
  sassOptions: {
    includePaths: ['./src'],
  },
};

export default nextConfig;
