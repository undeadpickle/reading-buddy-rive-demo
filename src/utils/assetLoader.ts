import { CDN_BASE_URL, DEFAULT_CDN_SUBFOLDER, BODY_PARTS, type BodyPart } from './constants';

/**
 * Builds the CDN URL for a specific body part
 * @param cdnSubfolder - 'buddies' for original, 'buddies_cropped_parts' for cropped
 * @param characterFolder - e.g., 'CatdogOrange'
 * @param partName - e.g., 'head', 'torso'
 * @param resolution - '1x' (no suffix), '2x' (@2x), '3x' (@3x)
 */
export function getAssetUrl(
  cdnSubfolder: string,
  characterFolder: string,
  partName: string,
  resolution: '1x' | '2x' | '3x' = '1x'
): string {
  const suffix = resolution === '1x' ? '' : `@${resolution}`;
  return `${CDN_BASE_URL}/${cdnSubfolder}/${characterFolder}/${partName}${suffix}.png`;
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
    cache: 'no-store',
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
 * @param cdnSubfolder - 'buddies' for original, 'buddies_cropped_parts' for cropped
 * @param characterFolder - e.g., 'CatdogOrange'
 * @param resolution - '1x', '2x', or '3x'
 */
export async function preloadCharacterAssets(
  cdnSubfolder: string = DEFAULT_CDN_SUBFOLDER,
  characterFolder: string,
  resolution: '1x' | '2x' | '3x' = '2x'
): Promise<Map<string, Uint8Array>> {
  const assets = new Map<string, Uint8Array>();

  const loadPromises = BODY_PARTS.map(async (part) => {
    try {
      const url = getAssetUrl(cdnSubfolder, characterFolder, part, resolution);
      const bytes = await fetchImageBytes(url);
      assets.set(part, bytes);
    } catch (error) {
      console.error(`Failed to preload ${part}:`, error);
    }
  });

  await Promise.all(loadPromises);
  return assets;
}
