import type { NextConfig } from "next";

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

/** Optional subpath; leave unset so org `*.github.io` site uses `/team/` not `/repo/team/`. */
const basePath =
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "") || undefined;

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
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
