import { useCallback, useState } from 'react';
import { useRive, decodeImage } from '@rive-app/react-canvas';
import type { ImageAsset } from '@rive-app/react-canvas';
import { getAssetUrl, isBodyPart, fetchImageBytes } from '../utils/assetLoader';
import { STATE_MACHINE_NAME, TRIGGERS, BODY_PARTS } from '../utils/constants';
import type { BuddyCharacter, BuddyState } from '../types/buddy';

interface UseBuddyRiveOptions {
  character: BuddyCharacter;
  resolution?: '1x' | '2x' | '3x';
  autoplay?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface UseBuddyRiveReturn {
  RiveComponent: React.ComponentType;
  rive: ReturnType<typeof useRive>['rive'];
  state: BuddyState;
  triggerTap: () => void;
  triggerWave: () => void;
  triggerJump: () => void;
  triggerBlink: () => void;
  setInput: (name: string, value: boolean | number) => void;
}

export function useBuddyRive({
  character,
  resolution = '2x',
  autoplay = true,
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
    async (asset: ImageAsset, bytes: Uint8Array): Promise<boolean> => {
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
          const url = getAssetUrl(character.folderName, assetName, resolution);
          console.log(`Loading asset: ${assetName} from ${url}`);

          const imageBytes = await fetchImageBytes(url);
          const image = await decodeImage(imageBytes);

          // Set the image on the asset
          asset.setRenderImage(image);

          // Clean up to prevent memory leak
          image.unref();

          // Update loading state
          setState((prev) => ({
            ...prev,
            assetsLoaded: prev.assetsLoaded + 1,
          }));

          return true; // We handled this asset
        } catch (error) {
          console.error(`Failed to load asset ${assetName}:`, error);
          onError?.(error as Error);
          return false;
        }
      }

      return false; // Let runtime handle unknown assets
    },
    [character.folderName, resolution, onError]
  );

  // Initialize Rive
  const { rive, RiveComponent } = useRive({
    src: '/buddy-template.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay,
    assetLoader,
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
      const inputs = getInputs();
      if (!inputs) return;

      const trigger = inputs.find(
        (input: { name: string }) => input.name === triggerName
      );
      if (trigger && 'fire' in trigger) {
        (trigger as { fire: () => void }).fire();
        setState((prev) => ({ ...prev, currentAnimation: triggerName }));
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
  const triggerTap = useCallback(() => fireTrigger(TRIGGERS.TAP), [fireTrigger]);
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
    triggerTap,
    triggerWave,
    triggerJump,
    triggerBlink,
    setInput,
  };
}
