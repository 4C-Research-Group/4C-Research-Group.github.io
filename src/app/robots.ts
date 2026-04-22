import type { MetadataRoute } from "next";
import { getMetadataBaseUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = getMetadataBaseUrl();
  const sitemap = new URL("sitemap.xml", base).toString();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/login/",
          "/signup/",
          "/forgot-password/",
          "/auth/",
        ],
      },
    ],
    sitemap,
  };
}
