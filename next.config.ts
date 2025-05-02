import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ipfs.io', 'gateway.ipfs.io', 'ipfs.filebase.io'],
  }
};

export default nextConfig;
