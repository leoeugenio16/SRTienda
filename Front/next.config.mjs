/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      dns: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
