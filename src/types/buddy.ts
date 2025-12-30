export interface BuddyCharacter {
  id: string;
  name: string;
  folderName: string; // CDN folder name, e.g., "CatdogOrange"
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
