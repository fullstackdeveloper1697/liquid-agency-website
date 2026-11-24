import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In development, Next.js only runs page scripts for localhost by default.
  // These entries let the site work when opened at 127.0.0.1 or from another
  // device on your network (the "Network:" address `npm run dev` prints).
  allowedDevOrigins: ["127.0.0.1", "0.0.0.0", "192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
