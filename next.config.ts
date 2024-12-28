import type { NextConfig } from "next";

const nextConfig = {
    env: {
        API_HOST_URL: process.env.API_HOST_URL
    },
}

export default nextConfig;
