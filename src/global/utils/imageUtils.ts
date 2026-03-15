
import { BACKEND_API_URL } from '@env';

/**
 * Constructs a full URL for images stored on the backend.
 * Assumes images are in the 'storage' directory of the main domain.
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  // Extract base domain from BACKEND_API_URL (e.g., https://api2.potanshop.com/api -> https://api2.potanshop.com)
  const baseDomain = BACKEND_API_URL.split('/api')[0] + '/api' + BACKEND_API_URL.split('/api')[1];

  return `${baseDomain}/storage/${path}`;
}
