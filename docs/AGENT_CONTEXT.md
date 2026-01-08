# Agent Context
## Quick Reference for AI Agents Working on This Project

**Purpose:** Get an AI coding agent (Claude Code, Cursor, etc.) up to speed quickly on this project.

---

## TL;DR

Building a **React test harness** for Epic's **Reading Buddy** character animations using **Rive**. The buddy is a companion character in a kids reading app. We're replacing Lottie with Rive to enable interactive animations and dynamic character swapping.

**Key technical challenge:** Loading body part images from a CDN at runtime instead of embedding them in the Rive file.

---

## Current Status ⚡

| Component | Status |
|-----------|--------|
| React App + TypeScript | ✅ Complete |
| Rive Runtime Integration | ✅ Complete |
| CDN Asset Loading Hook | ✅ Complete |
| Character Switcher UI | ✅ Complete |
| Animation Triggers | ✅ Complete (wave, jump, blink) |
| Rive File (`.riv`) | ✅ Complete - exported to `public/` |
| Body Part PNGs | ✅ Complete - uploaded to `buddies/` |
| State Machine | ✅ Complete - Two-layer architecture |

**Phase 1 Complete!** All animations working. Next: Phase 2 (accessories, egg hatching).

---

## Project Quick Facts

| Item | Value |
|------|-------|
| **Project Location** | `/Users/travisgregory/Projects/Rive` |
| **Runtime** | React 18 (web) |
| **Rive Runtime** | `@rive-app/react-canvas` |
| **CDN (Dev)** | `https://raw.githubusercontent.com/undeadpickle/reading-buddy-rive-demo/main/buddies` |
| **State Machine** | `BuddyStateMachine` (BodyLayer + BlinkLayer) |
| **Animation Triggers** | `wave`, `jump`, `blink` |
| **Current Phase** | Phase 1 Complete - Ready for Phase 2 |

---

## What Exists

### Rive Assets
- ✅ Rive file with buddy rig and animations - exported to `public/buddy-template.riv`
- ✅ Body part PNG assets (500x500) - uploaded to `buddies/` on GitHub
- ✅ GitHub repo: `https://github.com/undeadpickle/reading-buddy-rive-demo.git`
- ✅ Two-layer state machine: BodyLayer (movements) + BlinkLayer (eyes)

### React Implementation
- ✅ **React project** - Vite + React 18 + TypeScript
- ✅ **Rive runtime** - `@rive-app/react-canvas@4.16.5`
- ✅ **`useBuddyRive` hook** - Full CDN asset loading with `decodeImage`
- ✅ **`BuddyCanvas` component** - Interactive canvas with forwardRef pattern
- ✅ **Character switcher** - Dropdown to swap between 5 characters
- ✅ **Animation controls** - Wave, Jump, Blink buttons + click-to-wave
- ✅ **Asset loader utilities** - URL builder, preloading, byte fetching
- ✅ **Type definitions** - `BuddyCharacter`, `BuddyState`, `AnimationTrigger`

### All Systems Operational
- ✅ Idle as default state (looping)
- ✅ Automatic blinking every 2-5 seconds
- ✅ Wave/Jump animations return to idle
- ✅ Clicking buddy triggers wave animation

---

## What Needs to Be Done

### Phase 1 - COMPLETE ✅

1. ~~**Initialize React project**~~ ✅ COMPLETE
2. ~~**Upload buddy assets**~~ ✅ COMPLETE
3. ~~**Configure & Export Rive file**~~ ✅ COMPLETE
4. ~~**Implement core components**~~ ✅ COMPLETE
5. ~~**State machine configuration**~~ ✅ COMPLETE

### Phase 2 - Future Work

1. **Accessories System**
   - Hats, glasses, masks
   - Additional overlay layers in Rive

2. **Egg Hatching Animation**
   - Character reveal animation
   - Separate artboard or state

3. **Production CDN**
   - Migrate from GitHub raw to Epic's CDN

### Verification

