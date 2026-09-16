import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Плейсхолдеры лежат локально в SVG. Внешние источники не используются.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
