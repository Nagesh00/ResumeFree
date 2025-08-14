/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle PDF.js worker
    if (!isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
    }
    
    // Handle pdfjs-dist
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.js': 'pdfjs-dist/build/pdf.worker.min.js',
    };

    return config;
  },
  images: {
    domains: [],
    unoptimized: true,
  },
  // Enable static exports for GitHub Pages
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
