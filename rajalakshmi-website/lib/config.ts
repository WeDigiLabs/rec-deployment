// Configuration validation and utilities

export interface ApiConfig {
  baseUrl: string;
  isLocal: boolean;
  isProduction: boolean;
}

export function getApiConfig(): ApiConfig {
  // Log environment variables first
  console.log('[CONFIG.TS] Raw environment variables:', {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  // Check both possible environment variables
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cmsApiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace('/api', '');
  const fallbackUrl = 'https://reccms.flashserver.in';
  
  console.log('[CONFIG.TS] URL resolution steps:', {
    apiBaseUrl,
    cmsApiUrl,
    fallbackUrl,
  });
  
  const baseUrl = apiBaseUrl || cmsApiUrl || fallbackUrl;
  
  console.log('[CONFIG.TS] Final baseUrl:', baseUrl);
  console.log('[CONFIG.TS] Using fallback URL:', baseUrl === fallbackUrl);

  const isLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  const isProduction = !isLocal;

  // Always log configuration (not just in development)
  console.log('[CONFIG.TS] API Configuration:', {
    baseUrl,
    isLocal,
    isProduction,
    env: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    }
  });

  return {
    baseUrl,
    isLocal,
    isProduction,
  };
}

export function validateApiConfig(): string[] {
  const errors: string[] = [];
  const config = getApiConfig();

  // Validate URL format
  try {
    new URL(config.baseUrl);
  } catch {
    errors.push(`Invalid API base URL: ${config.baseUrl}`);
  }

  // Check if required environment variables are set
  if (!process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_CMS_API_URL) {
    errors.push('Neither NEXT_PUBLIC_API_BASE_URL nor NEXT_PUBLIC_CMS_API_URL is set');
  }

  return errors;
}