Run `npm run dev` and verify:
- Buddy renders with correct body parts from CDN
- Buddy starts in idle animation (looping)
- Buddy blinks automatically every 2-5 seconds
- Clicking buddy triggers wave animation
- Wave/Jump/Blink buttons work correctly
- Character dropdown swaps all images

---

## Key Implementation Files

| File | Purpose |
|------|---------|
| `src/hooks/useBuddyRive.ts` | Main hook - handles asset loading, animation triggers |
| `src/components/BuddyCanvas.tsx` | Wrapper component with click handling |
| `src/utils/assetLoader.ts` | URL building, image fetching utilities |
| `src/utils/constants.ts` | CDN URL, body parts, characters, trigger names |
| `src/types/buddy.ts` | TypeScript interfaces |
| `src/App.tsx` | Demo app with character switcher |

---

## Key Code Patterns

### Using the `useBuddyRive` Hook

```typescript
import { useBuddyRive } from './hooks/useBuddyRive';
import { CHARACTERS } from './utils/constants';

const { RiveComponent, state, triggerWave, triggerJump, triggerBlink } = useBuddyRive({
  character: CHARACTERS[0],
  resolution: '2x',
  onLoad: () => console.log('Loaded!'),
  onError: (err) => console.error(err),
});

// Render the component
<RiveComponent />

// Check loading state
state.isLoaded      // boolean
state.assetsLoaded  // number of loaded assets
state.totalAssets   // 13 body parts
```

### Triggering Animations

```typescript
// The hook provides convenience methods
triggerWave();   // Fires 'wave' trigger - buddy waves
triggerJump();   // Fires 'jump' trigger - buddy jumps
triggerBlink();  // Fires 'blink' trigger - manual blink (auto-blink runs independently)

// Or set inputs directly
setInput('someBoolean', true);
setInput('someNumber', 42);
```

### Asset Loading (internal - already implemented)

The hook internally uses this pattern (see `useBuddyRive.ts`):

```typescript
const assetLoader = async (asset: ImageAsset, bytes: Uint8Array) => {
  if (bytes.length > 0 || asset.cdnUuid?.length > 0) return false;
  if (!asset.isImage) return false;

  const url = getAssetUrl(character.folderName, asset.name, resolution);
  const imageBytes = await fetchImageBytes(url);
  const image = await decodeImage(imageBytes);

  asset.setRenderImage(image);
  image.unref(); // Prevent memory leak
  return true;
};
```

---

## Configured Characters

The app supports 5 characters (defined in `src/utils/constants.ts`):

| ID | Display Name | CDN Folder |
|----|--------------|------------|
| `orange-cat` | Orange Cat | `CatdogOrange` |
| `gray-cat` | Gray Cat | `CatdogGray` |
| `blue-cat` | Blue Cat | `CatdogBlue` |
| `green-cat` | Green Cat | `CatdogGreen` |
| `purple-cat` | Purple Cat | `CatdogPurple` |

---

## Body Parts List

These are the 13 body parts loaded from CDN per character (defined in `src/utils/constants.ts`):

```
head, headBack, torso, armLeft, armRight, legLeft, legRight,
legSeparator, tail, eyeLeft, eyeRight, eyeBlinkLeft, eyeBlinkRight
```

---

## CDN URL Pattern

```
https://raw.githubusercontent.com/undeadpickle/reading-buddy-rive-demo/main/buddies/{character}/{part}@{res}.png

Examples:
.../buddies/CatdogOrange/head@2x.png
.../buddies/CatdogGray/armLeft@2x.png
.../buddies/CatdogOrange/eyeBlinkRight@3x.png
```

---

## Project File Structure (Current)

