import { CDN_BASE_URL, BODY_PARTS, type BodyPart } from './constants';

/**
 * Builds the CDN URL for a specific body part
 */
export function getAssetUrl(
  characterFolder: string,
  partName: string,
  resolution: '1x' | '2x' | '3x' = '2x'
): string {
  const suffix = resolution === '1x' ? '' : `@${resolution}`;
  return `${CDN_BASE_URL}/${characterFolder}/${partName}${suffix}.png`;
}

/**
 * Checks if an asset name is a known body part
 */
export function isBodyPart(name: string): name is BodyPart {
  return BODY_PARTS.includes(name as BodyPart);
}

/**
 * Fetches an image and returns it as a Uint8Array
 */
export async function fetchImageBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: {
      Accept: 'image/png,image/webp,image/jpeg,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Preloads all body parts for a character
 * Useful for caching before display
 */
export async function preloadCharacterAssets(
  characterFolder: string,
  resolution: '1x' | '2x' | '3x' = '2x'
): Promise<Map<string, Uint8Array>> {
  const assets = new Map<string, Uint8Array>();

  const loadPromises = BODY_PARTS.map(async (part) => {
    try {
      const url = getAssetUrl(characterFolder, part, resolution);
      const bytes = await fetchImageBytes(url);
      assets.set(part, bytes);
    } catch (error) {
      console.error(`Failed to preload ${part}:`, error);
    }
  });

  await Promise.all(loadPromises);
  return assets;
}
