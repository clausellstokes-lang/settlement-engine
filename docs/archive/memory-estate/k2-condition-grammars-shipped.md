---
name: ""
metadata: 
  node_type: memory
  title: K-2 condition-grammar drift layer shipped
  type: project
  date: 2026-07-22
  tags: 
    - kernel-max
    - k2
    - arch
    - drift
    - conditionVector
    - tone-gate
    - striping
    - parity
    - dormant
  branch: claude/k2-condition-grammars
  base: bfb22b34 (K-3 fold; composite-r4 tip was ledger-only 14d3272b on top)
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T04:55:58.262Z
---

# K-2 — THE CONDITION-MAPPING LAYER (drift rules + coherence law)

Built on branch `claude/k2-condition-grammars` off the K-3 fold `bfb22b34`. Consumes the FROZEN K-4
contract (`arch/params.js`, PARAM_CONTRACT_VERSION 1); NEVER widens it. Kernel stays DORMANT (imported
by nothing shipped) — closure Δ0 CONFIRMED (archKernelLazy VERIFY_DIST green after full `npm run build`).

## What was built (all in src/domain/townMap/arch/)
- **conditionGrammar.js** — pure `conditionVector -> typed token` drift rules + named threshold constants.
  Vocabularies (finite): DAMAGE_STATES(sound/shored/broken/patched), MATERIAL_TIERS(timber/stone/marble),
  STATUARY_MODES(beneficent/neutral/macabre/none) + STATUARY_VOCAB (only names REAL kit assets),
  CIVIC_DRESS, ORNAMENT_ORDER. Rules: prosperity→ornamentDensity+traceryFamily+materialTier;
  warScar→REVEALED damage; corruptionRevealed→decay weathering; patronAlignGood+moral→statuary;
  patronAlignLaw→order; legitimacy→civic dress; terrain→material bias; historyMark+patronEmblem→relief motif.
- **settlementDress.js** — THE COHERENCE LAW: `resolveSettlementDress(seedId,anchorKey,cv)` = one shared
  dress; `driftBuildingDress(dress,archetype,localCv)` specializes per archetype+local condition (tracery/
  order/relief INHERITED = the coherence spine; ornament/weathering/damage/statuary vary); `dressRoleAlbedo`
  lowers a dress into a role→albedo map so the plate renders drift via the reskin seam (no geometry touch).
  ARCHETYPE_PROFILES covers the 8 SHAPE_FAMILIES (deposit-and-consume totality). Variant = FNV-1a(seed:anchor).
- **scripts/generate-k2.mjs** + `public/landing-maps/k2-exhibit/` — 4 dressed cathedral plates
  (prosperous-good/war-scarred/corrupt-decayed/evil-drift), the LEGIBLE TONE GATE close-ups
  (tone-macabre/beneficent/neutral.png + GLBs), the fixed chapel, a WebGL viewer, `--check` determinism.
- **tests/architecture/archConditionGrammar.test.js** — 28 tests: finite-semantics, drift-table totality
  (E-A), coherence law (E-A), covert-zero security (E-A), 2D parity. All 3 E-A plants isolation-proven red→green.

## ⚠️ THE STRIPING IS STRUCTURAL (partially fixed) — READ BEFORE re-touching the raster
The K-3 tone-gate "roof-underside striping" is a GENERAL coincident-face z-fight class in the SHARED
raster (plate.js): two abutting closed primitives that share a coplanar face at equal depth flip-flop in
the z-buffer scanline-by-scanline (diagnostic: 58,795 roofLead↔ashlar subpixels on the chapel). It has
MULTIPLE loci: (1) chapel spire base coincident with tower top — FIXED (evilChapel.js SPIRE_EMBED=10,
embed the spire below the tower top; residual ~1,300 invisible subpixels); (2) EVERY kit asset that stacks
a `spire` on a box top (grotesque/skull/robedFigure/crocket) — NOT fixed, visible as small cap-diamonds in
tone-macabre/beneficent.png; (3) cathedral pinnacle spire-on-spire joints (baked into the K-1 cathedral
plate goldens already). The contained chapel fix re-pinned ONLY K3_GLB_GOLDEN.chapel2 + bumped
ARCH_GEOMETRY_VERSION 1→2 (declared; the version is NOT embedded in GLB bytes, so every other golden stayed
byte-identical — cathedral/buttress/rose/vault/tracery GLBs + all 3 cathedral PLATE goldens unchanged).
**The general cure (owner/manager-gated, NOT done — it re-pins the K-1 flagship cathedral goldens):**
either (a) embed spire bases into their host boxes in kit.js (re-pins cathedral GLB tiers 1/2 + all 3
cathedral plate goldens + chapel2), or (b) a deterministic depth tie-break/bias in plate.js (re-pins ALL
arch plate goldens). Both are declared same-seed shifts. Reported as structural per the brief.

