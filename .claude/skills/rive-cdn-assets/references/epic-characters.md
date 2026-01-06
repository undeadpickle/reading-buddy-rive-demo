# Epic Character System

CDN structure, body parts, and character configuration for Epic Reading Buddies.

## Table of Contents

1. [CDN URLs](#cdn-urls)
2. [Body Parts](#body-parts)
3. [Characters](#characters)
4. [File Naming](#file-naming)
5. [Adding New Characters](#adding-new-characters)

---

## CDN URLs

### Development (GitHub Raw)

```
https://raw.githubusercontent.com/undeadpickle/Rive/main/buddies/{character}/{part}.png
```

### Production (Epic CDN)

```
https://cdn.getepic.com/buddies/{character}/{part}.png
```

### URL Examples

```
# Orange Cat head
https://raw.githubusercontent.com/undeadpickle/Rive/main/buddies/CatdogOrange/head.png

# Gray Cat left arm @2x
https://raw.githubusercontent.com/undeadpickle/Rive/main/buddies/CatdogGray/armLeft@2x.png

# Purple Cat blink eye @3x
https://raw.githubusercontent.com/undeadpickle/Rive/main/buddies/CatdogPurple/eyeBlinkRight@3x.png
```

---

## Body Parts

13 body parts per character. Names must match Rive asset names exactly (case-sensitive).

| Part Name | Description |
|-----------|-------------|
| `head` | Front of head/face |
| `headBack` | Back of head (for depth layering) |
| `torso` | Main body |
| `armLeft` | Left arm (character's left, viewer's right) |
| `armRight` | Right arm |
| `legLeft` | Left leg |
| `legRight` | Right leg |
| `legSeparator` | Decorative element between legs |
| `tail` | Tail (may be empty for some characters) |
| `eyeLeft` | Left eye (open state) |
| `eyeRight` | Right eye (open state) |
| `eyeBlinkLeft` | Left eye (closed/blink state) |
| `eyeBlinkRight` | Right eye (closed/blink state) |

### TypeScript Definition

```typescript
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
```

---

## Characters

### Phase 1 Characters (Active)

| ID | Display Name | CDN Folder | Status |
|----|--------------|------------|--------|
| `orange-cat` | Orange Cat | `CatdogOrange` | Ready |
| `gray-cat` | Gray Cat | `CatdogGray` | Ready |
| `blue-cat` | Blue Cat | `CatdogBlue` | Ready |
| `green-cat` | Green Cat | `CatdogGreen` | Ready |
| `purple-cat` | Purple Cat | `CatdogPurple` | Ready |

### Future Characters (from Epic Books)

| Character | CDN Folder | Source |
|-----------|------------|--------|
| Cat Ninja | `CatNinja` | Epic Original |
| Scaredy Monster | `ScaredyMonster` | Epic Original |
| Unicorn | `Unicorn` | Epic Original |
| Mermaid | `Mermaid` | Epic Original |

### TypeScript Definition

```typescript
export interface BuddyCharacter {
  id: string;
  name: string;
  folderName: string; // Must match CDN folder exactly
}

export const CHARACTERS: BuddyCharacter[] = [
  { id: 'orange-cat', name: 'Orange Cat', folderName: 'CatdogOrange' },
  { id: 'gray-cat', name: 'Gray Cat', folderName: 'CatdogGray' },
  { id: 'blue-cat', name: 'Blue Cat', folderName: 'CatdogBlue' },
  { id: 'green-cat', name: 'Green Cat', folderName: 'CatdogGreen' },
  { id: 'purple-cat', name: 'Purple Cat', folderName: 'CatdogPurple' },
];
```

---

## File Naming

### Resolution Variants

| Suffix | Dimensions | Use Case |
|--------|------------|----------|
| (none) | 500x500 | @1x, low-res, thumbnails |
| `@2x` | 1000x1000 | Standard displays |
| `@3x` | 1500x1500 | Retina/high-DPI |

### Resolution Selection

```typescript
function getResolution(): '1x' | '2x' | '3x' {
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 2.5) return '3x';
  if (dpr >= 1.5) return '2x';
  return '1x';
}
```

### CDN Directory Structure

```
buddies/
├── CatdogOrange/
│   ├── head.png
│   ├── head@2x.png
│   ├── head@3x.png
│   ├── headBack.png
│   ├── headBack@2x.png
│   ├── headBack@3x.png
│   ├── torso.png
│   ├── ... (13 parts × 3 resolutions = 39 files)
│   ├── composite.png      # Preview only, not loaded at runtime
│   └── egg.png            # For hatching feature (Phase 2)
├── CatdogGray/
│   └── ... (same structure)
└── ... (other characters)
```

---

## Adding New Characters

### Checklist

1. Create folder with PascalCase name (e.g., `NewBuddy`)
2. Export all 13 body parts at 3 resolutions (39 files)
3. Verify exact filenames match body part names
4. Add character to `CHARACTERS` array in constants.ts
5. Push to CDN (GitHub or Epic CDN)
6. Test character switching in app

### Validation Script

```bash
#!/bin/bash
# validate-character.sh <character-folder>

CHARACTER=$1
PARTS=(head headBack torso armLeft armRight legLeft legRight legSeparator tail eyeLeft eyeRight eyeBlinkLeft eyeBlinkRight)
RESOLUTIONS=("" "@2x" "@3x")

for part in "${PARTS[@]}"; do
  for res in "${RESOLUTIONS[@]}"; do
    file="buddies/${CHARACTER}/${part}${res}.png"
    if [ ! -f "$file" ]; then
      echo "MISSING: $file"
    fi
  done
done
```

### PNG Requirements

- **Format:** PNG-24 with alpha channel
- **Dimensions:** 500x500 base (scaled for 2x/3x)
- **Color Space:** sRGB
- **Transparency:** Required for layering
- **Optimization:** Run through TinyPNG or similar

---

## Special Assets (Not Part of Rig)

| Asset | Purpose | Loaded at Runtime? |
|-------|---------|-------------------|
| `composite.png` | Full preview for UI thumbnails | No |
| `egg.png` | Character-themed egg for hatching | Phase 2 |

---

## Accessories (Phase 2)

Future accessory system structure:

```
accessories/
├── hats/
│   ├── turkey-hat.png
│   └── reindeer-antlers.png
├── glasses/
│   ├── heart-sunglasses.png
│   └── star-glasses.png
└── masks/
    └── superhero-mask.png
```

Accessories will be 500x500 overlays positioned to align with the buddy rig.
