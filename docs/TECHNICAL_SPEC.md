# Technical Specification
## Reading Buddy Rive Implementation

**Version:** 1.0  
**Last Updated:** December 30, 2025

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  BuddyCanvas    │    │ AnimationPanel  │    │ CharacterPicker│
│  │  Component      │    │ (triggers)      │    │             │ │
│  └────────┬────────┘    └────────┬────────┘    └──────┬──────┘ │
│           │                      │                     │        │
│           └──────────────────────┼─────────────────────┘        │
│                                  │                              │
│                    ┌─────────────▼─────────────┐                │
│                    │      useBuddyRive         │                │
│                    │      Custom Hook          │                │
│                    └─────────────┬─────────────┘                │
│                                  │                              │
├──────────────────────────────────┼──────────────────────────────┤
│                    ┌─────────────▼─────────────┐                │
│                    │  @rive-app/react-canvas   │                │
│                    │  (Rive React Runtime)     │                │
│                    └─────────────┬─────────────┘                │
│                                  │                              │
│              ┌───────────────────┼───────────────────┐          │
│              │                   │                   │          │
│    ┌─────────▼─────────┐ ┌──────▼──────┐ ┌─────────▼─────────┐ │
│    │  buddy-template   │ │ Asset Loader │ │  State Machine   │ │
│    │  .riv file        │ │ Callback     │ │  Inputs          │ │
│    └───────────────────┘ └──────┬──────┘ └───────────────────┘ │
│                                 │                               │
└─────────────────────────────────┼───────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     GitHub CDN            │
                    │  (Character Assets)       │
                    │  /buddies/{char}/{part}   │
                    └───────────────────────────┘
```

---

## Project Structure

```
/Users/travisgregory/Projects/Rive/
├── public/
│   └── buddy-template.riv          # Main Rive file (bones + state machine, no embedded images)
│
├── src/
│   ├── components/
│   │   ├── BuddyCanvas.tsx         # Main Rive canvas component
│   │   ├── AnimationControls.tsx   # Buttons to trigger animations
│   │   ├── CharacterSwitcher.tsx   # Dropdown to switch characters
│   │   └── DebugPanel.tsx          # Shows asset loading status, state machine info
│   │
│   ├── hooks/
│   │   └── useBuddyRive.ts         # Custom hook wrapping Rive logic
│   │
│   ├── utils/
│   │   ├── assetLoader.ts          # CDN URL building, fetch utilities
│   │   └── constants.ts            # Character names, body part lists, CDN base URL
│   │
│   ├── types/
│   │   └── buddy.ts                # TypeScript interfaces
│   │
│   ├── App.tsx                     # Main test harness UI
│   └── main.tsx                    # Entry point
│
├── docs/                           # This documentation
│   ├── PRD.md
│   ├── TECHNICAL_SPEC.md
│   ├── RIVE_EDITOR_SETUP.md
│   ├── ASSET_STRUCTURE.md
│   ├── IMPLEMENTATION_PHASES.md
│   └── AGENT_CONTEXT.md
│
├── package.json
├── tsconfig.json
├── vite.config.ts                  # Using Vite for dev server
└── README.md
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@rive-app/react-canvas": "^4.x.x"
  },
  "devDependencies": {
    "typescript": "^5.x.x",
    "vite": "^5.x.x",
    "@types/react": "^18.x.x",
    "@types/react-dom": "^18.x.x"
  }
}
```

---

## Core Implementation

### Types (`src/types/buddy.ts`)

```typescript
export interface BuddyCharacter {
  id: string;
  name: string;
  folderName: string;  // CDN folder name, e.g., "CatdogOrange"
}

export interface BuddyConfig {
  character: BuddyCharacter;
  resolution: '1x' | '2x' | '3x';
  stateMachine: string;
}

export type AnimationTrigger = 'tap' | 'wave' | 'jump' | 'blink' | 'shrug';

export interface BuddyState {
  isLoaded: boolean;
  isPlaying: boolean;
  currentAnimation: string | null;
  assetsLoaded: number;
  totalAssets: number;
}
```

### Constants (`src/utils/constants.ts`)

```typescript
// CDN Configuration
// DEV: Using GitHub raw content for testing
export const CDN_BASE_URL = 'https://raw.githubusercontent.com/travisgregory/Rive/main/buddies';

// PROD: Will use Epic's CDN
// export const CDN_BASE_URL = 'https://cdn.getepic.com/buddies';

// Body parts that need to be loaded from CDN
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

