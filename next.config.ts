/**
 * @file This file contains the configuration for the Next.js application.
 * It includes settings for TypeScript, ESLint, image optimization, and experimental features.
 */

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // TypeScript settings
  typescript: {
    // Ignores build errors. Useful for rapid prototyping, but should be
    // disabled for production builds to ensure type safety.
    ignoreBuildErrors: true,
  },
  // ESLint settings
  eslint: {
    // Ignores ESLint errors during builds.
    ignoreDuringBuilds: true,
  },
  // Image optimization settings
  images: {
    // Defines a list of allowed hostnames for optimized images using next/image.
    // This prevents malicious users from using your optimization service for external images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This section is for experimental Next.js features.
    // The properties here may change between Next.js versions.
  },
  // Security setting to allow connections from specific origins during development.
  // This is necessary for environments like Google Cloud Workstations and Firebase Studio.
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev',
    'https://*.firebase.studio',
  ],
};

export default nextConfig;
