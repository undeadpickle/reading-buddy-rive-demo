# Asset Loader Implementation

Complete code for CDN asset loading with React hooks.

## Table of Contents

1. [Types](#types)
2. [Constants](#constants)
3. [Asset Loader Utilities](#asset-loader-utilities)
4. [Main Hook](#main-hook)
5. [Component Wrapper](#component-wrapper)
6. [Other Asset Types](#other-asset-types) (fonts, audio)

---

## Types

```typescript
// src/types/buddy.ts

export interface BuddyCharacter {
  id: string;
  name: string;
  folderName: string; // CDN folder name, e.g., "CatdogOrange"
}

export type AnimationTrigger = 'wave' | 'jump' | 'blink';

export interface BuddyState {
  isLoaded: boolean;
  isPlaying: boolean;
  currentAnimation: string | null;
  assetsLoaded: number;
  totalAssets: number;
}
```

---

## Constants

```typescript
// src/utils/constants.ts

import type { BuddyCharacter } from '../types/buddy';

// CDN Configuration
export const CDN_BASE_URL = 'https://raw.githubusercontent.com/undeadpickle/reading-buddy-rive-demo/main/buddies';

// Body parts loaded from CDN (must match Rive asset names exactly)
export const BODY_PARTS = [
  'head',
  'headBack',
  'torso',
  'armLeft',
  'armRight',
  'legLeft',
  'legRight',
  'legSeparator',
  'tail',
  'eyeLeft',
  'eyeRight',
  'eyeBlinkLeft',
  'eyeBlinkRight',
] as const;

export type BodyPart = (typeof BODY_PARTS)[number];

// State machine configuration
export const STATE_MACHINE_NAME = 'BuddyStateMachine';

export const TRIGGERS = {
  WAVE: 'wave',
  JUMP: 'jump',
  BLINK: 'blink',
} as const;
```

---

## Asset Loader Utilities

```typescript
// src/utils/assetLoader.ts

import { CDN_BASE_URL, BODY_PARTS, type BodyPart } from './constants';

/**
 * Build CDN URL for a body part image
 */
export function getAssetUrl(
  characterFolder: string,
  partName: string,
  resolution: '1x' | '2x' | '3x' = '1x'
): string {
  const suffix = resolution === '1x' ? '' : `@${resolution}`;
  return `${CDN_BASE_URL}/${characterFolder}/${partName}${suffix}.png`;
}

/**
 * Type guard for known body parts
 */
export function isBodyPart(name: string): name is BodyPart {
  return BODY_PARTS.includes(name as BodyPart);
}

/**
 * Fetch image as Uint8Array for Rive decodeImage
 */
export async function fetchImageBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: {
      Accept: 'image/png,image/webp,image/jpeg,*/*',
    },
    cache: 'no-store', // Bypass cache during development
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Preload all body parts for a character (optional optimization)
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
```

---

## Main Hook

```typescript
// src/hooks/useBuddyRive.ts

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

  // Asset loader callback - THE KEY PATTERN
  const assetLoader = useCallback(
    async (asset: ImageAsset, bytes: Uint8Array): Promise<boolean> => {
      // Skip if already embedded or hosted on Rive CDN
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
          const imageBytes = await fetchImageBytes(url);
          const image = await decodeImage(imageBytes);

          // Set the image on the asset
          asset.setRenderImage(image);

          // CRITICAL: Clean up to prevent memory leak
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

  // Initialize Rive with custom asset loader
  const { rive, RiveComponent } = useRive({
    src: '/buddy-template.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay,
    assetLoader, // <-- Pass the custom loader here
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
  const triggerWave = useCallback(() => fireTrigger(TRIGGERS.WAVE), [fireTrigger]);
  const triggerJump = useCallback(() => fireTrigger(TRIGGERS.JUMP), [fireTrigger]);
  const triggerBlink = useCallback(() => fireTrigger(TRIGGERS.BLINK), [fireTrigger]);

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
```

---

## Component Wrapper

Use `forwardRef` to expose trigger methods to parent components:

```typescript
// src/components/BuddyCanvas.tsx

import { forwardRef, useImperativeHandle } from 'react';
import { useBuddyRive } from '../hooks/useBuddyRive';
import type { BuddyCharacter } from '../types/buddy';

interface BuddyCanvasProps {
  character: BuddyCharacter;
  width?: number;
  height?: number;
  onTap?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface BuddyCanvasRef {
  triggerWave: () => void;
  triggerJump: () => void;
  triggerBlink: () => void;
}

export const BuddyCanvas = forwardRef<BuddyCanvasRef, BuddyCanvasProps>(
  function BuddyCanvas(
    { character, width = 300, height = 300, onTap, onLoad, onError },
    ref
  ) {
    const { RiveComponent, state, triggerWave, triggerJump, triggerBlink } =
      useBuddyRive({
        character,
        resolution: '2x',
        onLoad,
        onError,
      });

    // Expose trigger methods via ref
    useImperativeHandle(ref, () => ({
      triggerWave,
      triggerJump,
      triggerBlink,
    }));

    const handleClick = () => {
      triggerWave(); // Wave when clicked
      onTap?.();
    };

    return (
      <div
        onClick={handleClick}
        style={{ width, height, cursor: 'pointer', position: 'relative' }}
      >
        {!state.isLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            Loading... ({state.assetsLoaded}/{state.totalAssets})
          </div>
        )}
        <RiveComponent />
      </div>
    );
  }
);
```

---

## Usage Example

```typescript
import { useRef, useState } from 'react';
import { BuddyCanvas, BuddyCanvasRef } from './components/BuddyCanvas';

const CHARACTERS = [
  { id: 'orange-cat', name: 'Orange Cat', folderName: 'CatdogOrange' },
  { id: 'gray-cat', name: 'Gray Cat', folderName: 'CatdogGray' },
];

function App() {
  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [key, setKey] = useState(0);
  const buddyRef = useRef<BuddyCanvasRef>(null);

  const switchCharacter = (newChar: typeof CHARACTERS[0]) => {
    setCharacter(newChar);
    setKey((k) => k + 1); // Force remount to reload assets
  };

  return (
    <div>
      <BuddyCanvas
        ref={buddyRef}
        key={key}
        character={character}
        width={300}
        height={300}
      />
      <button onClick={() => buddyRef.current?.triggerWave()}>Wave</button>
      <button onClick={() => buddyRef.current?.triggerJump()}>Jump</button>
    </div>
  );
}
```

---

## Other Asset Types

### Font Loading Pattern

```typescript
import { useRive, decodeFont } from '@rive-app/react-canvas';

const assetLoader = async (asset, bytes) => {
  if (bytes.length > 0 || asset.cdnUuid?.length > 0) return false;

  if (asset.isFont) {
    const response = await fetch(`${CDN_BASE}/fonts/${asset.name}.ttf`);
    const fontBytes = new Uint8Array(await response.arrayBuffer());
    const font = await decodeFont(fontBytes);

    asset.setFont(font);
    font.unref(); // CRITICAL: Prevent memory leak
    return true;
  }

  return false;
};
```

### Audio Loading Pattern

```typescript
import { useRive, decodeAudio } from '@rive-app/react-canvas';

const assetLoader = async (asset, bytes) => {
  if (bytes.length > 0 || asset.cdnUuid?.length > 0) return false;

  if (asset.isAudio) {
    const response = await fetch(`${CDN_BASE}/audio/${asset.name}.mp3`);
    const audioBytes = new Uint8Array(await response.arrayBuffer());
    const audio = await decodeAudio(audioBytes);

    asset.setAudio(audio);
    audio.unref(); // CRITICAL: Prevent memory leak
    return true;
  }

  return false;
};
```

### Combined Multi-Asset Loader

```typescript
const assetLoader = async (asset, bytes) => {
  // Skip embedded or Rive-hosted assets
  if (bytes.length > 0 || asset.cdnUuid?.length > 0) return false;

  try {
    if (asset.isImage) {
      const response = await fetch(`${CDN_BASE}/images/${asset.name}.png`, {
        headers: { Accept: 'image/png,image/webp,image/jpeg,*/*' }
      });
      const imageBytes = new Uint8Array(await response.arrayBuffer());
      const image = await decodeImage(imageBytes);
      asset.setRenderImage(image);
      image.unref();
      return true;
    }

    if (asset.isFont) {
      const response = await fetch(`${CDN_BASE}/fonts/${asset.name}.ttf`);
      const fontBytes = new Uint8Array(await response.arrayBuffer());
      const font = await decodeFont(fontBytes);
      asset.setFont(font);
      font.unref();
      return true;
    }

    if (asset.isAudio) {
      const response = await fetch(`${CDN_BASE}/audio/${asset.name}.mp3`);
      const audioBytes = new Uint8Array(await response.arrayBuffer());
      const audio = await decodeAudio(audioBytes);
      asset.setAudio(audio);
      audio.unref();
      return true;
    }
  } catch (error) {
    console.error(`Failed to load ${asset.name}:`, error);
  }

  return false;
};
```
