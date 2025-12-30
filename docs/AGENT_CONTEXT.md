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
| Animation Triggers | ✅ Complete |
| Rive File (`.riv`) | ⬜ Needs export to `public/` |
| Body Part PNGs | ⬜ Needs upload to `buddies/` |

**Next step:** Export Rive file and upload PNG assets, then run `npm run dev` to test.

---

## Project Quick Facts

| Item | Value |
|------|-------|
| **Project Location** | `/Users/travisgregory/Projects/Rive` |
| **Runtime** | React 18 (web) |
| **Rive Runtime** | `@rive-app/react-canvas` |
| **CDN (Dev)** | `https://raw.githubusercontent.com/travisgregory/Rive/main/buddies` |
| **State Machine** | `BuddyStateMachine` |
| **Current Animations** | `tap`, `wave`, `jump`, `blink` |
| **Current Phase** | Phase 1 - React Harness Complete, Awaiting Assets |

---

## What Exists

### Rive Assets (external)
- ✅ Rive file with buddy rig and basic animations (needs export to `public/`)
- ✅ Body part PNG assets (500x500, multiple resolutions) (needs upload to GitHub)
- ✅ GitHub repo: `https://github.com/travisgregory/Rive.git`

### React Implementation (complete)
- ✅ **React project initialized** - Vite + React 18 + TypeScript
- ✅ **Rive runtime installed** - `@rive-app/react-canvas@4.16.5`
- ✅ **`useBuddyRive` hook** - Full CDN asset loading with `decodeImage`
- ✅ **`BuddyCanvas` component** - Interactive canvas with tap support
- ✅ **Character switcher** - Dropdown to swap between 5 characters
- ✅ **Animation controls** - Tap, Wave, Jump, Blink triggers
- ✅ **Asset loader utilities** - URL builder, preloading, byte fetching
- ✅ **Type definitions** - `BuddyCharacter`, `BuddyState`, `AnimationTrigger`

### Awaiting Setup
- ⬜ **Rive file** - Export `buddy-template.riv` to `public/` folder
- ⬜ **CDN assets** - Upload body part PNGs to `buddies/` folder in GitHub

---

## What Needs to Be Done

### Immediate Tasks (Asset Setup)

1. ~~**Initialize React project**~~ ✅ COMPLETE

2. **Upload buddy assets** to GitHub repo
   - Create `buddies/CatdogOrange/` folder (and other characters)
   - Upload all body parts (13 parts × 3 resolutions per character)
   - Push to GitHub so CDN URLs work

3. **Configure & Export Rive file**
   - Open in Rive Editor
   - Set all 13 images to "Referenced" export type
   - Ensure state machine is named `BuddyStateMachine`
   - Add triggers: `tap`, `wave`, `jump`, `blink`
   - Export to `public/buddy-template.riv`

4. ~~**Implement core components**~~ ✅ COMPLETE
   - `useBuddyRive` hook - done
   - `BuddyCanvas` component - done
   - Character switcher - done

### To Test

After assets are in place, run `npm run dev` and verify:
- Buddy renders with correct body parts
- Clicking triggers tap animation
- Character dropdown swaps all images
- Console shows asset loading logs

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

const { RiveComponent, state, triggerTap, triggerWave } = useBuddyRive({
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
triggerTap();    // Fires 'tap' trigger
triggerWave();   // Fires 'wave' trigger
triggerJump();   // Fires 'jump' trigger
triggerBlink();  // Fires 'blink' trigger

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
https://raw.githubusercontent.com/travisgregory/Rive/main/buddies/{character}/{part}@{res}.png

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

---

## Questions? Check These Resources

- **Rive Asset Loading:** https://rive.app/docs/runtimes/loading-assets
- **Rive React Runtime:** https://rive.app/docs/runtimes
- **State Machines:** https://rive.app/docs/runtimes/state-machines
- **Rive Community:** https://community.rive.app

---

## Contact

**Project Owner:** Travis Gregory  
**GitHub Repo:** https://github.com/travisgregory/Rive.git

---

## Checklist for Agent

### When Starting Work
- [ ] Run `npm install` if `node_modules/` is missing
- [ ] Check if `public/buddy-template.riv` exists
- [ ] Check if `buddies/` folder has PNG assets

### If Assets Are Missing
- [ ] Ask user to export `.riv` file from Rive Editor to `public/`
- [ ] Ask user to upload body part PNGs to `buddies/` on GitHub

### If Assets Are Present
- [ ] Run `npm run dev` to start dev server
- [ ] Open http://localhost:5173 in browser
- [ ] Verify buddy renders and animations work
- [ ] Test character switching dropdown

### For Feature Work
- [ ] Read `PRD.md` for business context
- [ ] Read `TECHNICAL_SPEC.md` for implementation details
- [ ] Review existing code in `src/hooks/useBuddyRive.ts` and `src/utils/constants.ts`