export type BodyPart = typeof BODY_PARTS[number];

// Available characters
export const CHARACTERS: BuddyCharacter[] = [
  { id: 'orange-cat', name: 'Orange Cat', folderName: 'CatdogOrange' },
  { id: 'gray-cat', name: 'Gray Cat', folderName: 'CatdogGray' },
  { id: 'blue-cat', name: 'Blue Cat', folderName: 'CatdogBlue' },
  { id: 'green-cat', name: 'Green Cat', folderName: 'CatdogGreen' },
  { id: 'purple-cat', name: 'Purple Cat', folderName: 'CatdogPurple' },
];

// State machine configuration
export const STATE_MACHINE_NAME = 'BuddyStateMachine';

// Animation triggers (must match state machine input names)
export const TRIGGERS = {
  TAP: 'tap',
  WAVE: 'wave',
  JUMP: 'jump',
  BLINK: 'blink',
} as const;
```

### Asset Loader Utility (`src/utils/assetLoader.ts`)

```typescript
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
      'Accept': 'image/png,image/webp,image/jpeg,*/*',
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
```

### Custom Hook (`src/hooks/useBuddyRive.ts`)

```typescript
import { useCallback, useState, useEffect } from 'react';
import { useRive, decodeImage } from '@rive-app/react-canvas';
import type { FileAsset } from '@rive-app/react-canvas';
import { 
  getAssetUrl, 
  isBodyPart, 
  fetchImageBytes 
} from '../utils/assetLoader';
import { STATE_MACHINE_NAME, TRIGGERS } from '../utils/constants';
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
  rive: any;
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
    totalAssets: 13, // Number of body parts
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
          const url = getAssetUrl(character.folderName, assetName, resolution);
          console.log(`Loading asset: ${assetName} from ${url}`);
          
          const imageBytes = await fetchImageBytes(url);
          const image = await decodeImage(imageBytes);
          
          // Set the image on the asset
          asset.setRenderImage(image);
          
          // Clean up to prevent memory leak
          image.unref();

          // Update loading state
          setState(prev => ({
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
      setState(prev => ({ ...prev, isLoaded: true, isPlaying: autoplay }));
      onLoad?.();
    },
  });

  // Helper to get state machine inputs
  const getInputs = useCallback(() => {
    if (!rive) return null;
    return rive.stateMachineInputs(STATE_MACHINE_NAME);
  }, [rive]);

  // Fire a trigger input
  const fireTrigger = useCallback((triggerName: string) => {
    const inputs = getInputs();
    if (!inputs) return;
    
    const trigger = inputs.find((input: any) => input.name === triggerName);
    if (trigger?.fire) {
      trigger.fire();
      setState(prev => ({ ...prev, currentAnimation: triggerName }));
    }
  }, [getInputs]);

  // Set a boolean or number input
  const setInput = useCallback((name: string, value: boolean | number) => {
    const inputs = getInputs();
    if (!inputs) return;
    
    const input = inputs.find((input: any) => input.name === name);
    if (input) {
      input.value = value;
    }
  }, [getInputs]);

  // Convenience trigger methods
  const triggerTap = useCallback(() => fireTrigger(TRIGGERS.TAP), [fireTrigger]);
  const triggerWave = useCallback(() => fireTrigger(TRIGGERS.WAVE), [fireTrigger]);
  const triggerJump = useCallback(() => fireTrigger(TRIGGERS.JUMP), [fireTrigger]);
  const triggerBlink = useCallback(() => fireTrigger(TRIGGERS.BLINK), [fireTrigger]);

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
```

### Buddy Canvas Component (`src/components/BuddyCanvas.tsx`)

```typescript
import React from 'react';
import { useBuddyRive } from '../hooks/useBuddyRive';
import type { BuddyCharacter } from '../types/buddy';

interface BuddyCanvasProps {
  character: BuddyCharacter;
  width?: number;
  height?: number;
  onTap?: () => void;
  onLoad?: () => void;
}

