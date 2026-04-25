# Release Notes - Rebuild 3D Game Scene v2

## Visual & Scene
- Environment now uses modular world/material/lighting architecture.
- Scene includes structured world-space geometry and animated zone markers.
- Added HUD zone context + cinematic intro handoff to interactive mode.

## Rendering
- Added post-processing pipeline with Bloom + SSAO tiering.
- Added fake volumetric cone around AI core for stronger depth mood.

## Architecture
- New modules:
  - `scene/materials/palette.js`
  - `scene/lighting/setup.js`
  - `scene/render/pipeline.js` (upgraded)

## Performance
- Adaptive quality remains active for `auto` mode.
- `ultra/high/medium/low` tiers are now aligned with render feature toggles.

## Compatibility
- Works with static hosting (GitHub Pages).
- Keeps existing deck, i18n, and content flow intact.
