# Implementation Phases
## Reading Buddy Rive Migration Roadmap

**Last Updated:** December 30, 2025

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Proof of Concept                                    [CURRENT] │
│ • CDN asset loading • Basic animations • Character switching            │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Feature Parity                                                 │
│ • Accessories • Egg hatching • Speech bubbles                          │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Production Integration                                         │
│ • Epic CDN • React Native • Data events                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Enhanced Interactivity                                         │
│ • Gestures • Physics • Personalization                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Proof of Concept ⬅️ CURRENT

**Goal:** Validate that Rive can handle dynamic CDN asset loading and character swapping

**Timeline:** 2-3 weeks

### Deliverables

| Task | Status | Notes |
|------|--------|-------|
| Set up GitHub repo with buddy assets | ⬜ Not Started | `undeadpickle/reading-buddy-rive-demo` |
| Configure Rive file with Referenced assets | ⬜ Not Started | All body parts |
| Create React test harness | ⬜ Not Started | Vite + React 18 |
| Implement `useBuddyRive` hook | ⬜ Not Started | Asset loader callback |
| Basic animations working (idle, blink) | ⬜ Not Started | |
| Tap interaction | ⬜ Not Started | State machine trigger |
| Character switching | ⬜ Not Started | Reload assets from different folder |
| Document learnings | ⬜ Not Started | Update these docs |

### Technical Tasks

1. **Rive Editor**
   - [ ] Rename all assets to match CDN naming
   - [ ] Set all images to "Referenced" export type
   - [ ] Verify state machine is named `BuddyStateMachine`
   - [ ] Add `tap` trigger input
   - [ ] Export .riv file (no embedded assets)

2. **GitHub CDN Setup**
   - [ ] Create `buddies/` folder structure
   - [ ] Upload CatdogOrange assets (all parts, all resolutions)
   - [ ] Upload at least one more character (CatdogGray)
   - [ ] Verify raw URLs are accessible

3. **React App**
   - [ ] Initialize Vite + React + TypeScript project
   - [ ] Install `@rive-app/react-canvas`
   - [ ] Implement `useBuddyRive` hook
   - [ ] Create `BuddyCanvas` component
   - [ ] Create character switcher UI
   - [ ] Create animation trigger buttons
   - [ ] Test and debug

### Acceptance Criteria

- [ ] Rive file loads without errors
- [ ] All 13 body parts load from GitHub CDN
- [ ] Idle animation plays automatically
- [ ] Clicking buddy triggers tap animation
- [ ] Changing character dropdown reloads all assets
- [ ] No memory leaks after 10 character switches
- [ ] Works in Chrome, Firefox, Safari

---

## Phase 2: Feature Parity

**Goal:** Match current Lottie-based buddy capabilities plus accessories

**Timeline:** 3-4 weeks

### Deliverables

| Feature | Description |
|---------|-------------|
| **Accessory System** | Load and display hats, glasses, masks on buddy |
| **More Animations** | Wave, jump, shrug, celebrate |
| **Egg Hatching** | Interactive egg crack animation |
| **Speech Bubbles** | Buddy communication UI |
| **Accessory Picker UI** | Test interface for equipping accessories |

### Technical Approach

#### Accessories

**Option A: Separate Artboard**
- Create artboard per accessory
- Load as nested artboard
- Position via constraints

**Option B: Layer Visibility**
- Include all accessories in main artboard
- Use Solos/visibility to show/hide
- Larger .riv file but simpler runtime

**Recommendation:** Start with Option B for simplicity, evaluate performance

#### Egg Hatching

- Separate artboard: `Egg`
- State machine inputs:
  - `crackProgress` (number 0-100)
  - `hatch` (trigger)
- Transitions: idle egg → cracking → hatched (reveal buddy)

#### Speech Bubbles

- Could be Rive or React component
- If Rive: Text runs with data binding
- If React: Position overlay relative to buddy

### Dependencies

- Phase 1 complete
- Accessory assets on CDN
- Egg assets on CDN
- Additional animations created in Rive

---

## Phase 3: Production Integration

