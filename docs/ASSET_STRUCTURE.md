# Asset Structure & CDN Configuration
## Reading Buddy Asset Organization

**Last Updated:** December 30, 2025

---

## Overview

All buddy character assets are 500x500 PNG files with transparency. Each character has the same body parts, allowing a single Rive rig to work with any character by swapping assets at runtime.

---

## CDN Configuration

### Development CDN (GitHub)

**Repository:** https://github.com/travisgregory/Rive.git

**Base URL:** 
```
https://raw.githubusercontent.com/travisgregory/Rive/main/buddies
```

**Full Asset URL Pattern:**
```
https://raw.githubusercontent.com/travisgregory/Rive/main/buddies/{character}/{partName}@{resolution}.png
```

### Production CDN (Epic) - Future

**Base URL:**
```
https://cdn.getepic.com/buddies
```

---

## Repository Structure

```
Rive/
├── buddies/
│   ├── CatdogOrange/
│   │   ├── armLeft.png
│   │   ├── armLeft@2x.png
│   │   ├── armLeft@3x.png
│   │   ├── armRight.png
│   │   ├── armRight@2x.png
│   │   ├── armRight@3x.png
│   │   ├── composite.png          # Full assembled preview (not used at runtime)
│   │   ├── composite@2x.png
│   │   ├── composite@3x.png
│   │   ├── egg.png                # Character-themed egg
│   │   ├── egg@2x.png
│   │   ├── egg@3x.png
│   │   ├── eyeBlinkLeft.png
│   │   ├── eyeBlinkLeft@2x.png
│   │   ├── eyeBlinkLeft@3x.png
│   │   ├── eyeBlinkRight.png
│   │   ├── eyeBlinkRight@2x.png
│   │   ├── eyeBlinkRight@3x.png
│   │   ├── eyeLeft.png
│   │   ├── eyeLeft@2x.png
│   │   ├── eyeLeft@3x.png
│   │   ├── eyeRight.png
│   │   ├── eyeRight@2x.png
│   │   ├── eyeRight@3x.png
│   │   ├── head.png
│   │   ├── head@2x.png
│   │   ├── head@3x.png
│   │   ├── headBack.png
│   │   ├── headBack@2x.png
│   │   ├── headBack@3x.png
│   │   ├── legLeft.png
│   │   ├── legLeft@2x.png
│   │   ├── legLeft@3x.png
│   │   ├── legRight.png
│   │   ├── legRight@2x.png
│   │   ├── legRight@3x.png
│   │   ├── legSeparator.png
│   │   ├── legSeparator@2x.png
│   │   ├── legSeparator@3x.png
│   │   ├── tail.png
│   │   ├── tail@2x.png
│   │   ├── tail@3x.png
│   │   ├── torso.png
│   │   ├── torso@2x.png
│   │   └── torso@3x.png
│   │
│   ├── CatdogGray/
│   │   └── ... (same structure)
│   │
│   ├── CatdogBlue/
│   │   └── ... (same structure)
│   │
│   └── ... (other characters)
│
├── accessories/                    # Future Phase 2
│   ├── hats/
│   ├── glasses/
│   └── masks/
│
├── public/
│   └── buddy-template.riv
│
├── src/
│   └── ... (React app)
│
└── docs/
    └── ... (this documentation)
```

---

## Body Parts Reference

### Core Body Parts (Required)

| Part Name | Description | Dimensions | Notes |
|-----------|-------------|------------|-------|
| `head` | Front of head/face | 500x500 | Primary face rendering |
| `headBack` | Back of head | 500x500 | For depth/layering behind face |
| `torso` | Main body | 500x500 | Central body piece |
| `armLeft` | Left arm | 500x500 | Character's left (viewer's right) |
| `armRight` | Right arm | 500x500 | Character's right (viewer's left) |
| `legLeft` | Left leg | 500x500 | Character's left |
| `legRight` | Right leg | 500x500 | Character's right |
| `legSeparator` | Between legs | 500x500 | Decorative element |
| `tail` | Tail | 500x500 | May be empty for some characters |

### Eye Parts (For Blink Animation)

| Part Name | Description | Dimensions | Notes |
|-----------|-------------|------------|-------|
| `eyeLeft` | Left eye (open) | 500x500 | Default state |
| `eyeRight` | Right eye (open) | 500x500 | Default state |
| `eyeBlinkLeft` | Left eye (closed) | 500x500 | Blink state |
| `eyeBlinkRight` | Right eye (closed) | 500x500 | Blink state |

### Special Assets (Not Used in Core Rig)

| Part Name | Description | Dimensions | Notes |
|-----------|-------------|------------|-------|
| `composite` | Full assembled preview | 500x500 | For UI thumbnails |
| `egg` | Character-themed egg | 500x500 | For hatching feature (Phase 2) |

---

## Resolution Variants

