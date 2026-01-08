import { forwardRef, useImperativeHandle } from 'react';
import { useBuddyRive } from '../hooks/useBuddyRive';
import type { BuddyCharacter } from '../types/buddy';

interface BuddyCanvasProps {
  src?: string;
  cdnSubfolder?: string;
  resolution?: '1x' | '2x' | '3x';
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
    { src, cdnSubfolder, resolution = '2x', character, width = 300, height = 300, assetCache, onAllAssetsLoaded, onTap, onLoad, onError },
    ref
  ) {
    const { RiveComponent, triggerWave, triggerJump, triggerBlink, setInput } =
      useBuddyRive({
        src,
        cdnSubfolder,
        character,
        resolution,
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
      <RiveComponent />
    </div>
  );
  }
);
