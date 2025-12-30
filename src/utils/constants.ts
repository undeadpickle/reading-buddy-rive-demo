import type { BuddyCharacter } from '../types/buddy';

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

export type BodyPart = (typeof BODY_PARTS)[number];

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
