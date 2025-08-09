import type { NextConfig } from "next";

// Get the API base URL and extract the domain
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://reccms.flashserver.in';
const apiDomain = new URL(apiBaseUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', apiDomain],
  },
  
};

export default nextConfig;
