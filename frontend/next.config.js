/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a minimal standalone server (.next/standalone) for small Docker images.
  output: "standalone",
};

module.exports = nextConfig;
