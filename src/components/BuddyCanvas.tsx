import { forwardRef, useImperativeHandle } from 'react';
import { useBuddyRive } from '../hooks/useBuddyRive';
import type { BuddyCharacter } from '../types/buddy';

interface BuddyCanvasProps {
  character: BuddyCharacter;
  width?: number;
  height?: number;
  assetCache?: Map<string, Uint8Array>;
  onAllAssetsLoaded?: () => void;
  onTap?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface BuddyCanvasRef {
  triggerWave: () => void;
  triggerJump: () => void;
  triggerBlink: () => void;
  setInput: (name: string, value: boolean | number) => void;
}

export const BuddyCanvas = forwardRef<BuddyCanvasRef, BuddyCanvasProps>(
  function BuddyCanvas(
    { character, width = 300, height = 300, assetCache, onAllAssetsLoaded, onTap, onLoad, onError },
    ref
  ) {
    const { RiveComponent, state, triggerWave, triggerJump, triggerBlink, setInput } =
      useBuddyRive({
        character,
        resolution: '2x',
        assetCache,
        onAllAssetsLoaded,
        onLoad,
        onError,
      });

    useImperativeHandle(ref, () => ({
      triggerWave,
      triggerJump,
      triggerBlink,
      setInput,
    }));

  const handleClick = () => {
    triggerWave(); // Wave when clicked as a friendly greeting
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
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Loading... ({state.assetsLoaded}/{state.totalAssets})
        </div>
      )}
      <RiveComponent />
    </div>
  );
  }
);
