/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove experimental.serverActions since it's now stable in Next.js 15
    // Server Actions are enabled by default
    
    transpilePackages: ['@prisma/client'],
    
    typescript: {
      ignoreBuildErrors: true,
    },
    
    eslint: {
      ignoreDuringBuilds: true,
    },
    
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "i.giphy.com",
        },
        {
          protocol: "https",
          hostname: "plus.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "assets.aceternity.com",
        },
      ],
    },
  
    // Add security headers for production
    headers: async () => {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
          ],
        },
      ]
    },
  };
  
  module.exports = nextConfig;