---
name: ""
metadata:
  node_type: memory
  title: "K-5 SHIPPED — the adaptive fidelity governor (view-only) + K-0..K-5 kernel build CLOSED"
  date: 2026-07-22
  tags:
    - kernel-max-program
    - K-5
    - adaptive-governor
    - view-only
    - arch-kernel
    - closure-delta-0
    - program-complete
    - not-folded
  branch: claude/k5-adaptive-governor
  tip: 1bd51fd7
  base: 07c0b586
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T12:10:59.601Z
---

# K-5 SHIPPED — the adaptive fidelity governor @ claude/k5-adaptive-governor 1bd51fd7 (base composite-r4 07c0b586, NOT folded)

**What:** THE ADAPTIVE FIDELITY GOVERNOR (docs/KERNEL_MAX_PROGRAM.md) — the runtime quality controller over the LIVE VIEW ONLY, per the owner order "have a performance fall-back … drop in fidelity continuously and incrementally to a floor of what is usable." ONE commit; 11 files; +1158/−66. Closes the kernel build program **K-0..K-5**.

## The build (as shipped vs the doc)
- **`scripts/lib/adaptiveGovernor.mjs`** — NEW pure sense→decide module (NOT `src/`, so closure Δ0 + no domain-strict ratchet + outside the transcendental TREES). `export`s stripped and inlined VERBATIM into the self-contained file:// viewers (ONE source of truth: the same logic the test pins runs in the browser).
- **The ladder (doc order, best-value-retained-first, continuous):** `ladderFor(q)` → (1) resScale 1.0→0.6 · (2) contact-AO/shadow rung · (3) GLOBAL lodBias 0→2 (the biggest lever) · (4) crease ink pass · (5) instance cullScale · (6) massingOnly = THE FLOOR. Plus the 2D bird's-eye escape hatch when even the floor drowns.
- **NAMED TUNING (owner-vetoable, a constants flip not a rebuild)** — GOVERNOR_TUNING: FRAME_BUDGET 16.7ms · HIGH/LOW watermarks **20/14 ms** (dead-band between = hysteresis) · EMA_ALPHA 0.1 · **DEGRADE_AFTER 6 frames (N) vs RECOVER_AFTER 45 frames (M), M>N** = degrade-fast/recover-slow · steps **0.08 down / 0.04 up** (asymmetric, anti-pop) · **QUALITY_FLOOR 0.30** (matches the K-1 slider min; the massing-only floor) · bird's-eye trip 40ms/90-frames, clear 22ms. Override ceilings auto/high=1.0, medium=0.7, low=0.45 (the dial is a CEILING; governor still degrades below it).

## The FOUR HARD LAWS — all proven
1. **VIEW-ONLY** — extended `archViewWall.test.js` with the byte-independence pin: `buildArchMesh` + GLB bytes are BYTE-IDENTICAL across a real governor-swept qualityLevel range (floor..full). The governor decides how much the GPU DRAWS, never what the kernel BUILDS.
2. **CANONICAL determinism** — the plate/GLB/goldens ignore the governor (it takes no qualityLevel input anywhere); k0Determinism/archMeshDeterminism/k0bMesh unchanged + green (36).
3. **No Date.now in the substrate** — the governor's core touches no clock/DOM/model state (the viewer injects the rAF delta); pinned in the view-wall module test.
4. **Hysteresis + rate limits** — `adaptiveGovernor.test.js` (21) pins: monotone degrade under sustained overload, floor never crossed, recovery with no ping-pong on boundary/dead-band sequences, override wins, bird's-eye trip+clear, determinism, + the **E-A floor plant (isolation-proven** — a mutant without the floor clamp crosses the floor on the same sequence the real step holds).

## Wiring + CONFIRMED end-to-end
Wired into the **K-1 and K-4** exhibit viewers: an unobtrusive quality indicator (bar + `qtext` readout) + a keyboard-operable auto/high/medium/low override dial (E-I discipline: focusable, arrows/1-4, aria-live, aria-pressed) + a "simulate GPU load" slider so degradation is visible on any GPU. **Browser smoke test (WebGL2, no console errors):** both exhibits — synthetic overload drove quality continuously to `30% · massing floor · res 60% · LOD-2` (ink dropped), headroom recovered to `100% · adaptive 3D`, a `low` cap held at 0.45. K-1's live rAF loop had already self-degraded to 68% on the virtualized GPU — a live demonstration.

## ⚠ HAZARD — the K-1 exhibit was PRE-EXISTING STALE (declared, fixed in this commit)
The committed K-1 exhibit geometry/plate artifacts (`cathedral-t1/t2.glb`, `plate-axonNW/southElev.png`) were last generated at **57c97d2d (the K-1 checkpoint)** and NEVER regenerated through the K-2/K-3/K-4 arch shifts (0c670a64 + 6841dcd7 = "declared geometry shift"). So a plain `generate-k1.mjs` REFRESHES them — this is NOT a governor effect (the governor is byte-independent; the diff touched zero geometry code). Asymmetry (t0/westFront byte-identical, t1/t2/axonNW/southElev changed) = the targeted spire-cap/roof-underside fixes. **LESSON: any future arch geometry fold must also re-run `generate-k1.mjs` (and k0/k0b/k2/k3) or the older exhibits silently rot; only K-4 was current because it was generated at the current fold.** `--check` is NOT in the test suite, so nothing reds on staleness — run it manually at fold. K-4's geometry was current; only its index.html changed (pure view).

## Gate (all bare exit-0, quoted)
full arch spine + K-5 = **435 pass / 1 skip** (22 files) · tsc 0 · domain-strict 0 (ceiling 0) · eslint 0 · transcendental 0 new · controlBytes/NUL green · build OK · **verify:dist 227 pass; first-paint static closure = 1,039,961 bytes, Δ0** (arch-kernel chunk not even emitted — dormant). 4 parked golden families untouched.

## Program accounting — KERNEL BUILD K-0..K-5 COMPLETE
K-0 spike → K-1 grammar+viewer(qualityLevel hook) → K-3 ornament/materials + frozen params.js → K-2 kit → K-4 drift binding (conditionParams single writer) → **K-5 the governor + view wiring**. All dormant (imported by nothing shipped; closure Δ0). NOT folded — awaits manager validate+fold onto composite-r4. Town-scale five-views (buildTownScene3D/kernelLod/archDrawBridge) from KERNEL_MAX_PROGRAM §K-5 remain unbuilt (out of this brief's fence = arch/ + tests + k-exhibit viewers + generate-k*.mjs); the governor's `birdsEye` 2D-fallback signal is implemented + tested and surfaces in the indicator, ready to drive the 2D bird's-eye swap when town-scale views land.