| Suffix | Resolution | Use Case |
|--------|------------|----------|
| (none) | 1x (500x500) | Low-res devices, thumbnails |
| `@2x` | 2x (1000x1000) | Standard displays |
| `@3x` | 3x (1500x1500) | Retina/high-DPI displays |

### Resolution Selection Logic

```typescript
function getResolution(): '1x' | '2x' | '3x' {
  const dpr = window.devicePixelRatio || 1;
  
  if (dpr >= 2.5) return '3x';
  if (dpr >= 1.5) return '2x';
  return '1x';
}
```

---

## File Format Requirements

### PNG Specifications

- **Format:** PNG-24 with alpha channel
- **Color Space:** sRGB
- **Dimensions:** 500x500 pixels (1x), scaled proportionally for 2x/3x
- **Transparency:** Required for proper layering
- **Compression:** Optimized for web (use tools like TinyPNG)

### Why 500x500?

All parts are 500x500 with transparency padding so they:
1. Stack perfectly without position adjustments
2. Can be exported consistently from Figma
3. Align automatically when layered in Rive
4. Support uniform scaling

---

## Characters List

### Phase 1 Characters

| ID | Display Name | Folder Name | Status |
|----|--------------|-------------|--------|
| `orange-cat` | Orange Cat | `CatdogOrange` | ✅ Ready |
| `gray-cat` | Gray Cat | `CatdogGray` | ✅ Ready |
| `blue-cat` | Blue Cat | `CatdogBlue` | Pending |
| `green-cat` | Green Cat | `CatdogGreen` | Pending |
| `purple-cat` | Purple Cat | `CatdogPurple` | Pending |

### Future Characters (from Epic Books)

| Character | Folder Name | Source |
|-----------|-------------|--------|
| Cat Ninja | `CatNinja` | Epic Original |
| Scaredy Monster | `ScaredyMonster` | Epic Original |
| Unicorn | `Unicorn` | Epic Original |
| Mermaid | `Mermaid` | Epic Original |

---

## Accessories (Phase 2)

Accessories will be stored separately and loaded as additional assets:

```
/accessories/
├── hats/
│   ├── turkey-hat.png
│   ├── turkey-hat@2x.png
│   ├── reindeer-antlers.png
│   └── ...
├── glasses/
│   ├── heart-sunglasses.png
│   ├── star-glasses.png
│   └── ...
└── masks/
    ├── superhero-mask.png
    ├── flower-crown.png
    └── ...
```

### Accessory Positioning

All accessories are also 500x500 and designed to overlay correctly when stacked on the buddy at the same position.

---

## Asset Validation Checklist

When adding a new character:

- [ ] All 13 body parts present (head, headBack, torso, armLeft, armRight, legLeft, legRight, legSeparator, tail, eyeLeft, eyeRight, eyeBlinkLeft, eyeBlinkRight)
- [ ] All 3 resolutions for each part (1x, @2x, @3x)
- [ ] File names match exactly (case-sensitive)
- [ ] All files are 500x500 base (scaled for 2x/3x)
- [ ] All files have transparency
- [ ] Composite preview included
- [ ] Egg variant included (for hatching feature)

### Quick Validation Script

```bash
#!/bin/bash
# validate-character.sh

CHARACTER=$1
REQUIRED_PARTS=(
  "head" "headBack" "torso" "armLeft" "armRight"
  "legLeft" "legRight" "legSeparator" "tail"
  "eyeLeft" "eyeRight" "eyeBlinkLeft" "eyeBlinkRight"
)
RESOLUTIONS=("" "@2x" "@3x")

echo "Validating $CHARACTER..."

for part in "${REQUIRED_PARTS[@]}"; do
  for res in "${RESOLUTIONS[@]}"; do
    file="buddies/${CHARACTER}/${part}${res}.png"
    if [ ! -f "$file" ]; then
      echo "❌ Missing: $file"
    else
      echo "✅ Found: $file"
    fi
  done
done
```

---

## URL Examples

### Development URLs (GitHub Raw)

```
# Orange Cat head @2x
https://raw.githubusercontent.com/travisgregory/Rive/main/buddies/CatdogOrange/head@2x.png

# Gray Cat arm left @1x
https://raw.githubusercontent.com/travisgregory/Rive/main/buddies/CatdogGray/armLeft.png

# Purple Cat blink eye @3x
https://raw.githubusercontent.com/travisgregory/Rive/main/buddies/CatdogPurple/eyeBlinkRight@3x.png
```

### Testing URLs

To verify assets are accessible, you can test in browser:

1. Open the URL directly
2. Should display the PNG image
3. If 404, check file name and path

---

## CORS Considerations

GitHub raw URLs should work without CORS issues for browser fetches. If you encounter CORS errors:

1. Verify you're using `raw.githubusercontent.com` not `github.com`
2. Check that the repository is public
3. Consider using a proper CDN with CORS headers configured

For production (Epic CDN), ensure CORS headers are set:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```
