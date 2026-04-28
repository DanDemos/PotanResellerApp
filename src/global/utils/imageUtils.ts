
import { BACKEND_API_URL } from '@env';

/**
 * Constructs a full URL for images stored on the backend.
 * Assumes images are in the 'storage' directory of the main domain.
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseDomain = BACKEND_API_URL.split('/api')[0];
  console.log(baseDomain + "/storage/" + "custom_product_photos\/3a069d5d-958f-4581-b072-302e80c26a68_1775058164.jpg")

  return `${baseDomain}/storage/${path}`;
}
