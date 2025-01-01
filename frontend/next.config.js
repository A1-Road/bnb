/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'example.com'],
    deviceSizes: [240, 480, 720],
    imageSizes: [120, 180, 240],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
