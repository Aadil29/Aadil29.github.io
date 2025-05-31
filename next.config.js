const path = require("path");

const nextConfig = {
  basePath: "/Aadil29.github.io",
  output: "export", // This makes it a static site
  distDir: "dist", // Missing comma was here
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    unoptimized: true, // Required for static export
    loader: "custom",
    loaderFile: "./ImageLoader.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media.dev.to",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media2.dev.to",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
