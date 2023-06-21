/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/admin',
      destination: '/admin/election',
    },
  ],
}

module.exports = nextConfig
