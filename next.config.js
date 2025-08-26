/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['@next-auth/prisma-adapter'],
  },
  async rewrites() {
    return [
      {
        source: '/api/donate',
        destination: 'http://localhost:3001/donate',
      },
    ];
  },
};

module.exports = nextConfig;
