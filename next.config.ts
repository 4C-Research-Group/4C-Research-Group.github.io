import type { NextConfig } from "next";
import { argv } from "node:process";
import { DEPLOY_BASE_DEFAULT } from "./src/lib/deploy-base-path";

/** `next dev` only — avoids 404 at http://localhost:3000/ when basePath is set. */
function isNextDevProcess(): boolean {
  return argv.some((a) => a === "dev" || a.endsWith("/dev") || a.endsWith("\\dev"));
}

function resolveBasePathForConfig(): string {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  return isNextDevProcess() ? "" : DEPLOY_BASE_DEFAULT;
}

const basePath = resolveBasePathForConfig();

function supabaseStorageImageHost(): string | undefined {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) return undefined;
  try {
    return new URL(u).hostname;
  } catch {
    return undefined;
  }
}

const storageHost = supabaseStorageImageHost();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: storageHost
      ? [
          {
            protocol: "https",
            hostname: storageHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
