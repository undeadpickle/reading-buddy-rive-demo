# Rive Editor Setup Guide
## Configuring the Buddy Rive File for Dynamic Asset Loading

**Last Updated:** January 1, 2026

---

## Prerequisites

- Rive Early Access Desktop App (Mac)
- Existing Rive file with buddy rig and animations
- Cursor IDE with MCP configured (for AI assistance)

---

## Current File Status

**File:** `buddy-template.riv` (name TBD)  
**Artboard:** 1 artboard with the buddy character  
**State Machine:** `BuddyStateMachine`  
**Current Animations:** `idle`, `blink`  
**Assets:** Body parts currently embedded as PNGs (500x500)

---

## Step 1: Configure Assets as Referenced

For each body part image in the Rive file:

1. Open the **Assets** panel (left sidebar)
2. Select an image asset (e.g., `head`)
3. In the **Inspector** (right sidebar), find **Export Type**
4. Change from `Embedded` → **`Referenced`**
5. Repeat for ALL body part images:

### Body Parts to Convert

| Asset Name | Description |
|------------|-------------|
| `head` | Main head/face |
| `headBack` | Back of head (for layering) |
| `torso` | Body/chest |
| `armLeft` | Left arm |
| `armRight` | Right arm |
| `legLeft` | Left leg |
| `legRight` | Right leg |
| `legSeparator` | Element between legs |
| `tail` | Tail (if applicable) |
| `eyeLeft` | Left eye (open) |
| `eyeRight` | Right eye (open) |
| `eyeBlinkLeft` | Left eye (closed/blink) |
| `eyeBlinkRight` | Right eye (closed/blink) |

### Important: Asset Naming

**Asset names in Rive MUST match the CDN file names (without extension).**

- In Rive: `head`
- On CDN: `head.png`, `head@2x.png`, `head@3x.png`

To rename an asset in Rive:
1. Select the asset in the Assets panel
2. Double-click the name or find it in the Inspector
3. Rename to match exactly (case-sensitive)

---

## Step 2: Verify Bone/Rig Setup

The rig should already be set up, but verify:

1. Each body part image is attached to a bone
2. Bones are properly hierarchical (torso → arms, head, legs, etc.)
3. Constraints are working (if any)

### Expected Bone Hierarchy

```
root
├── torso_bone
│   ├── head_bone
│   │   ├── eyeLeft_bone
│   │   └── eyeRight_bone
│   ├── armLeft_bone
│   ├── armRight_bone
│   └── tail_bone
├── legLeft_bone
├── legRight_bone
└── legSeparator_bone
```

---

## Step 3: State Machine Setup

### Current State Machine: `BuddyStateMachine`

The state machine uses a **two-layer architecture** to allow body movements and eye blinking to run independently:

```
BuddyStateMachine
├── BodyLayer (handles body movements)
│   ├── Entry → idle (looping)
│   ├── Any State → wave (trigger: wave) → idle (Exit: 100%)
│   └── Any State → jump (trigger: jump) → idle (Exit: 100%)
│
└── BlinkLayer (handles eye animations - runs in parallel)
    ├── Entry → eyes_open
    └── eyes_open ↔ blink (auto-loop with ~3-4s delay)
```

#### BodyLayer States

| State | Type | Description |
|-------|------|-------------|
| `idle` | Animation | Default looping idle animation |
| `wave` | Animation | Arm wave animation |
| `jump` | Animation | Jump/bounce animation |

#### BlinkLayer States

| State | Type | Description |
|-------|------|-------------|
| `eyes_open` | Timeline | Eyes in open position (~3-4s duration for timing) |
| `blink` | Animation | Blink animation (swap eye images) |

#### Inputs Needed

| Input Name | Type | Purpose |
|------------|------|---------|
| `wave` | Trigger | Fires to play wave animation |
| `jump` | Trigger | Fires to play jump animation |
| `blink` | Trigger | Manually trigger blink (optional, auto-blink runs independently) |

#### Creating Inputs

1. Select the State Machine in the Animations panel
2. In the Inspector, find **Inputs**
3. Click **+** to add new input
4. Select type: **Trigger**
5. Name it exactly as shown above (case-sensitive)

#### Wiring Transitions - BodyLayer

1. **Entry → idle**
   - Automatic, no condition
   - Set idle animation to **Loop: ON**

2. **Any State → wave**
   - Condition: `wave` trigger fired
   - Duration: Immediate

3. **wave → idle**
   - Condition: None (automatic)
   - **Exit Time: 100%** (CRITICAL - prevents infinite loop)

4. **Any State → jump**
   - Condition: `jump` trigger fired
   - Duration: Immediate

5. **jump → idle**
   - Condition: None (automatic)
   - **Exit Time: 100%** (CRITICAL - prevents infinite loop)

#### Wiring Transitions - BlinkLayer

