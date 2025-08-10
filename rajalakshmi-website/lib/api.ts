const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://reccms.flashserver.in';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
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