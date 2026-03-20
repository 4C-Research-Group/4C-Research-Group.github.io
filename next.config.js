/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "/4C-Lab",
  assetPrefix: "/4C-Lab/",
};

module.exports = nextConfig;