```
/Users/travisgregory/Projects/Rive/
├── buddies/                    # ⬜ NEEDS: Upload PNGs to GitHub
│   ├── CatdogOrange/
│   │   ├── head.png, head@2x.png, head@3x.png
│   │   └── ... (13 parts × 3 resolutions)
│   └── CatdogGray/, CatdogBlue/, CatdogGreen/, CatdogPurple/
├── public/
│   └── buddy-template.riv      # ⬜ NEEDS: Export from Rive Editor
├── src/                        # ✅ COMPLETE
│   ├── components/
│   │   └── BuddyCanvas.tsx     # ✅ Interactive canvas component
│   ├── hooks/
│   │   └── useBuddyRive.ts     # ✅ Full CDN asset loading hook
│   ├── utils/
│   │   ├── assetLoader.ts      # ✅ URL builder, fetch utilities
│   │   └── constants.ts        # ✅ CDN config, body parts, characters
│   ├── types/
│   │   └── buddy.ts            # ✅ TypeScript interfaces
│   ├── App.tsx                 # ✅ Main app with character switcher
│   └── main.tsx                # ✅ Entry point
├── docs/                       # ✅ Documentation
├── package.json                # ✅ Dependencies configured
├── vite.config.ts              # ✅ Vite config
├── tsconfig.json               # ✅ TypeScript config
└── index.html                  # ✅ HTML entry
```

---

## Documentation Files

Read these for full context:

| File | Contains |
|------|----------|
| `PRD.md` | Business context, goals, requirements |
| `TECHNICAL_SPEC.md` | Architecture, code examples, full implementation |
| `RIVE_EDITOR_SETUP.md` | How to configure the Rive file |
| `ASSET_STRUCTURE.md` | CDN structure, file naming, validation |
| `IMPLEMENTATION_PHASES.md` | Roadmap, tasks, timeline |
| `AGENT_CONTEXT.md` | This file - quick reference |

---

## Common Commands

```bash
# Navigate to project
cd /Users/travisgregory/Projects/Rive

# Install dependencies (after package.json exists)
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Rive MCP (Optional)

If using Cursor with Rive MCP enabled:

1. Have Rive Early Access desktop app open with the file
2. Cursor → Settings → MCP → Verify "Rive" connected
3. Can use AI to create state machine elements, etc.

Config location: `~/.cursor/mcp.json`

---

## What NOT to Do

- ❌ Don't embed images in the .riv file
- ❌ Don't use the default `<Rive />` component (use `useRive` hook for asset loader)
- ❌ Don't forget to call `image.unref()` after setting render image
- ❌ Don't hardcode CDN URLs (use constants)
- ❌ Don't assume state machine input names - verify in Rive editor
- ❌ Don't forget Exit Time 100% on transitions back to Idle (animation will play but character freezes forever)
- ❌ Don't forget to add transitions FROM animation states TO Idle (Wave → Idle, Jump → Idle)
- ❌ Don't put unrelated animations in the same layer (use separate layers)

---

## Questions? Check These Resources

- **Rive Asset Loading:** https://rive.app/docs/runtimes/loading-assets
- **Rive React Runtime:** https://rive.app/docs/runtimes
- **State Machines:** https://rive.app/docs/runtimes/state-machines
- **Rive Community:** https://community.rive.app

---

## Contact

**Project Owner:** Travis Gregory  
**GitHub Repo:** https://github.com/undeadpickle/reading-buddy-rive-demo.git

---

## Checklist for Agent

### When Starting Work
- [ ] Run `npm install` if `node_modules/` is missing
- [ ] Run `npm run dev` to start dev server
- [ ] Open http://localhost:5173 in browser
- [ ] Verify animations work (idle, auto-blink, wave, jump)

### Verification Tests
- [ ] Buddy starts in idle (looping)
- [ ] Buddy blinks automatically every few seconds
- [ ] Click buddy → triggers wave animation
- [ ] Wave/Jump/Blink buttons work
- [ ] Buddy returns to idle after animations
- [ ] Character dropdown swaps all images

### For Feature Work (Phase 2)
- [ ] Read `PRD.md` for business context
- [ ] Read `TECHNICAL_SPEC.md` for implementation details
- [ ] Review two-layer architecture in `RIVE_EDITOR_SETUP.md`
- [ ] Review existing code in `src/hooks/useBuddyRive.ts` and `src/utils/constants.ts`
