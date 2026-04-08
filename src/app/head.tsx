import { publicAssetPath } from "@/lib/site-path";

export default function Head() {
  return (
    <>
      {/* Primary favicon - highest priority */}
      <link rel="icon" href={publicAssetPath("/favicon.ico")} sizes="32x32" />
      <link rel="shortcut icon" href={publicAssetPath("/favicon.ico")} />

      {/* PNG fallbacks */}
      <link
        rel="icon"
        type="image/png"
        href={publicAssetPath("/favicon-16x16.png")}
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href={publicAssetPath("/favicon-32x32.png")}
        sizes="32x32"
      />

      {/* Apple touch icon */}
      <link rel="apple-touch-icon" href={publicAssetPath("/apple-touch-icon.png")} />

      {/* Web manifest */}
      <link rel="manifest" href={publicAssetPath("/site.webmanifest")} />

      {/* Force browser to recognize favicon */}
      <meta name="msapplication-TileImage" content={publicAssetPath("/favicon-32x32.png")} />
      <meta name="msapplication-TileColor" content="#0284C7" />
    </>
  );
}
