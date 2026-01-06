---
name: rive-cdn-assets
description: Load Rive animation assets from CDN at runtime instead of embedding them. Use when building Rive animations that need dynamic asset swapping (character skins, accessories), CDN-hosted images, or keeping .riv files small. Specifically for Epic Reading Buddy and similar projects using @rive-app/react-canvas.
license: MIT - see LICENSE.txt
---

# Rive CDN Asset Loading

Load images, fonts, or audio from CDN at runtime using Rive's out-of-band (OOB) asset loading pattern.

## Why This Pattern

- **Small .riv files** — Bones and state machine only, no embedded assets
- **Dynamic swapping** — Change character skins without reloading Rive file
- **CDN flexibility** — Use any CDN (GitHub raw, Epic CDN, image CDN with transforms)
- **Share assets** — Same images/fonts across multiple .riv files

## Export Types (Rive Editor)

| Type | Where Asset Lives | When to Use |
|------|-------------------|-------------|
| **Embedded** | Inside .riv file | Simple animations, no dynamic needs |
| **Hosted** | Rive's CDN | Let Rive handle hosting, no custom logic |
| **Referenced** | Your CDN | Dynamic swapping, custom CDN, keep .riv tiny |

This skill focuses on **Referenced** assets.

## Supported Asset Types

| Type | Decode Function | Set Function | Check Property |
|------|-----------------|--------------|----------------|
| Image | `decodeImage()` | `asset.setRenderImage()` | `asset.isImage` |
| Font | `decodeFont()` | `asset.setFont()` | `asset.isFont` |
| Audio | `decodeAudio()` | `asset.setAudio()` | `asset.isAudio` |

## Prerequisites

- Rive file with assets set to **"Referenced"** export type
- `@rive-app/react-canvas` ≥4.16 (use `useRive` hook, not `<Rive />`)
- Assets hosted on CDN with CORS enabled

## Core Workflow

1. **Configure Rive file** — Set assets to "Referenced" in Rive Editor
2. **Create asset loader callback** — Intercepts missing assets, fetches from CDN
3. **Use `useRive` hook** — Pass custom `assetLoader` option
4. **Call `.unref()`** — Prevent memory leaks after setting asset

## Implementation

### Quick Start

```typescript
import { useRive, decodeImage } from '@rive-app/react-canvas';

const { RiveComponent } = useRive({
  src: '/animation.riv',
  stateMachines: 'StateMachine',
  assetLoader: async (asset, bytes) => {
    // Skip if already embedded or hosted on Rive CDN
    if (bytes.length > 0 || asset.cdnUuid?.length > 0) return false;
    if (!asset.isImage) return false;

    const response = await fetch(`${CDN_BASE}/${asset.name}.png`, {
      headers: { Accept: 'image/png,image/webp,image/jpeg,*/*' }
    });
    const imageBytes = new Uint8Array(await response.arrayBuffer());
    const image = await decodeImage(imageBytes);

    asset.setRenderImage(image);
    image.unref(); // CRITICAL: Prevent memory leak
    return true;
  },
});
```

### Full Implementation

See [references/asset-loader-code.md](references/asset-loader-code.md) for:
- Complete useBuddyRive hook
- Error handling and loading states
- Resolution selection (@1x, @2x, @3x)
- TypeScript types

### Epic Character System

See [references/epic-characters.md](references/epic-characters.md) for:
- CDN URL structure
- 13 body part naming conventions
- 5 character configurations
- Reading Buddy specifics

### Rive MCP Integration

See [references/mcp-integration.md](references/mcp-integration.md) for:
- Setting up Rive Editor MCP connection
- Creating state machines via AI prompts
- Automating asset configuration

## Critical Constraints

| Constraint | Why |
|------------|-----|
| Always call `.unref()` | Memory leak if omitted |
| Use `useRive` hook, not `<Rive />` | Default component doesn't support custom assetLoader |
| Asset names must match exactly | Case-sensitive: Rive `head` = CDN `head.png` |
| Return `false` for embedded/hosted | Check `bytes.length > 0` or `cdnUuid` first |
| Set `Accept` header for images | Some CDNs require explicit format acceptance |

## Asset Properties Reference

```typescript
// Properties available on the asset object in assetLoader callback
asset.name           // Asset name without unique ID (e.g., "head")
asset.fileExtension  // File extension (e.g., "png")
asset.cdnUuid        // If set, asset is hosted on Rive CDN
asset.isImage        // Boolean
asset.isFont         // Boolean
asset.isAudio        // Boolean
```

## Rive Editor Setup

In the Rive Editor Assets panel, for each image:

1. Select the image asset
2. In Inspector, find **Export Type**
3. Change from `Embedded` → **`Referenced`**
4. Verify asset name matches CDN filename (without extension)

**Tip:** Use Rive MCP to automate this for many assets.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 errors | Asset name mismatch | Check exact spelling, case sensitivity |
| Blank canvas | Asset not loading | Check console for fetch errors, verify CORS |
| Memory grows | Missing `unref()` | Add `.unref()` after setting asset |
| Assets embedded anyway | Wrong export type | Re-export .riv with "Referenced" selected |
| CORS errors | CDN not configured | Add `Access-Control-Allow-Origin: *` |

## Version Compatibility

| Runtime Version | Notes |
|-----------------|-------|
| ≥4.25.1 | Latest stable, React 19 support |
| ≥4.20.0 | Data binding hooks, View Model support |
| ≥4.16.0 | Required minimum for this pattern |
| <4.16.0 | Missing assetLoader improvements |
