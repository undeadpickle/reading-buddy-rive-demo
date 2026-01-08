import { useCallback, useState } from 'react';
import { useRive, decodeImage } from '@rive-app/react-canvas';
import type { FileAsset, ImageAsset } from '@rive-app/react-canvas';
import { getAssetUrl, isBodyPart, fetchImageBytes } from '../utils/assetLoader';
import { STATE_MACHINE_NAME, TRIGGERS, BODY_PARTS, DEFAULT_CDN_SUBFOLDER } from '../utils/constants';
import type { BuddyCharacter, BuddyState } from '../types/buddy';

interface UseBuddyRiveOptions {
  src?: string;              // Path to .riv file
  cdnSubfolder?: string;     // 'buddies' or 'buddies_cropped_parts'
  character: BuddyCharacter;
  resolution?: '1x' | '2x' | '3x';
  autoplay?: boolean;
  assetCache?: Map<string, Uint8Array>;
  onAllAssetsLoaded?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface UseBuddyRiveReturn {
  RiveComponent: React.ComponentType;
  rive: ReturnType<typeof useRive>['rive'];
  state: BuddyState;
  triggerWave: () => void;
  triggerJump: () => void;
  triggerBlink: () => void;
  setInput: (name: string, value: boolean | number) => void;
}

export function useBuddyRive({
  src = `${import.meta.env.BASE_URL}buddy-template.riv`,
  cdnSubfolder = DEFAULT_CDN_SUBFOLDER,
  character,
  resolution = '2x',
  autoplay = true,
  assetCache,
  onAllAssetsLoaded,
  onLoad,
  onError,
}: UseBuddyRiveOptions): UseBuddyRiveReturn {
  const [state, setState] = useState<BuddyState>({
    isLoaded: false,
    isPlaying: false,
    currentAnimation: null,
    assetsLoaded: 0,
    totalAssets: BODY_PARTS.length,
  });

  // Asset loader callback - handles loading images from CDN
  const assetLoader = useCallback(
    async (asset: FileAsset, bytes: Uint8Array): Promise<boolean> => {
      // If asset is already embedded or hosted on Rive CDN, let runtime handle it
      if (bytes.length > 0 || (asset.cdnUuid && asset.cdnUuid.length > 0)) {
        return false;
      }

      // Only handle image assets
      if (!asset.isImage) {
        return false;
      }

      const assetName = asset.name;

      // Check if this is a body part we need to load
      if (isBodyPart(assetName)) {
        try {
          let imageBytes: Uint8Array;

          // Use cache if available, otherwise fetch
          if (assetCache?.has(assetName)) {
            imageBytes = assetCache.get(assetName)!;
            console.log(`Using cached asset: ${assetName}`);
          } else {
            const url = getAssetUrl(cdnSubfolder, character.folderName, assetName, resolution);
            console.log(`Fetching asset: ${assetName} from ${url}`);
            imageBytes = await fetchImageBytes(url);
          }

          const image = await decodeImage(imageBytes);

          // Set the image on the asset (cast to ImageAsset since we checked isImage)
          (asset as ImageAsset).setRenderImage(image);

          // Clean up to prevent memory leak
          image.unref();

          // Update loading state and check if all assets are loaded
          setState((prev) => {
            const newCount = prev.assetsLoaded + 1;
            if (newCount === prev.totalAssets) {
              onAllAssetsLoaded?.();
            }
            return {
              ...prev,
              assetsLoaded: newCount,
            };
          });

          return true; // We handled this asset
        } catch (error) {
          console.error(`Failed to load asset ${assetName}:`, error);
          onError?.(error as Error);
          return false;
        }
      }

      return false; // Let runtime handle unknown assets
    },
    [cdnSubfolder, character.folderName, resolution, assetCache, onAllAssetsLoaded, onError]
  );

  // Initialize Rive
  // Note: assetLoader is typed as async but Rive runtime handles it correctly
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: STATE_MACHINE_NAME,
    autoplay,
    assetLoader: assetLoader as unknown as (asset: FileAsset, bytes: Uint8Array) => boolean,
    onLoad: () => {
      setState((prev) => ({ ...prev, isLoaded: true, isPlaying: autoplay }));
      onLoad?.();
    },
  });

  // Helper to get state machine inputs
  const getInputs = useCallback(() => {
    if (!rive) return null;
    return rive.stateMachineInputs(STATE_MACHINE_NAME);
  }, [rive]);

  // Fire a trigger input
  const fireTrigger = useCallback(
    (triggerName: string) => {
      console.log(`Attempting to fire trigger: ${triggerName}`);
      const inputs = getInputs();
      if (!inputs) {
        console.log('No inputs found - rive not ready');
        return;
      }
      console.log('Available inputs:', inputs.map((i: { name: string }) => i.name));

      const trigger = inputs.find(
        (input: { name: string }) => input.name === triggerName
      );
      if (trigger && 'fire' in trigger) {
        console.log(`Firing trigger: ${triggerName}`);
        (trigger as { fire: () => void }).fire();
        setState((prev) => ({ ...prev, currentAnimation: triggerName }));
      } else {
        console.log(`Trigger '${triggerName}' not found or has no fire method`);
      }
    },
    [getInputs]
  );

  // Set a boolean or number input
  const setInput = useCallback(
    (name: string, value: boolean | number) => {
      const inputs = getInputs();
      if (!inputs) return;

      const input = inputs.find(
        (input: { name: string }) => input.name === name
      );
      if (input && 'value' in input) {
        (input as { value: boolean | number }).value = value;
      }
    },
    [getInputs]
  );

  // Convenience trigger methods
  const triggerWave = useCallback(
    () => fireTrigger(TRIGGERS.WAVE),
    [fireTrigger]
  );
  const triggerJump = useCallback(
    () => fireTrigger(TRIGGERS.JUMP),
    [fireTrigger]
  );
  const triggerBlink = useCallback(
    () => fireTrigger(TRIGGERS.BLINK),
    [fireTrigger]
  );

  return {
    RiveComponent,
    rive,
    state,
    triggerWave,
    triggerJump,
    triggerBlink,
    setInput,
  };
}
