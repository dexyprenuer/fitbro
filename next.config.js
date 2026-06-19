/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
};

module.exports = nextConfig;