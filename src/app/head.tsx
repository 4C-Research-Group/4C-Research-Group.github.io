export default function Head() {
  return (
    <>
      {/* Primary favicon - highest priority */}
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* PNG fallbacks */}
      <link
        rel="icon"
        type="image/png"
        href="/favicon-16x16.png"
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon-32x32.png"
        sizes="32x32"
      />

      {/* Apple touch icon */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Web manifest */}
      <link rel="manifest" href="/site.webmanifest" />

      {/* Force browser to recognize favicon */}
      <meta name="msapplication-TileImage" content="/favicon-32x32.png" />
      <meta name="msapplication-TileColor" content="#0284C7" />
    </>
  );
}
