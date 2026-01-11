/** @type {import('next').NextConfig} */
const repo = "mobile-invite"; // ← GitHub 레포 이름이랑 반드시 동일하게!
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  env: {
    // 환경 변수는 .env.local (로컬) 또는 GitHub Secrets (프로덕션)에서 주입됨
    // API 키는 Google Cloud Console에서 도메인 제한이 설정되어 있어 안전함
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  },
};

module.exports = nextConfig;
