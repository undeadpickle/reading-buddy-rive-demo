# Reading Buddy - Rive Animation System
## Product Requirements Document

**Project:** Epic Reading Buddy Interactive Animation System  
**Owner:** Travis Gregory  
**Last Updated:** December 30, 2025  
**Status:** Proof of Concept

---

## Executive Summary

The Reading Buddy is a companion character in Epic's kids reading app that encourages children to read by providing rewards, encouragement, and a sense of companionship. Currently animated using Lottie (After Effects exports), the system is tedious to maintain and lacks meaningful interactivity.

This project aims to migrate the Reading Buddy to **Rive**, enabling:
- Real-time interactive animations (tap, gesture responses)
- Dynamic asset loading from CDN (character swapping, accessories)
- Data-driven events (reward celebrations, streak achievements)
- A more engaging, "alive" feeling character

---

## Problem Statement

### Current Pain Points

1. **Lottie/After Effects Workflow**
   - Time-consuming animation creation in After Effects
   - Large file sizes for complex animations
   - Limited runtime interactivity
   - Difficult to iterate on animations

2. **Static Buddy Experience**
   - Users can only equip accessories
   - No tap or gesture interactions
   - Buddy doesn't respond to in-app events dynamically
   - Character feels like a static asset, not a companion

3. **Asset Management**
   - Multiple buddy characters with similar rigs
   - All body parts are separate 500x500 PNGs
   - No efficient way to swap characters at runtime

---

## Goals

### Primary Goals

1. **Prove Rive Feasibility** - Demonstrate that Rive can handle dynamic asset loading from CDN, character swapping, and interactive animations

2. **Create Test Harness** - Build a React-based testing environment to validate animations, asset loading, and data-driven events

3. **Establish Workflow** - Define the Rive → React pipeline for the team to adopt

### Success Metrics

- [ ] Single Rive file works with multiple character skins via CDN loading
- [ ] Animations trigger reliably via state machine inputs
- [ ] Tap interactions respond within 100ms
- [ ] Asset loading/caching performs acceptably
- [ ] Team can iterate on animations without code changes

---

## Scope

### In Scope (Phase 1 - POC)

| Feature | Description |
|---------|-------------|
| **Single Buddy Rig** | One Rive file with bones, constraints, state machine |
| **CDN Asset Loading** | Load character body parts from GitHub repo (dev CDN) |
| **Basic Animations** | Idle, blink, wave, jump, tap response |
| **Character Switching** | Swap between different buddy characters |
| **React Test Harness** | Web interface to test all features |
| **Tap Interaction** | Buddy responds to clicks/taps |

### Out of Scope (Future Phases)

| Feature | Phase |
|---------|-------|
| Accessory system (hats, glasses, masks) | Phase 2 |
| Egg hatching animation | Phase 2 |
| Speech bubbles | Phase 2 |
| Data-driven reward events (3-star celebrations) | Phase 3 |
| Production CDN integration | Phase 3 |
| Mobile/native runtime testing | Phase 3 |

---

## User Stories

### Phase 1

1. **As a developer**, I want to load a Rive animation with dynamically loaded images so that I don't need to embed all character assets in the .riv file.

2. **As a developer**, I want to swap character skins at runtime so that users can switch between different Reading Buddies.

3. **As a developer**, I want to trigger animations programmatically so that the Buddy can respond to in-app events.

4. **As a QA tester**, I want a test harness where I can manually trigger all animations and switch characters to verify the system works correctly.

5. **As a child user**, I want to tap on my Buddy and see it react so that it feels alive and fun.

---

## Technical Requirements

### Rive File Structure

```
buddy-template.riv
├── Artboard: "Buddy"
│   ├── Bones/Rig (shared across all characters)
│   ├── Referenced Images (loaded from CDN):
│   │   ├── head
│   │   ├── headBack
│   │   ├── torso
│   │   ├── armLeft
│   │   ├── armRight
│   │   ├── legLeft
│   │   ├── legRight
│   │   ├── legSeparator
│   │   ├── tail
│   │   ├── eyeLeft
│   │   ├── eyeRight
│   │   ├── eyeBlinkLeft
│   │   └── eyeBlinkRight
│   └── State Machine: "BuddyStateMachine"
│       ├── BodyLayer: idle (loop), wave, jump
│       ├── BlinkLayer: eyes_open ↔ blink (auto-loop)
│       └── Inputs: wave (trigger), jump (trigger), blink (trigger)
```

### Asset Requirements

- All body parts: 500x500 PNG with transparency
- Resolution variants: 1x, @2x, @3x
- Naming convention: `{partName}.png`, `{partName}@2x.png`, `{partName}@3x.png`
- CDN structure: `/{character}/{partName}@{resolution}.png`

### Runtime Requirements

- React 18+
- `@rive-app/react-canvas` runtime
- Asset loader callback for OOB (out-of-band) image loading
- State machine input access for triggering animations

---

## Characters (Initial Set)

| Character | Folder Name | Description |
|-----------|-------------|-------------|
| Orange Cat | `CatdogOrange` | Default buddy |
| Gray Cat | `CatdogGray` | Variant |
| Blue Cat | `CatdogBlue` | Variant |
| Green Cat | `CatdogGreen` | Variant |
| Purple Cat | `CatdogPurple` | Variant |

*Additional characters from Epic's original books (Cat Ninja, Scaredy Monster, etc.) will be added in later phases.*

---

## Acceptance Criteria

### Phase 1 Complete When:

- [ ] Rive file loads in React app
- [ ] Body parts load from GitHub CDN (not embedded)
- [ ] Idle animation plays automatically
- [ ] Blink animation triggers correctly
- [ ] Tap on buddy triggers a response animation
- [ ] Character can be switched via dropdown
- [ ] New character's assets load from CDN
- [ ] No console errors during normal operation
- [ ] Asset loading time < 2 seconds on fast connection

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Rive file setup (Referenced assets) | Week 1 | In Progress |
| React test harness scaffold | Week 1 | Not Started |
| CDN asset loading working | Week 1-2 | Not Started |
| Basic animations (idle, blink) | Week 2 | Not Started |
| Tap interaction | Week 2 | Not Started |
| Character switching | Week 2-3 | Not Started |
| Team demo | Week 3 | Not Started |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OOB asset loading doesn't work as expected | High | Test early with single asset before full integration |
| Performance issues with large PNGs | Medium | Test with @1x assets first; implement lazy loading |
| State machine complexity grows | Medium | Keep state machine simple; document patterns |
| Team adoption resistance | Low | Create clear documentation; demo benefits early |

---

## Open Questions

1. Should accessories be separate artboards or layers with visibility toggles?
2. What's the maximum number of state machine inputs before performance degrades?
3. Do we need to support SVG assets or only PNG?
4. How will this integrate with the existing Epic app's React Native codebase?

---

## References

- [Rive Documentation](https://rive.app/docs)
- [Rive React Runtime](https://rive.app/docs/runtimes)
- [Rive Asset Loading](https://rive.app/docs/runtimes/loading-assets)
- [Rive MCP Integration](https://rive.app/docs/editor/mcp/integration)
- [Project GitHub Repo](https://github.com/undeadpickle/reading-buddy-rive-demo.git)
