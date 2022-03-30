module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["images.microcms-assets.io", "img.youtube.com"],
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
    }
  },
};
