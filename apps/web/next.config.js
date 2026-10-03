/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent filesystem packfile cache on Windows to prevent ENOENT vendor-chunks corruption
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
