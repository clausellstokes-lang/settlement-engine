---
name: ""
metadata:
  node_type: memory
  title: K-4 the drift binding shipped — conditionParams.js the single geometry writer + the general striping cure
  type: project
  date: 2026-07-22
  tags:
    - kernel-max
    - k4
    - arch
    - drift
    - conditionParams
    - single-writer
    - striping
    - dormant
    - ARCH_GEOMETRY_VERSION-3
  branch: claude/k4-geometry-writer
  base: 42559cce (composite-r4 tip when branched; composite-r4 has since advanced to 8927e087+)
  commits: "6841dcd7 (striping cure) + 3e6dfc9e (K-4 drift binding)"
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T11:29:26.487Z
---

# K-4 — THE DRIFT BINDING (the single writer of drift into geometry) + the general striping cure

Branch `claude/k4-geometry-writer` off composite-r4 **42559cce**. Two commits, both DORMANT (imported by
nothing shipped — closure Δ0 CONFIRMED at **1,039,961 bytes = base**, arch sentinel absent from every dist
chunk). ARCH_GEOMETRY_VERSION **2 → 3** (declared same-seed shift).

## Commit 1 (6841dcd7) — THE GENERAL STRIPING CURE (kit.js seatedSpire)
The K-2 tone-gate striping was a GENERAL coincident-coplanar-face z-fight: `addSpire` emits a base QUAD
(−y) that, when a spire's `baseY == the box top it sits on`, is coplanar+coincident with that box's top
quad (+y) at equal depth → the shared raster's z-buffer flip-flops scanline-by-scanline (the "cap-diamond").
K-2 cured only the evil-chapel spire (evilChapel.js SPIRE_EMBED). This generalized it kit-wide via
`kit.js` `SPIRE_EMBED_FRAC=1/8` + `seatedSpire()` — every stacked spire cap (crocket / grotesque / skull +
the cathedral **pinnacle** kit asset, whose lower spire base was coincident with the PIER TOP) now seats
its base 1/8 of its own height BELOW the host top plane. **Mechanism chosen = geometry embeds (option a),
NOT the plate.js depth tie-break (option b)** — the tie-break re-pins ALL plate goldens and risks other
coincident-face artifacts; the embed is surgical and continuous with the proven chapel fix.
- **Re-pinned goldens (archMeshDeterminism.test.js, cause named):** cathedral GLB tiers **1 + 2** (carry
  the pinnacle), cathedral plate goldens **axonNW + southElev**, evil-chapel **chapel2**. **Byte-IDENTICAL
  (verified):** cathedral GLB tier 0 (glyph, no statuary), buttress, rose, vault, tracery, and plate
  **westFront** (a west elevation sees the horizontal cap faces EDGE-ON → the embed changes no pixel).
- ⚠️ robedFigure (a box on a spire APEX = a POINT contact, not a coplanar face), gargoyle (side snout),
  finial (a lone spire) have NO coincident face — LEFT UNCHANGED, visually confirmed clean in the tone
  plates (the brief enumerated robedFigure but the geometry has no defect there). Documented divergence.
- ⚠️ buttressFragment.js + cathedralSection.js share the SAME class at their cap-on-pier, but the buttress
  is a BYTE-PARITY FIXTURE and both are outside the brief's enumerated scope (kit statuary + cathedral
  pinnacles) — DEFERRED (curing them means re-deriving the byte-parity direct build in lockstep).
- Regenerated k2-exhibit + k3-exhibit (both `--check` deterministic); tone plates visually confirm the
  cap-diamonds are GONE (recessed clean caps).

## Commit 2 (3e6dfc9e) — K-4 conditionParams.js (THE SINGLE WRITER) + archetypeMassing.js
- **conditionParams.js `writeDriftedMesh(baseRuleset, {seedId,anchorKey,archetype,conditionVector?,tier})`**
  is the ONE place a conditionVector becomes triangles: interpret base → append DRIFT terminals → emitMesh
  → fail-closed vs HARD_TIER_CEILINGS. K-2's dress is ALBEDO-only; K-4 writes the GEOMETRY. Three drift
  classes (each a TerminalRec[] built from box/spire + the K-3 kit): STATUARY (instanced kit assets on a
  frieze band), DAMAGE (ruin solids — a shored strut, rubble, a patch), RELIEF (the recorded history mark
  as a block course, "never text").
- **archetypeMassing.js** — a parameterized massing FLOOR, one host per SHAPE_FAMILY (only `sacred` had a
  full grammar; the other 7 archetypes were registered-but-unbuilt in shapeRegistry). Body box + a
  functional cap (spire/dome/crenellations/stack/gable/prism). The cathedral stays the sacred SIGNATURE.

