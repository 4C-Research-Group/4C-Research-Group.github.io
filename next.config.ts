import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "/4c-research-website",
  assetPrefix: "/4c-research-website",
};

export default nextConfig;