1. **Entry → eyes_open**
   - Automatic, no condition

2. **eyes_open → blink**
   - Condition: None (automatic)
   - Duration set by eyes_open timeline length (~3-4 seconds)

3. **blink → eyes_open**
   - Condition: None (automatic)
   - **Exit Time: 100%**

#### Critical: Exit Time Setting

**Always set Exit Time to 100%** on transitions that should wait for animation completion. Without this, transitions fire continuously causing infinite loops.

---

## Step 4: Blink Animation Setup

The blink animation swaps the eye images:

1. Create a timeline called `blink`
2. At frame 0: `eyeLeft` and `eyeRight` visible, `eyeBlinkLeft` and `eyeBlinkRight` hidden
3. At frame 5 (or similar): Swap visibility (open eyes hidden, closed eyes visible)
4. At frame 10: Swap back (open eyes visible)
5. At frame 15: End of animation

### Using Solos for Eye States

Consider using **Solos** instead of opacity for performance:

1. Create a Solo containing `eyeLeft` and `eyeRight` (open eyes)
2. Create another Solo containing `eyeBlinkLeft` and `eyeBlinkRight` (closed eyes)
3. In the blink timeline, key the Solo's active state

---

## Step 5: Export the Rive File

1. **File** → **Export** → **For Runtime**
2. Choose destination: `public/buddy-template.riv`
3. **Do NOT** check "Include assets in zip" (we load from CDN)

### What Gets Exported

- Rive file: `buddy-template.riv` (tiny, just bones + animations + state machine)
- Reference zip: Contains the referenced images (you can ignore this)

---

## Step 6: MCP Integration (Optional)

If using Cursor with Rive MCP:

### Verify MCP Connection

1. Have Rive Early Access app open with your file
2. Open Cursor
3. Go to Settings → MCP
4. Verify "Rive" shows as connected (green)

### MCP Configuration

Location: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "rive": {
      "url": "http://localhost:9791/sse"
    }
  }
}
```

### Using MCP Commands

You can ask Cursor's AI to:
- Create state machine states
- Add inputs
- Create transitions
- Modify layouts

Example prompt:
```
Create a new trigger input called "jump" in the BuddyStateMachine
```

**Note:** After making changes via MCP, type "End Prompt" to apply changes.

---

## Troubleshooting

### Asset Not Loading at Runtime

1. **Check asset name** - Must match exactly (case-sensitive)
2. **Check export type** - Must be "Referenced" not "Embedded"
3. **Check CDN URL** - Verify the asset exists at the expected path
4. **Check console** - Look for 404 errors

### State Machine Not Responding

1. **Verify state machine name** - Must match code exactly
2. **Verify input names** - Case-sensitive
3. **Check transitions** - Ensure states are connected with valid conditions

### Animation Not Playing

1. **Check autoplay** - State machine should autoplay
2. **Check entry state** - Ensure state machine has an entry point
3. **Check "Any State"** - For triggers, use "Any State" as transition source

### Animation Plays But Doesn't Return to Idle

**Symptom:** Trigger fires, animation plays once, then the character freezes (no more idle animation). Subsequent triggers may not work until the page is refreshed.

**Cause:** Missing transition from the animation state back to Idle, or transition exists but lacks Exit Time.

**Fix:**
1. In the state machine, select the animation state (e.g., Wave, Jump)
2. Create a transition from that state → Idle (if missing)
3. Select the transition and set **Exit Time: 100%**
4. Ensure Idle has **Loop: ON**

**Visual check:** Your state machine graph should show arrows going FROM Wave/Jump TO Idle, not just arrows going TO Wave/Jump.

```
❌ Wrong (no return path):
Any State → Wave (stuck here forever)

✅ Correct (returns to idle):
Any State → Wave → Idle (exit 100%)
                    ↑ (loops)
```

---

## Quick Reference: Inspector Panels

| Panel | Location | Purpose |
|-------|----------|---------|
| Assets | Left sidebar, bottom | Manage imported images/fonts |
| Hierarchy | Left sidebar, top | View artboard structure |
| Inspector | Right sidebar | Properties of selected element |
| Animations | Bottom panel | Timelines and state machines |
| Design/Prototype tabs | Right sidebar, top | Switch between design and animation mode |

---

## File Checklist Before Handoff

- [x] All body part images named correctly
- [x] All body part images set to "Referenced" export type
- [x] State machine named `BuddyStateMachine`
- [x] Two layers created: `BodyLayer` and `BlinkLayer`
- [x] Inputs created: `wave`, `jump`, `blink`
- [x] BodyLayer states: `idle`, `wave`, `jump`
- [x] BlinkLayer states: `eyes_open`, `blink`
- [x] All transitions use Exit Time 100% where needed
- [x] Idle set to loop
- [x] File exported to `public/buddy-template.riv`
- [x] Verified file size is small (bones + SM only, no embedded images)