export function BuddyCanvas({
  character,
  width = 300,
  height = 300,
  onTap,
  onLoad,
}: BuddyCanvasProps) {
  const { RiveComponent, state, triggerTap } = useBuddyRive({
    character,
    resolution: '2x',
    onLoad,
  });

  const handleClick = () => {
    triggerTap();
    onTap?.();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width,
        height,
        cursor: 'pointer',
        position: 'relative',
      }}
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
```

### Main App (`src/App.tsx`)

```typescript
import React, { useState } from 'react';
import { BuddyCanvas } from './components/BuddyCanvas';
import { CHARACTERS } from './utils/constants';
import type { BuddyCharacter } from './types/buddy';

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<BuddyCharacter>(CHARACTERS[0]);
  const [key, setKey] = useState(0); // Used to force re-mount on character change

  const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const character = CHARACTERS.find(c => c.id === e.target.value);
    if (character) {
      setSelectedCharacter(character);
      setKey(prev => prev + 1); // Force re-mount to reload assets
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>🐱 Reading Buddy Test Harness</h1>
      
      <section style={{ marginBottom: 20 }}>
        <h2>Character Selection</h2>
        <select 
          value={selectedCharacter.id} 
          onChange={handleCharacterChange}
          style={{ fontSize: 16, padding: '8px 12px' }}
        >
          {CHARACTERS.map(char => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2>Buddy Preview</h2>
        <div style={{ 
          border: '2px solid #ccc', 
          borderRadius: 8, 
          display: 'inline-block',
          padding: 10,
          background: '#f5f5f5',
        }}>
          <BuddyCanvas 
            key={key}
            character={selectedCharacter}
            width={300}
            height={300}
            onTap={() => console.log('Buddy tapped!')}
            onLoad={() => console.log('Buddy loaded!')}
          />
        </div>
        <p style={{ color: '#666', marginTop: 8 }}>
          Click on the buddy to trigger tap animation
        </p>
      </section>

      <section>
        <h2>Animation Controls</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => {/* TODO: wire up */}}>👋 Wave</button>
          <button onClick={() => {/* TODO: wire up */}}>🦘 Jump</button>
          <button onClick={() => {/* TODO: wire up */}}>😉 Blink</button>
          <button onClick={() => {/* TODO: wire up */}}>🤷 Shrug</button>
        </div>
      </section>
    </div>
  );
}
```

---

## Key Technical Concepts

### Out-of-Band (OOB) Asset Loading

Rive supports three export types for assets:

1. **Embedded** - Asset is baked into the .riv file (default)
2. **Hosted** - Asset is hosted on Rive's CDN
3. **Referenced** - Asset is NOT in the .riv; your app must load it

For the Reading Buddy, we use **Referenced** assets so we can:
- Keep the .riv file tiny
- Load different character skins dynamically
- Use our own CDN (GitHub for dev, Epic CDN for prod)

### Asset Loader Callback

When Rive loads a .riv file with Referenced assets, it calls your `assetLoader` callback for each missing asset. Your callback must:

1. Check if you want to handle the asset (`return true`) or let Rive handle it (`return false`)
2. Fetch the image data from your source
3. Decode it using `decodeImage()` from the Rive runtime
4. Set it on the asset using `asset.setRenderImage(image)`
5. Call `image.unref()` to prevent memory leaks

### State Machine Inputs

State machines can have three types of inputs:

- **Triggers** - Fire once to transition (e.g., `tap`, `wave`)
- **Booleans** - Toggle state (e.g., `isHappy`, `isWalking`)
- **Numbers** - Continuous values (e.g., `speed`, `progress`)

Access inputs via:
```typescript
const inputs = rive.stateMachineInputs('BuddyStateMachine');
const tapTrigger = inputs.find(i => i.name === 'tap');
tapTrigger.fire(); // For triggers
```

---

## Performance Considerations

1. **Preload assets** - Consider preloading character assets before displaying
2. **Resolution selection** - Use @1x on mobile, @2x on standard displays, @3x on retina
3. **Cache loaded images** - Avoid re-fetching when switching animations
4. **Single state machine** - Keep complexity in one state machine vs. multiple
5. **WASM preloading** - Preload Rive's WASM module for faster initial load

---

## Error Handling

```typescript
// In assetLoader callback
try {
  const bytes = await fetchImageBytes(url);
  const image = await decodeImage(bytes);
  asset.setRenderImage(image);
  image.unref();
  return true;
} catch (error) {
  console.error(`Failed to load ${assetName}:`, error);
  // Could show fallback image or notify user
  return false; // Let Rive try to handle it
}
```

---

## Testing Checklist

- [ ] Rive file loads without embedded assets
- [ ] Each body part loads from CDN
- [ ] Console shows no 404 errors
- [ ] Tap triggers animation
- [ ] Character switch reloads all assets
- [ ] Memory doesn't leak on repeated character switches
- [ ] Works in Chrome, Firefox, Safari
- [ ] Loading state displays correctly
