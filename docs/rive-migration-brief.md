# Reading Buddy Animation Migration: AE/Lottie → Rive

## Executive Summary

Our After Effects/Lottie animation system was the right choice when we started, but it is now holding us back. Every new buddy animation increases file size, complicates the AE timeline, and requires engineering work for logic that should live with design.

**Rive solves these problems with:**

- **10-15x smaller files**
- **3x better performance**
- **Built-in state machines** that let designers own animation logic

---

## The Problem

The current AE/Lottie workflow presents several scaling challenges:

- **File Bloat:** JSON format is verbose; file sizes grow with every animation added.
- **Fragile Timeline:** Managing 20-50 states via markers on a single timeline is brittle and hard to maintain.
- **Code-Dependent Logic:** Designers cannot iterate independently; every trigger requires engineering support.
- **Hacky Asset Swapping:** Body-part swapping is a custom workaround tightly coupled to layer naming.

> **The Trajectory:** With interactive buddy, voice integration, and more character states on the roadmap, these issues will only compound.

---

## Why Rive?

| Feature            | Lottie                | Rive                          |
| :----------------- | :-------------------- | :---------------------------- |
| **File Size**      | ~240KB                | **~16KB** (10-15x smaller)    |
| **Performance**    | ~17 FPS               | **~60 FPS**                   |
| **Interactivity**  | Code-driven markers   | **Built-in state machines**   |
| **Asset Swapping** | Custom workaround     | **Native API**                |
| **Workflow**       | AE → Bodymovin → Code | **Rive Editor → .riv → Code** |

### Key Capabilities Enabled

- **Logic Portability:** State Machines act as a "source of truth," ensuring animation logic works identically across platforms (iOS, Android, Web) without redundant engineering.
- **Dynamic Personalization:** Native asset swapping allows for "skinning"—changing character outfits or seasonal themes without exporting new animation files.
- **Designer Autonomy:** Animation logic moves from the engineering backlog to the design phase, reducing development cycles for trigger tweaks.
- **Voice/Audio Sync:** Native audio support for "Read-to-Me" Buddy features.

---

## Addressing "Why Change?"

### Rive Unlocks More Future Buddy Features

#### Voice Over Audio

- Different voices for different buddy types
- Voice-acted or AI generated (TBD)
- Voice can convey more personality

#### Read-to-Me Buddy

- **AI Narration:** Buddy reads books aloud using unique voice personas
- **Take-Turns Mode:** Buddy "listens" (animation state) while the child reads, then takes its turn

#### Expanded Content

- More unlockable Buddies
- More Accessories

#### Interactivity

- **Touch/Interact Reactions:** Buddy responds to touch interactions
- **Quests from Buddy:** Buddy sends child letters via Mailbox; some letters can be quests or challenges
- **Fully Interactive Agent:** Real-time blending between "Speaking" and "Laughing" during AI-driven jokes
- **Dynamic Costumes:** Attach props (e.g., Space Helmet) to specific "Bone Anchors" without re-rendering character animations

---

## Bottom Line

Rive provides smaller files, smoother animations, and a workflow where designers own the animation logic. This migration unblocks the interactive buddy and voice features, making every future animation cheaper to build and maintain.

---

## Sources

- [Rive vs Lottie Performance (Callstack)](https://www.callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation)
- [Rive as Lottie Alternative (Rive Blog)](https://rive.app/blog/rive-as-a-lottie-alternative)
- [Runtime Asset Swapping (Rive Docs)](https://rive.app/community/doc/runtime-asset-swapping/docCK8JCPhVm)
- [Rive 2025 Comparison (DEV Community)](https://dev.to/uianimation/rive-vs-lottie-which-animation-tool-should-you-use-in-2025-p4m)
