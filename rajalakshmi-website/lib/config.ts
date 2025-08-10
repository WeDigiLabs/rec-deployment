// Configuration validation and utilities

export interface ApiConfig {
  baseUrl: string;
  isLocal: boolean;
  isProduction: boolean;
}

export function getApiConfig(): ApiConfig {
  // Check both possible environment variables
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
                  process.env.NEXT_PUBLIC_CMS_API_URL?.replace('/api', '') || 
                  'https://reccms.flashserver.in';

  const isLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  const isProduction = !isLocal;

  // Log configuration in development
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    console.log('API Configuration:', {
      baseUrl,
      isLocal,
      isProduction,
      env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
        NODE_ENV: process.env.NODE_ENV,
      }
    });
  }

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