**Goal:** Integrate with Epic app infrastructure

**Timeline:** 4-6 weeks

### Deliverables

| Feature | Description |
|---------|-------------|
| **Epic CDN Integration** | Switch from GitHub to production CDN |
| **React Native Support** | Verify/adapt for mobile app |
| **Data-Driven Events** | Buddy reacts to reading milestones |
| **Analytics** | Track animation impressions, interactions |
| **Caching Strategy** | Efficient asset caching for mobile |

### Data-Driven Events

| Event | Buddy Reaction |
|-------|----------------|
| 3-day reading streak | Jump + celebrate |
| Earned new badge | Wave + particles |
| Completed book | Dance animation |
| New buddy unlocked | Egg hatch sequence |
| Accessory earned | Equip animation |

### Technical Considerations

#### React Native

- Use `@rive-app/react-native` runtime
- Different asset loading API (see Rive docs)
- Test on iOS and Android
- Consider native asset bundling

#### CDN Migration

```typescript
// Toggle between dev and prod CDN
const CDN_BASE = process.env.NODE_ENV === 'production'
  ? 'https://cdn.getepic.com/buddies'
  : 'https://raw.githubusercontent.com/undeadpickle/reading-buddy-rive-demo/main/buddies';
```

#### Performance Requirements

- Initial load: < 3 seconds
- Character switch: < 1 second
- Animation response: < 100ms
- Memory usage: < 50MB

---

## Phase 4: Enhanced Interactivity

**Goal:** Make buddy feel truly alive and personalized

**Timeline:** Ongoing

### Ideas

| Feature | Description |
|---------|-------------|
| **Gesture Support** | Swipe, drag, pinch interactions |
| **Physics Response** | Buddy reacts to device tilt/shake |
| **Mood System** | Buddy mood changes based on usage |
| **Customization** | Color variants, patterns |
| **Procedural Animation** | Eye tracking, breathing variation |
| **Sound Effects** | Audio feedback on interactions |

### Advanced Rive Features to Explore

- **Data Binding** - Link buddy state to app data
- **Blend States** - Smooth transitions between moods
- **Listeners** - Advanced tap/hover regions
- **Events** - Fire callbacks at animation keyframes

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12-30 | Use Referenced assets (not Hosted) | Need CDN control, character swapping |
| 2024-12-30 | Start with GitHub CDN for dev | Simpler setup, no Epic infra needed |
| 2024-12-30 | Single Rive file for all characters | Shared rig, dynamic asset loading |
| 2024-12-30 | Use Vite for test harness | Fast dev server, good React support |

---

## Risks & Blockers

### Phase 1 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OOB loading issues | Medium | High | Test with single asset first |
| GitHub raw CDN rate limits | Low | Medium | Have backup CDN ready |
| Performance issues | Low | Medium | Profile early, optimize PNGs |

### Future Phase Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| React Native compatibility | Medium | High | Test early in Phase 3 |
| Epic CDN CORS issues | Medium | Medium | Coordinate with infra team |
| Mobile memory constraints | Medium | Medium | Resolution-aware loading |

---

## Team Communication

### Demo Schedule

| Phase | Demo | Audience |
|-------|------|----------|
| Phase 1 | POC Demo | Engineering team |
| Phase 2 | Feature Demo | Product + Design |
| Phase 3 | Integration Demo | Full team + Stakeholders |

### Documentation Updates

These docs should be updated:
- After each major milestone
- When technical decisions change
- When new patterns are discovered
- When issues are resolved

---

## Resources

### Rive Documentation
- [Getting Started](https://rive.app/docs/getting-started/introduction)
- [Loading Assets](https://rive.app/docs/runtimes/loading-assets)
- [React Runtime](https://rive.app/docs/runtimes)
- [State Machines](https://rive.app/docs/runtimes/state-machines)

### Community
- [Rive Community](https://community.rive.app)
- [Rive Discord](https://discord.gg/rive)

### Tools
- [Rive Editor (Web)](https://editor.rive.app)
- [Rive Early Access](https://rive.app/downloads) - Desktop with MCP support
