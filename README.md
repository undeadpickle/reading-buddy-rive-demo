# Reading Buddy - Rive Animation System
## Documentation

This folder contains comprehensive documentation for the Reading Buddy Rive migration project.

---

## Quick Start

**If you're an AI agent (Claude Code, Cursor, etc.):**
→ Start with [`AGENT_CONTEXT.md`](./AGENT_CONTEXT.md)

**If you're a human developer:**
→ Start with [`PRD.md`](./PRD.md) then [`TECHNICAL_SPEC.md`](./TECHNICAL_SPEC.md)

**If you're working in the Rive Editor:**
→ See [`RIVE_EDITOR_SETUP.md`](./RIVE_EDITOR_SETUP.md)

---

## Document Index

| Document | Purpose | Audience |
|----------|---------|----------|
| [PRD.md](./PRD.md) | Product requirements, goals, scope | Everyone |
| [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) | Architecture, code examples, implementation | Developers |
| [RIVE_EDITOR_SETUP.md](./RIVE_EDITOR_SETUP.md) | Rive file configuration guide | Designers, Developers |
| [ASSET_STRUCTURE.md](./ASSET_STRUCTURE.md) | CDN organization, file naming | Designers, Developers |
| [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md) | Roadmap, milestones, timeline | Project managers, Developers |
| [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) | Quick reference for AI agents | AI assistants |

---

## Project Summary

**What:** Migrate Epic's Reading Buddy character from Lottie to Rive for interactive animations.

**Why:** 
- Current Lottie/After Effects workflow is slow and tedious
- Buddy can't respond to taps or in-app events
- Need to swap character skins dynamically from CDN

**How:** 
- Single Rive file with shared bone rig
- Load character-specific images from CDN at runtime
- State machine controls animations
- React test harness for validation

---

## Key Links

- **GitHub Repo:** https://github.com/travisgregory/Rive.git
- **Rive Documentation:** https://rive.app/docs
- **Rive Asset Loading:** https://rive.app/docs/runtimes/loading-assets

---

## Current Status

**Phase 1: Proof of Concept** ← We are here

- [ ] Rive file configured with Referenced assets
- [ ] GitHub CDN populated with buddy assets
- [ ] React test harness built
- [ ] Basic animations working
- [ ] Character switching working

---

## Contributing

When updating these docs:
1. Keep information current
2. Add to decision log in `IMPLEMENTATION_PHASES.md`
3. Update status checkboxes
4. Note any new patterns discovered

---

*Last updated: December 30, 2025*
