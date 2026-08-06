---
name: ""
metadata: 
  node_type: memory
  title: K-3 SHIPPED — gothic ornament algebra + material/skin library + FROZEN K-4 param contract (branch claude/k3-ornament-material off composite-r4 9cf065e0)
  date: 2026-07-21
  tags: 
    - kernel-max-program
    - K-3
    - 3d-building-kernel
    - townMap-arch
    - dormant
    - param-contract-frozen
    - tone-gate
    - not-folded
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T03:02:54.183Z
---

# K-3 ornament + material kernel — SHIPPED (dormant), awaiting Fable validation + fold

Branch **claude/k3-ornament-material** off composite-r4 **9cf065e0** (the post-K-1-fold tip). The
whole surface is `src/domain/townMap/arch/` (extends K-1's frozen 12-op contract; imported by nothing
shipped) + tests + `scripts/generate-k3.mjs` + `public/landing-maps/k3-exhibit/`. **Closure Δ0 vs
1,039,995 (7 chunks) — CONFIRMED**; the kernel stays dark.

## Why it matters
K-3 is the OWNED fidelity heart of the "build it to maximum" 3D building kernel (docs/KERNEL_MAX_PROGRAM.md
K-3 + THE GENRE LIBRARY amendment). It froze the K-4 parameter contract, so K-2 (the ~16-18 institution
kit) can be authored ONCE against a stable surface. All of it is dormant/owned — no shipped path wires it.

## MILESTONE 1 measurement (mandatory before any budget pin — the doc's 550-op figure was extrapolated)
MEASURED on the M1, seedId 'k3' (tris/verts/draws per LOD tier):
- **Rose window** (rulesets/roseWindow.js): glyph 184/388/2, commons 836/1716/15, **signature 2956/5736/29**.
- **Ribbed vault bay** (rulesets/vaultBay.js): glyph 144/240/4, commons 1108/3252/7, **signature 2460/7238/13**.
- (tracery-families sampler sig 4144/8984/36; evil-chapel sig 372/772/37.)
- All watertight (boundaryOdd 0), no NaN, double-build byte-equal at every tier.
RECONCILIATION: the "≈550-op cathedral ≈ 25% of OP_CEILING 2200" is a **2D-PLATE op metric** (raster
command count), the WRONG budget for the 3D mesh path. The binding M1 limits are DRAW CALLS (≤200) and
TRIANGLES (≤150k signature). One rose + one vault = **5,416 tris / 42 draws** ≈ one cathedral bay,
~3.6% of the 150k tri ceiling, ~21% of the 200-draw budget. Confirms the K-1 sheet: the M1 is NOT
triangle-bound at signature scale; the real ceiling is draw calls + authoring effort. Per-(class×LOD)
budget rows pinned at ~1.5× MEASURED in tests/design/archMeshBudget.test.js (verified before legislated).

## What shipped (all under arch/)
- **ornament/construct.js** — the construction algebra (Havemann-Fellner circles+lines+**booleans** =
  sqrt-only intersections; n-foil rings to 16 spokes incl. non-constructible 7/9 via pinned N_GON_DIRS;
  pointedArch/ogeeArch/mouchette/verticalArch3D). **ornament/tracery.js** — the four families (plate,
  geometric, flamboyant, perpendicular) as ONE algebra → sweep op lists.
- **materials/materials.js** — 11 materials × 6 weathering, each a pinned linear-RGB palette + hash-
  procedural texture (generalizes raster.js stoneMod), CPU-baked to byte-deterministic tiling textures;
  ONE NW light (MATERIAL_LIGHT===LIGHT); METALLIC_MATERIALS whitelist. **materials/skins.js** — 6 skins
  as role→(material,weathering) maps (decoupled from shape; the reskin seam).
- **shapeRegistry.js** — archetype-organized shape library (8 functional archetypes + element; gothic
  family populated; holds future genre packs uniformly).
- **params.js** — ⭐ THE FROZEN K-4 PARAMETER CONTRACT (PARAM_CONTRACT_VERSION 1): conditionVector
  field set (1/64 lattice, from existing state per K-4 co-sign), styleTokens, makeGrammarParams surface.
  SECURITY INVARIANT: **corruptionCovert is EXACTLY 0** (map never leaks the dossier) — makeConditionVector
  + assertConditionVector both fail-closed on nonzero covert.
- **kit.js EXTENDED** with abstract statuary (crocket/gargoyle/grotesque/robedFigure/skull) — NEVER a
  named character (product scope). **plate.js EXTENDED** with an optional `opts.roleAlbedo` (defaults to
  ROLE_ALBEDO → K-1 plate goldens byte-identical; a skin passes its own map).
- Rulesets: roseWindow, vaultBay, traceryFamilies, evilChapel (the TONE GATE — grotesque/skull on an
  evil-drift chapel for owner veto BEFORE the vocab freezes). Exhibit plate: `public/landing-maps/k3-exhibit/plate-tone-gate.png`.

## Hazards / judgments (each bit or could bite)
- ⚠️ **Multiple `/** @type {UV} *​/ const a=…; … const b=…` on ONE line → tsc/domain-strict widen the
  2nd+ decl to `number[]`.** One declaration PER LINE. (Bit construct.js + vaultBay.js.)
- ⚠️ **The HARD glyph ceiling (300 tris) rejects curved swept shells** (torus rings, rib arches are
  heavier than box massing). LOD must **gate tessellation per tier** (coarse glyph → fine signature) via
  per-tier assembly symbols, NOT the cathedral's "shell identical, gate ornament only" pattern.
- JUDGMENT: **swept-curve silhouette tolerance** — the K-1 walker's `<1` is a box-shell property; swept
  LOD shifts tube-cap FLOAT extremes ≤3u on a ~200u element (rose Δ1, vault Δ2). The K-3 walk in
  archLodLadder.walker.test.js uses `max(3, 2%·dim)`. Shape agrees; float wobbles. Say "veto" to tighten.
- ⚠️ Web SEVERIES deferred on the vault (documented) — needs a lofted closed-shell terminal beyond the
  K-1 box/spire/prism/sweep/extrudeConvex set; the rib SKELETON is the measured milestone.
- E-A plants added (isolation-proven mutated=red/restored=green): **"kernel/param-contract covert leak"**
  (archParamContract) + **"kernel/statuary named-figure"** (archStatuaryScopeCensus, renamed to enumerate
  via "census"). Manifest entries only allowed for ENUMERATED files (basename token) — material/ornament
  tests are NOT enumerated, covered by double-build + pinned SHA goldens instead.

## Gate receipts (CONFIRMED)
tsc 0 · domain-strict 0 · eslint 0 new · transcendental ratchet 0 new sites · NUL 0 · build OK ·
VERIFY_DIST closure Δ0 (1,039,995) + no arch chunk emitted · full arch spine + 4 new test files (K-3
ornament/material/statuary/param) green · manifest meta-test green · exhibit `--check` deterministic.
Full-suite shard 1/2: 7516 passed, 1 pre-existing red (tests/property/beliefMapGolden.test.js — OUTSIDE
my change scope; belief pipeline byte-identical to base). Shard 2/2 + exact parked-golden count pending.