## ⭐ THE LOAD-BEARING DESIGN DECISIONS (each defensible, each recorded)
- **DORMANCY = DEVIATION-FROM-NEUTRAL.** The frozen contract (params.js:87) says "a grammar with the
  neutral vector == a grammar with no vector". But `neutralConditionVector()` puts scalars at BAND CENTER
  (0.5), which is MID-drift, not pristine — so absolute drift would break dormancy. Cure: drift is a
  deviation from the neutral dress. Statuary only for a beneficent/macabre LEAN (neutral 'neutral' → none);
  damage only ABOVE the neutral damage index (`Math.max(0, idx(actual)-idx(neutral))`); relief only for
  `cv.historyMark>0` (neutral index 0). ⇒ neutral cv AND absent cv both add ZERO drift → byte-identical.
- ⚠️ **CONSEQUENCE: war-damage geometry is usually delta ≤ 1** (one strut). The neutral band-center warScar
  (0.5) already maps to 'broken'(idx 2) for most archetypes, and DAMAGE_STATES tops at 'patched'(3) — so
  the deviation maxes at 1 for gain≈1.0 (martial) and is 0 for the cathedral (sacred gain 0.8 caps at
  'broken'). The cathedral expresses war via the RELIEF BAND + albedo, not struts; the martial keep shows
  the strut. This is a frozen-neutral consequence, not a bug.
- **SALIENCY BUDGET = fraction of base TRIANGLES** (25/15/0% signature/commons/glyph), not terminals — a
  terminal budget rounds to 0 for low-poly massing. Priority-truncated (damage > relief > statuary; strict
  break). ⇒ geometry drift CONCENTRATES AT SIGNATURE (the cathedral, ~543-tri budget). Small massing hosts
  (40–72 tris, budget 10–18) carry at most a token; their condition reads through the K-2 ALBEDO dress.
  This IS the LOD design (signature = full detail; commons = massing).
- ⚠️ **DRIFT MUST STAY WITHIN THE BASE AABB** or the LOD silhouette law breaks (glyph has no drift, so
  glyph and signature would have different footprints). All drift is clamped flush-INSIDE the envelope
  (statuary/relief/patch set z ≤ front; struts x ≥ min). Verified: drifted AABB == base AABB every tier.
- **COVERT SECURITY is structural + trivial:** K-4 geometry reads alignment/moral/warScar/historyMark/
  emblem ONLY — corruption (covert=0 by contract; revealed) dresses ALBEDO in K-2, never geometry. So the
  drifted GEOMETRY is byte-invariant to corruptionRevealed (pinned) and never reads corruptionCovert.

## Tests + the E-A plant
- `tests/architecture/archDriftBinding.test.js` (37 tests, NOT enumerated — no NAME_PATTERN token, like
  archMeshDeterminism): dormancy (absent+neutral==base), determinism, ~15 SHA GLB goldens (single-axis +
  portraits × kinds + LOD ladder), saliency budget, covert invariance, watertight.
- `tests/lint/archDriftTotality.walker.test.js` (28 tests, E-K, ENUMERATED enforcer): host totality (every
  SHAPE_FAMILY builds 3 tiers), drift totality (drifts every archetype×tier×portrait, watertight,
  AABB-preserving, within ceiling), dormancy totality, SINGLE-WRITER source scan (conditionParams is the
  ONLY arch file importing a drift-selection layer AND emitter/kit), COVERT source scan.
- ⚠️ **The enumerated walker NEEDS a mutation-coverage-manifest.json entry** (else mutationCoverageManifest
  meta-test reds). Added `{"kind":"mutation","label":"kernel/drift covert leak"}` + the plant #33 in
  mutation-sweep.sh (`perl s/Math.round(cv.historyMark)/Math.round(cv.corruptionCovert)/` → the covert
  scan reds). Isolation-proven mutate=red / restore=green (28/28).

## Gate receipts (CONFIRMED)
Full arch spine + K-4 (424 tests, 23 files) green incl. every re-pinned golden; tsc 0; domain-strict 0
(bare); eslint 0; transcendental 0 new; domain-any unchanged **2246** (new files any-free — concrete
JSDoc); NUL 0; build + VERIFY_DIST 227/227 + entry closure **1,039,961 = base, Δ0**; k4-exhibit
`--check` deterministic. Two-shard suite (`--shard --no-file-parallelism`): shard1 7647 pass, shard2 8787
pass. **Reds = the 4 parked golden families** (beliefMapGolden, goldenViewModel, generatorGoldenMaster,
worldpulseDeityGolden) **+ ⚠️ aiGroundingBundle.freshness — PROVEN pre-existing at base 42559cce** (its 49
meta.inputs hash mismatched at the base; none of my files are in that set; the manager's I-M composite
folds regenerated aiGrounding deps without `npm run build:edge-shared`). The edge bundle is OUTSIDE this
wave's fences — owner/manager fix (a deploy-adjacent regen), NOT a K-4 regression.

FORBIDDEN honored: no stash/add-all/push/merge/deploy; params.js NEVER widened; kernel wired into nothing
shipped; explicit staging; foreign stash@{0} untouched; other worktrees/main tree untouched. A temp
worktree at 42559cce was used to prove the freshness red (pruned after).
