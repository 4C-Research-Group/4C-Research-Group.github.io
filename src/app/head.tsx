import { SITE_BASE_PATH } from "@/lib/site-path";

/** Static asset URL under GitHub Pages repo path (matches `basePath`). */
function asset(href: string) {
  const base = SITE_BASE_PATH.replace(/\/$/, "");
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${base}${path}`;
}

export default function Head() {
  return (
    <>
      <link rel="icon" href={asset("/favicon.ico")} sizes="32x32" />
      <link rel="shortcut icon" href={asset("/favicon.ico")} />

      <link
        rel="icon"
        type="image/png"
        href={asset("/favicon-16x16.png")}
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href={asset("/favicon-32x32.png")}
        sizes="32x32"
      />

      <link rel="apple-touch-icon" href={asset("/apple-touch-icon.png")} />

      <link rel="manifest" href={asset("/site.webmanifest")} />

      <meta name="msapplication-TileImage" content={asset("/favicon-32x32.png")} />
      <meta name="msapplication-TileColor" content="#0284C7" />
    </>
  );
}
