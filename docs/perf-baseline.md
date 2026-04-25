# Performance Baseline (Phase 0)

## Scope
- Project: `myprofile`
- Date: 2026-04-25
- Environment: Browser static runtime (desktop-first)

## Current Architecture Snapshot
- Slide deck UI rendering via DOM + CSS 3D transforms.
- Background VFX via Canvas 2D particle graph.
- Additional interaction VFX on cards and orb parallax.

## High-Risk Hotspots Found
1. `script.js`: particle connection loop is `O(n^2)` each frame.
2. Multiple realtime listeners and loops compete on main thread.
3. Slide transition debounce gate set high (520ms) causing interaction delay.
4. Heavy visual filters in CSS (`blur`, `backdrop-filter`, `mask-image`) increase GPU cost.
5. Hero/section images are large PNG assets (~1.9MB - 2.2MB each).

## Immediate Budgets (Target)
- Frame time:
  - <= 16.7ms for 60Hz displays.
  - <= 8.3ms for 120Hz displays when feasible.
- Input to first visual response: <= 1 frame.
- Long tasks: avoid > 50ms during normal interaction.

## Phase 0 Actions Completed
- Documented baseline architecture and known hotspots.
- Defined performance budget and immediate optimization priorities.

## Next Measurement Tasks
- Capture Chrome Performance traces for:
  - Initial load
  - Slide transition spam (keyboard + button)
  - Pointer stress movement
- Track metrics:
  - FPS stability
  - Scripting time per frame
  - Rendering/compositing cost
  - Long task frequency