## ⚠️ Hazards / facts for the next agent
- **ARCH_GEOMETRY_VERSION is now 2** (grammarIR.js). K3_GLB_GOLDEN.chapel2 = c3063e77…41b4 (new).
  archMeshDeterminism.test.js GOLDEN.geometryVersion=2. Any further arch geometry shift bumps to 3.
- **2D PARITY**: only ONE clean exported single-purpose constant was importable — MORAL_DARK_THRESHOLD is
  IMPORTED from `spatial/moralDrift.js` MORAL_DRIFT_TUNING.RECKONING_THRESHOLD (=0.3, pure-leaf, zero
  imports → dormancy-safe). Everything else in the 2D layer is inline/unexported/categorical (recon-proven:
  the townMap map-dress layer visually consumes ONLY season/severity/besieged/scarLevel). So the other band
  edges are PINNED-with-citation: PROSPERITY_CUTS[.30,.50,.75]→causalBand(causalState.js:369);
  WAR_SCAR_CUTS[.20,.45,.60]→warExhaustionBand(warStatus.js:350); LEGITIMACY_CUTS→rebandLegitimacy
  (rulingPower.js:225, 3× duplicated, no export); the NW light = LIGHT_MODEL≈SHADOW_DIR (screen-angle matched).
- **arch/ view-wall scan** allows imports that `startsWith('.')` — `../../spatial/moralDrift.js` passes.
  Keep arch/ files trig-free (Math.round/min/max/floor/imul only); transcendental ratchet holds them at 0.
- **domain-any budget** untouched (domain-strict 0 errors, ceiling 0) — concrete JSDoc types, no `any` added.
- The tone-gate FORMS are abstract-blocky by product scope (never a face/named figure), so macabre vs
  beneficent reads by ARRANGEMENT, not portraiture — subtle but judgeable. Owner veto still pending.
- Drift is SELECTION only (typed tokens); K-4 remains the single writer of drift INTO geometry. The 4
  cathedral scenes differ by DRESS (material/weathering via dressRoleAlbedo), not geometry — geometry invariant.

## Gate receipts (CONFIRMED)
Full arch spine 328/328; K-2 suite 28/28 (+3 E-A plants red→green); archMeshDeterminism 17/17 (chapel2
re-pin); tsc 0; domain-strict 0/ceiling 0; eslint 0; NUL 0; vite full build (sitemap+vite+prerender) +
VERIFY_DIST tests/build 225/225 (closure Δ0). Two full-suite shards: shard1 7531 pass, shard2 pass — the
ONLY real reds are the 4 parked golden families (beliefMapGolden, goldenViewModel, generatorGoldenMaster,
worldpulseDeityGolden), tolerated. ⚠️ A PARALLEL money-wave session (41 vitest procs) was running
concurrently and induced widespread timing flakes (advancePauseResume, ordering, aiSurfaceSourceScan,
militaryStrength, libraryLivingSurface) — ALL proven GREEN in clean single-thread isolation once the
parallel load cleared (18/18 + 46/46). Lesson: never trust a full-suite red list while another session's
vitest is running; isolate on a quiet machine. Committed: 0c670a64 (striping fix) + d9eb0e0d (K-2 layer) on
claude/k2-condition-grammars off bfb22b34. FORBIDDEN honored: no stash, no add -A, no push/merge/deploy,
foreign stash@{0} untouched, other worktrees/main tree untouched.
