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
  triggerTap: () => void;
  triggerWave: () => void;
  triggerJump: () => void;
  triggerBlink: () => void;
}

export const BuddyCanvas = forwardRef<BuddyCanvasRef, BuddyCanvasProps>(
  function BuddyCanvas(
    { character, width = 300, height = 300, onTap, onLoad, onError },
    ref
  ) {
    const { RiveComponent, state, triggerTap, triggerWave, triggerJump, triggerBlink } =
      useBuddyRive({
        character,
        resolution: '2x',
        onLoad,
        onError,
      });

    useImperativeHandle(ref, () => ({
      triggerTap,
      triggerWave,
      triggerJump,
      triggerBlink,
    }));

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
