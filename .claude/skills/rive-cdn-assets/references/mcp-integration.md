# Rive MCP Integration

Connect AI tools to the Rive Editor for automated animation setup.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Available Tools](#available-tools)
4. [Usage Examples](#usage-examples)
5. [Troubleshooting](#troubleshooting)

---

## Overview

Rive MCP (Model Context Protocol) allows AI assistants like Claude to directly create and modify Rive animations through natural language prompts. This is useful for:

- Creating complex state machines with many states/layers
- Setting up View Models with properties
- Generating layouts programmatically
- Batch-configuring assets

**Requirement:** Rive Early Access Mac desktop app (Windows coming soon)

---

## Setup

### 1. Install Rive Early Access

Download from [rive.app](https://rive.app) and install the Early Access version.

### 2. Configure Claude Code / Cursor

Add to your MCP configuration:

**Claude Code** (`~/.claude/mcp.json`):
```json
{
  "mcpServers": {
    "rive": {
      "url": "http://localhost:9791/sse"
    }
  }
}
```

**Cursor** (Settings → MCP):
```json
{
  "mcpServers": {
    "rive": {
      "url": "http://localhost:9791/sse"
    }
  }
}
```

### 3. Verify Connection

1. Open Rive Early Access app with your .riv file
2. Check that the MCP server is running (Rive → Preferences → MCP)
3. In Claude Code/Cursor, verify "Rive" shows as connected

---

## Available Tools

| Tool | Description |
|------|-------------|
| **Create State Machine** | Create state machines with layers, states, transitions |
| **Create View Model** | Create View Models with typed properties |
| **Create Layout** | Generate responsive layouts |
| **Create Shape** | Add shapes to artboards |
| **List View Models** | Query existing View Models |

### State Machine Capabilities

- Create multiple layers (e.g., BodyLayer, BlinkLayer)
- Add states with animations
- Configure transitions with conditions
- Set trigger, boolean, and number inputs

### View Model Capabilities

- Create properties (boolean, number, string, color, enum)
- Bind properties to animation inputs
- Create instances for data-driven animations

---

## Usage Examples

### Create a Two-Layer State Machine

Prompt:
```
Create a state machine called "BuddyStateMachine" with two layers:
1. BodyLayer with states: idle (looping), wave, jump - all returning to idle
2. BlinkLayer with states: eyes_open, blink - auto-cycling
Add trigger inputs: wave, jump, blink
```

### Set Assets to Referenced

Prompt:
```
For all image assets in this file, set the export type to "Referenced"
```

### Create View Model for Character Selection

Prompt:
```
Create a View Model called "CharacterConfig" with:
- characterId: string
- skinColor: color
- isHappy: boolean
```

---

## Workflow with Asset Loading

1. **Design in Rive Editor** — Create bones, rig, basic animations
2. **Use MCP to set up state machine** — Automate complex layer/state creation
3. **Use MCP to mark assets as Referenced** — Batch configure export types
4. **Export .riv file** — Bones + state machine only, no embedded images
5. **Implement asset loader in React** — Load images from your CDN

---

## Ending Prompts

**Important:** After AI generates changes, type `End Prompt` in the Rive Editor to apply them.

Changes are staged until you confirm with "End Prompt".

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| MCP not connecting | Rive app not running | Open Rive Early Access |
| Connection timeout | Wrong port | Verify localhost:9791 in config |
| Changes not applying | Forgot End Prompt | Type "End Prompt" in Rive |
| Tools not appearing | MCP not enabled | Rive → Preferences → Enable MCP |

---

## Resources

- [Rive MCP Documentation](https://rive.app/docs/editor/mcp/integration)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Rive Community](https://community.rive.app)
