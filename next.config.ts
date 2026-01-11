/** @type {import('next').NextConfig} */
const repo = "mobile-invite"; // ← GitHub 레포 이름이랑 반드시 동일하게!
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

module.exports = nextConfig;
