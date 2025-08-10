import type { NextConfig } from "next";

// Log environment variables at build time
console.log('[NEXT.CONFIG.TS] Environment variables at build time:', {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// Get the API base URL and extract the domain
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://reccms.flashserver.in';
console.log('[NEXT.CONFIG.TS] Resolved apiBaseUrl:', apiBaseUrl);
console.log('[NEXT.CONFIG.TS] Using fallback URL in next.config:', apiBaseUrl === 'https://reccms.flashserver.in');

const apiDomain = new URL(apiBaseUrl).hostname;
console.log('[NEXT.CONFIG.TS] Extracted domain:', apiDomain);

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', apiDomain],
  },
  
};

export default nextConfig;
