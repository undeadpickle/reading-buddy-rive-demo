# 🚀 Project Kickoff: Phase 1 Complete - Dual Canvas & State Machine Fixes

Generated: January 7, 2026
Previous Session Summary: Successfully added dual Rive canvas support for original and cropped templates

⸻

## 🎯 Mission for Next Session

Phase 2: Accessories System - Build on the dual canvas foundation to add hats, glasses, masks, and other accessories that can be equipped on both the original and cropped buddy templates. Ensure accessories work with the CDN loading pattern and align properly across different character configurations.

⸻

## 📊 Current Status

✅ **Completed in This Session:**

- **Dual Canvas Support**: Added support for displaying both `buddy-template.riv` and `buddy-template-cropped.riv` side-by-side
- **Dynamic CDN Paths**: Implemented `cdnSubfolder` prop to support different asset locations (`buddies/` vs `buddies_cropped_parts/`)
- **Prop Drilling Architecture**: Added `src`, `cdnSubfolder`, and `resolution` props through component chain
- **State Machine Fix**: Fixed cropped buddy's state machine where animations weren't returning to idle
- **Documentation Updates**: Added state machine transition gotcha to CLAUDE.md, AGENT_CONTEXT.md, and RIVE_EDITOR_SETUP.md

👉 **Next Priority:**

- Phase 2: Implement accessories system for both canvas types
- Add support for other character colors in cropped CDN folder
- Consider performance optimization for dual canvas rendering
- Implement accessory persistence across character switches

⸻

## 🔬 Session Retrospective

### What Worked Well

- **Prop Passthrough Pattern**: Clean implementation passing new props (`src`, `cdnSubfolder`, `resolution`) through BuddyLoader → BuddyCanvas → useBuddyRive
- **CDN Structure Refactor**: Moving base URL logic to exclude subfolder made the system more flexible
- **Shared Animation Controls**: Single set of buttons controlling both canvases via refs worked seamlessly
- **Quick Debugging**: Console logs for trigger firing helped identify the state machine issue quickly
- **Documentation First**: Adding troubleshooting docs immediately after fixing prevents future occurrences

### Edge Cases & Failures Encountered

- **404 on @2x Assets**: Initially set `resolution="2x"` for full template, but `buddies/` folder only has 1x assets. Fixed by changing to `resolution="1x"`
- **State Machine Stuck on Animation**: Cropped buddy's Wave/Jump states had no transition back to Idle. Fixed by adding transitions with Exit Time: 100%
- **Jump Only Works After Wave**: Discovered Jump transition was wired incorrectly - only accessible from Wave state instead of Any State
- **Chrome DevTools MCP Issues**: Initial connection errors with "browser already running" - user manually resolved

### Wrong Assumptions

- **Asset Resolution**: Assumed both CDN folders had @2x assets, but only the original `buddies/` has 1x
- **State Machine Consistency**: Assumed both .riv files had identical state machine wiring, but cropped version was missing return transitions
- **MCP Auto-Connect**: Expected Rive MCP to be available automatically, but required manual Rive app opening

### Documentation Updated

- [x] CLAUDE.md updated with: State machine transition requirements in "What NOT to Do"
- [x] AGENT_CONTEXT.md updated with: Exit Time 100% requirement
- [x] RIVE_EDITOR_SETUP.md updated with: Full troubleshooting section "Animation Plays But Doesn't Return to Idle"
- [ ] Still needs: Update constants.ts docs about CDN_BASE_URL not including subfolder

⸻

## 🧠 Project Context

### What Exists Now:

• **Dual Canvas Display**: Side-by-side rendering of original and cropped buddy templates
• **Flexible CDN Loading**: Support for different asset paths per canvas
• **Shared Animation System**: Single set of controls triggering animations on both canvases
• **Fixed State Machines**: Both templates now properly return to idle after animations
• **Complete Phase 1**: All core animation features working reliably

### Technology Stack:

• Frontend: React 18.3, TypeScript 5.6, Vite 6
• Animation: @rive-app/react-canvas 4.16.5
• State Management: React hooks (useState, useRef, useCallback)
• CDN: GitHub raw content with dynamic subfolder support
• Testing: Console-based verification (no unit tests yet)

### Architecture Improvements:

• CDN base URL now excludes subfolder for flexibility
• Component props support runtime configuration
• ForwardRef pattern maintained through component chain
• Preloading still works with new CDN structure

### What's Being Built:

1. Phase 2: Accessories system working on both canvas types
2. Support for multiple character colors in cropped CDN
3. Performance optimization for dual rendering
4. Potential BlinkLayer addition to cropped template

⸻

## 📋 Recommended Next Tasks

### Task 1: Add Cropped Character Assets

**Files to modify:**

- Upload assets to `buddies_cropped_parts/` for other characters
- Update `src/App.tsx` to handle missing characters gracefully

**Steps:**

1. Export cropped assets for CatdogGray, CatdogBlue, CatdogGreen, CatdogPurple
2. Upload to GitHub in correct folder structure
3. Add error handling for 404s on character switch
4. Consider showing "Coming Soon" for unavailable characters

**Watch out for:**
- Exact 500x500 dimensions required
- Case-sensitive filenames
- Only 1x resolution for cropped assets

**Estimated effort:** 2-3 hours

### Task 2: Optimize Dual Canvas Performance

**Files to modify:**

- `src/components/BuddyLoader.tsx` - Share asset cache between canvases
- `src/hooks/useBuddyRive.ts` - Deduplicate fetches

**Steps:**

1. Create shared asset cache at App level
2. Pass cache to both BuddyLoader instances
3. Measure performance improvement
4. Consider lazy loading second canvas

**Watch out for:**
- Memory usage with double assets
- Race conditions in cache access
- Cache invalidation on character switch

**Estimated effort:** 4 hours

### Task 3: Begin Accessories System

**Files to modify:**

- `src/types/buddy.ts` - Add accessory interfaces
- `src/utils/constants.ts` - Define accessory types
- Create `src/components/AccessoryPicker.tsx`

**Steps:**

1. Design accessory data structure
2. Add accessory layers to both .riv files
3. Create UI for accessory selection
4. Test layering with both canvas types

**Estimated effort:** 6-8 hours

⸻

## 🚨 Critical Patterns & Rules

### Established Patterns:

1. **CDN URL Structure**: Base URL + subfolder + character + part + resolution
2. **Prop Drilling**: Configuration props pass through component hierarchy cleanly
3. **Shared Refs**: Use refs to control multiple canvases from single UI
4. **Exit Time 100%**: CRITICAL for state machine transitions back to idle
5. **Console Logging**: Keep trigger logs during development for debugging

### Patterns Learned This Session:

1. **State Machine Debugging**: Always check return paths from animation states
2. **CDN Flexibility**: Separate base URL from subfolder for multi-path support
3. **Resolution Assumptions**: Always verify available resolutions per CDN path
4. **Visual State Graph**: Use Rive's graph view to spot missing transitions

### Code Standards:

- Props interfaces clearly documented
- Default values for optional props
- Error boundaries for 404 assets
- Console logs for debugging (remove for production)
- Consistent naming: `cdnSubfolder` not `cdnPath`

### Testing Requirements:

- Test both canvases after any state machine change
- Verify all triggers work independently
- Check console for 404s on character switch
- Ensure idle animation resumes after actions
- Test with network throttling

⸻

## 📁 Key Files Reference

### Core Implementation:

1. **src/App.tsx** - Dual canvas layout, shared controls, character switching
2. **src/components/BuddyLoader.tsx** - Updated with new props passthrough
3. **src/components/BuddyCanvas.tsx** - Forwards new configuration props
4. **src/hooks/useBuddyRive.ts** - Handles dynamic CDN paths and Rive config
5. **src/utils/constants.ts** - CDN_BASE_URL now excludes subfolder
6. **src/utils/assetLoader.ts** - Updated to accept cdnSubfolder parameter

### Rive Files:

1. **public/buddy-template.riv** - Original template with full state machine
2. **public/buddy-template-cropped.riv** - Cropped template (fixed transitions)

### Documentation:

1. **CLAUDE.md** - Updated with state machine gotchas
2. **docs/RIVE_EDITOR_SETUP.md** - New troubleshooting section added
3. **docs/AGENT_CONTEXT.md** - Exit Time requirements documented

### CDN Structure:

```
/buddies/                    # Original assets (1x only currently)
  /CatdogOrange/
    head.png, torso.png, etc.

/buddies_cropped_parts/      # Cropped assets (1x only)
  /CatdogOrange/            # Only Orange available currently
    head.png, torso.png, etc.
```

⸻

## 🎮 Business Logic & Domain Rules

### Core Workflows:

• **Dual Canvas Loading**: Each canvas independently loads its assets from different CDN paths
• **Shared Animations**: Single button click triggers same animation on both canvases
• **Character Switching**: Both canvases reload with new character (if available)
• **State Machine Flow**: Any State → Animation → Idle (with Exit Time 100%)

### State Machine Rules:

• Every animation state MUST have transition back to Idle
• Exit Time MUST be 100% to complete animation before transitioning
• Idle state MUST have Loop enabled
• Triggers should be accessible from Any State (not chained)

### Asset Loading Rules:

• Asset names must match exactly (case-sensitive)
• All images must be 500x500 PNG with transparency
• Referenced export type required (not Embedded)
• Use `image.unref()` after `setRenderImage()`

⸻

## ⚠️ Known Issues & Technical Debt

### Open Issues:

1. **Missing Cropped Assets**: Only CatdogOrange available in `buddies_cropped_parts/`
2. **No @2x Assets**: Original `buddies/` folder lacks high-res versions
3. **Performance Impact**: Running two Rive instances may impact lower-end devices
4. **No Loading Error State**: 404s just show blank canvas

### Issues Discovered This Session:

1. **State Machine Wiring**: Cropped template had incorrect transition setup - now documented
2. **Resolution Mismatch**: Different CDN folders have different available resolutions
3. **MCP Connection**: Rive MCP requires manual app opening, not automatic

### Technical Debt:

1. **Duplicate Rendering**: Two canvases render similar content - consider optimization
2. **Hard-coded Paths**: CDN subfolders still hard-coded in App.tsx
3. **No Asset Validation**: Should verify assets exist before attempting load
4. **Console Noise**: Lots of debug logging should be removed

### Blockers/Constraints:

1. Must manually fix state machines in Rive editor
2. CDN folder structure is fixed - can't be changed
3. Asset dimensions must be exactly 500x500
4. Chrome DevTools MCP can be flaky

⸻

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev          # Starts on http://localhost:5173

# Type checking
npm run build       # TypeScript check + production build
npx tsc --noEmit   # Quick type check

# Code quality
npm run lint        # ESLint check

# Debugging
# Use Chrome DevTools Network tab to monitor CDN requests
# Check Console for trigger firing logs
# Rive DevTools can inspect state machine
```

⸻

## 🎯 Success Criteria for Next Session

• ✅ All character colors available for cropped template
• ✅ Performance optimization for dual canvas rendering
• ✅ Basic accessory system design in place
• ✅ No 404 errors on character switching
• ✅ Loading states handle missing assets gracefully
• ✅ All existing animations still work
• ✅ Documentation reflects dual canvas architecture
• ✅ Console logs cleaned up or made configurable

⸻

## 💡 Pro Tips for Next Session

1. **Check State Machines First** - Open both .riv files and verify transition wiring
2. **Test Cropped Assets** - Currently only Orange works, handle missing gracefully
3. **Watch the Console** - Trigger logs show if state machine is responding
4. **Exit Time is Critical** - Without it, animations play but character freezes
5. **Use Network Throttling** - Test loading states with Slow 3G profile
6. **Compare Canvas Behavior** - Both should behave identically for animations
7. **CDN Paths Matter** - Double-check subfolder parameter for each canvas
8. **Memory Profiler** - Watch for leaks with dual rendering

⸻

## 🚀 Quick Start for Next Session

1. Read this handoff document completely
2. **Pay special attention to the state machine fixes**
3. Review recent changes: `git log --oneline -10`
4. Check both Rive files still work: `npm run dev`
5. Test character switching on both canvases
6. Look for 404s in Network tab for missing cropped assets
7. Start with Task 1: Add remaining cropped character assets

⸻

## 📊 Session Metrics

- Files modified: 9
- Files created: 0
- Components updated: 4 (App, BuddyLoader, BuddyCanvas, useBuddyRive)
- Documentation updated: 3 files
- State machines fixed: 1 (buddy-template-cropped.riv)
- Edge cases discovered: 3
- Performance impact: ~2x memory usage with dual canvas

---

**Ready to continue building!** 🎉

### Key Accomplishments:
- ✅ Dual canvas support with different CDN paths
- ✅ Fixed state machine transition issues
- ✅ Documented common Rive gotchas
- ✅ Maintained clean component architecture

### Critical Reminders:
- State machines must have Exit Time 100% on return transitions
- Only CatdogOrange has cropped assets currently
- Both .riv files now properly configured
- Chrome DevTools MCP requires manual Rive app connection

This handoff was generated automatically. Review and adjust as needed before starting the next session.