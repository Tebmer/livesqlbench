import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',  // 添加这行来启用静态导出
  images: {
    unoptimized: true  // 如果使用了 next/image，需要添加这个
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
