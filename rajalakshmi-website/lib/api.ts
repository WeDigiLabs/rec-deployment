// Log environment variables for debugging
console.log('[API.TS] Environment variables:', {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://reccms.flashserver.in';

// Log the resolved API base URL
console.log('[API.TS] Resolved API_BASE:', API_BASE);
console.log('[API.TS] Using fallback URL:', API_BASE === 'https://reccms.flashserver.in');

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Log every API request
  console.log('[API.TS] Making API request to:', url);
  
  try {
    const res = await fetch(url, {
      ...options,
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API error: ${res.status} ${res.statusText} - ${url}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error('API fetch error:', err);
    throw err;
  }
}

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE}${imagePath}`;
}

export function getDepartmentImageUrl(imgUrl: string | undefined | null, departmentCode: string | undefined): string {
  // If imgUrl is provided and it's not the default fallback path, use the API image URL
  if (imgUrl && imgUrl !== "/assets/departments/aero/department-image.png") {
    return getImageUrl(imgUrl);
  }
  // Otherwise, use the local department image with fallback for undefined departmentCode
  const code = departmentCode ? departmentCode.toLowerCase().replace(/\s/g, '') : 'default';
  return `/assets/departments/${code}/department-image.png`;
} 