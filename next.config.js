/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Enable App Router
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig