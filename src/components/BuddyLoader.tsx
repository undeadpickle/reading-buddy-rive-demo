import { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { BuddyCanvas, type BuddyCanvasRef } from './BuddyCanvas';
import { LoadingSpinner } from './LoadingSpinner';
import { preloadCharacterAssets } from '../utils/assetLoader';
import type { BuddyCharacter } from '../types/buddy';

// Delay before showing spinner (prevents flicker on fast loads)
const SPINNER_DELAY_MS = 250;

interface BuddyLoaderProps {
  character: BuddyCharacter;
  width?: number;
  height?: number;
  onTap?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface BuddyLoaderRef {
  triggerWave: () => void;
  triggerJump: () => void;
  triggerBlink: () => void;
  setInput: (name: string, value: boolean | number) => void;
}

export const BuddyLoader = forwardRef<BuddyLoaderRef, BuddyLoaderProps>(
  function BuddyLoader(
    { character, width = 300, height = 300, onTap, onLoad, onError },
    ref
  ) {
    const [assetCache, setAssetCache] = useState<Map<string, Uint8Array> | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const buddyRef = useRef<BuddyCanvasRef>(null);
    const spinnerTimeoutRef = useRef<number | null>(null);

    // Forward ref methods to inner BuddyCanvas
    useImperativeHandle(ref, () => ({
      triggerWave: () => buddyRef.current?.triggerWave(),
      triggerJump: () => buddyRef.current?.triggerJump(),
      triggerBlink: () => buddyRef.current?.triggerBlink(),
      setInput: (name, value) => buddyRef.current?.setInput(name, value),
    }));

    // Preload assets when character changes
    useEffect(() => {
      setAssetCache(null);
      setIsReady(false);
      setShowSpinner(false);

      // Clear any existing timeout
      if (spinnerTimeoutRef.current) {
        clearTimeout(spinnerTimeoutRef.current);
      }

      // Start spinner delay timer
      spinnerTimeoutRef.current = window.setTimeout(() => {
        setShowSpinner(true);
      }, SPINNER_DELAY_MS);

      preloadCharacterAssets(character.folderName, '2x')
        .then((cache) => {
          // Clear spinner timeout if loading finished fast
          if (spinnerTimeoutRef.current) {
            clearTimeout(spinnerTimeoutRef.current);
            spinnerTimeoutRef.current = null;
          }
          setAssetCache(cache);
        })
        .catch((error) => {
          console.error('Failed to preload assets:', error);
          onError?.(error);
        });

      // Cleanup on unmount
      return () => {
        if (spinnerTimeoutRef.current) {
          clearTimeout(spinnerTimeoutRef.current);
        }
      };
    }, [character.folderName, onError]);

    // Show spinner while preloading (only after delay threshold)
    if (!assetCache) {
      // Show empty placeholder until delay threshold, then show spinner
      if (!showSpinner) {
        return <div style={{ width, height }} />;
      }
      return <LoadingSpinner size={Math.min(width, height)} />;
    }

    // Render BuddyCanvas with cache, fade in when Rive is ready
    return (
      <div
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
          width,
          height,
        }}
      >
        <BuddyCanvas
          ref={buddyRef}
          character={character}
          width={width}
          height={height}
          assetCache={assetCache}
          onTap={onTap}
          onLoad={() => {
            setIsReady(true);
            onLoad?.();
          }}
          onError={onError}
        />
      </div>
    );
  }
);
