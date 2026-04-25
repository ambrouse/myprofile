# Perf Report - Rebuild v2 (Phase F)

## New in v2
- Added SSAO-enabled post-processing path for high/ultra quality.
- Added modular scene material system (`scene/materials/palette.js`).
- Added modular lighting setup (`scene/lighting/setup.js`).
- Added volumetric-style core light cone animation (fake god-ray cone).
- Kept adaptive quality monitor with auto up/down strategy.

## Quality Behavior
- `ultra/high`: EffectComposer + Bloom + SSAO active.
- `medium`: Bloom active, SSAO disabled for stability.
- `low`: Composer disabled (direct render path).

## Stability Notes
- Visibility pause remains active.
- Shadow map size scales by quality tier.
- Pixel ratio is clamped by quality profile.

## Pending (optional v3)
- Move repeated geometry to InstancedMesh where possible.
- Add asset compression pipeline (KTX2 + DRACO) once GLB assets are introduced.
- Add optional LUT color grading pass for art-driven final polish.
