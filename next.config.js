/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages only serves static files (no Node server), so the app is built as a fully
  // static export into /out instead of relying on the Next.js server runtime. This app is
  // already client-side only (no API routes, no next/image, no server data fetching), so
  // nothing about its actual behavior changes — this only changes how the build output is
  // produced.
  output: 'export',
  // No next/image usage in this app, but this is the correct setting for a static export
  // regardless, since the Image Optimization API needs a server that GitHub Pages can't run.
  images: {
    unoptimized: true,
  },
  // Static hosts like GitHub Pages serve /path/index.html for /path/, so emitting
  // /path/index.html (trailingSlash: true) avoids 404s on refresh/deep links.
  trailingSlash: true,
  // GitHub Pages serves this project at https://liorsp1020.github.io/elite-drill/, not the
  // domain root, so every asset and route needs the repo name prefixed or CSS/JS 404s on
  // the deployed site. Keep this in sync with the actual repo name if it's ever renamed.
  basePath: '/elite-drill',
  assetPrefix: '/elite-drill/',
}

module.exports = nextConfig
