/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove serverExternalPackages
  },
  // Add direct configuration for external packages if needed
  transpilePackages: ['@prisma/client'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig