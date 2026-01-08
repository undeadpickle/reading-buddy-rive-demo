# Reading Buddy - Rive Animation System

React test harness for Epic's Reading Buddy character animations using Rive. The buddy is a companion character in a kids reading app, being migrated from Lottie to Rive for interactive animations and dynamic character swapping.

**Key Technical Challenge:** Loading body part images from CDN at runtime instead of embedding them in the .riv file.

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start dev server → http://localhost:5173
npm run build      # Production build
```

## Project Status

| Component | Status |
|-----------|--------|
| React app + hooks | Complete |
| CDN asset loading | Complete |
| PNG assets (65 files) | Pushed to GitHub |
| Rive file (.riv) | Complete - exported to `public/buddy-template.riv` |
| State machine | Complete - BodyLayer + BlinkLayer architecture |
| Animation triggers | Complete - wave, jump, blink working |

## Technology Stack

- **Framework:** React 18.3 + TypeScript 5.6
- **Build:** Vite 6
- **Animation:** @rive-app/react-canvas 4.16.5
- **CDN (Dev):** GitHub raw content

## Architecture

```
React App
    └── useBuddyRive hook
            ├── Loads /buddy-template.riv
            ├── Custom assetLoader callback
            │       └── Fetches body parts from CDN
            └── State machine triggers (wave, jump, blink)

State Machine (BuddyStateMachine)
    ├── BodyLayer: Entry → idle ↔ wave/jump (returns to idle)
    └── BlinkLayer: Entry → eyes_open ↔ blink (auto-loop)
```

### Key Pattern: Out-of-Band Asset Loading

```typescript
const assetLoader = async (asset: ImageAsset, bytes: Uint8Array) => {
  if (bytes.length > 0) return false;  // Already embedded

  const url = getAssetUrl(character.folderName, asset.name);
  const imageBytes = await fetchImageBytes(url);
  const image = await decodeImage(imageBytes);

  asset.setRenderImage(image);
  image.unref();  // CRITICAL: Prevent memory leak
  return true;
};
```

## Key Files

| File | Purpose |
|------|---------|
| [src/hooks/useBuddyRive.ts](src/hooks/useBuddyRive.ts) | Main hook - CDN loading, animation triggers |
| [src/utils/constants.ts](src/utils/constants.ts) | CDN URL, body parts, characters, triggers |
| [src/utils/assetLoader.ts](src/utils/assetLoader.ts) | URL building, fetch utilities |
| [src/components/BuddyCanvas.tsx](src/components/BuddyCanvas.tsx) | Interactive canvas with click handling |
| [src/types/buddy.ts](src/types/buddy.ts) | TypeScript interfaces |

## Configuration

### CDN URLs

```typescript
// Development (GitHub)
CDN_BASE_URL = 'https://raw.githubusercontent.com/undeadpickle/reading-buddy-rive-demo/main/buddies'

// Production (future)
CDN_BASE_URL = 'https://cdn.getepic.com/buddies'
```

### Body Parts (13 total)

```
head, headBack, torso, armLeft, armRight, legLeft, legRight,
legSeparator, tail, eyeLeft, eyeRight, eyeBlinkLeft, eyeBlinkRight
```

### Characters

| ID | Display Name | CDN Folder |
|----|--------------|------------|
| orange-cat | Orange Cat | CatdogOrange |
| gray-cat | Gray Cat | CatdogGray |
| blue-cat | Blue Cat | CatdogBlue |
| green-cat | Green Cat | CatdogGreen |
| purple-cat | Purple Cat | CatdogPurple |

### State Machine

- **Name:** `BuddyStateMachine`
- **Triggers:** `wave`, `jump`, `blink`
- **Layers:** `BodyLayer` (body movements), `BlinkLayer` (eye animations)

## Code Style

- TypeScript strict mode
- Functional components with hooks
- `camelCase` for variables/functions
- `PascalCase` for components/types
- Constants in `SCREAMING_SNAKE_CASE`
- All configuration in `src/utils/constants.ts`

## Critical Constraints

1. **Asset names must match exactly** - Rive asset names are case-sensitive and must match CDN filenames (without extension)
2. **Always call `image.unref()`** - After `setRenderImage()` to prevent memory leaks
3. **Use `useRive` hook** - Don't use default `<Rive />` component (need custom assetLoader)
4. **State machine name** - Must be exactly `BuddyStateMachine`
5. **Referenced export type** - All images in Rive file must be "Referenced" not "Embedded"

## What NOT to Do

- Don't embed images in the .riv file
- Don't use the default `<Rive />` component
- Don't hardcode CDN URLs (use constants)
- Don't forget `image.unref()` after loading
- Don't assume input names - verify in Rive editor
- Don't forget transitions FROM animation states back TO Idle (Wave → Idle, Jump → Idle)
- Don't forget Exit Time 100% on those transitions (or animation plays but character freezes)

## Testing the App

1. Export `buddy-template.riv` to `public/` (with all images as "Referenced")
2. Run `npm run dev`
3. Open http://localhost:5173
4. Verify:
   - Buddy renders with body parts from CDN
   - Clicking buddy triggers wave animation
   - Wave/Jump/Blink buttons work correctly
   - Buddy returns to idle after animations
   - Automatic blinking occurs every 2-5 seconds
   - Character dropdown swaps all images
   - Console shows asset loading logs

## Documentation

For detailed context, see:
- @docs/PRD.md - Business context and requirements
- @docs/TECHNICAL_SPEC.md - Full architecture and code examples
- @docs/RIVE_EDITOR_SETUP.md - Rive file configuration guide
- @docs/ASSET_STRUCTURE.md - CDN structure and file naming
- @docs/AGENT_CONTEXT.md - Quick reference for AI agents

## GitHub

**Repository:** https://github.com/undeadpickle/reading-buddy-rive-demo.git
