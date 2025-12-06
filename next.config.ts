import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
    // allowedDevOrigins is now a top-level property in Next.js 14+
    // but this project seems to be on a version that requires it here.
    // If errors persist, we may need to move it.
    // For now, let's keep it here as per previous attempts.
  },
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev',
    'https://*.firebase.studio',
  ],
};

export default nextConfig;
