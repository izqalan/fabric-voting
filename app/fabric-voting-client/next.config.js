/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/admin',
      destination: '/admin/home',
    },
  ],
}

module.exports = nextConfig
