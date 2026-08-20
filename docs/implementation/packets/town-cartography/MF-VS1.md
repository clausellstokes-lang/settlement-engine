# Map Foundation / MF-VS1 — first canonical vertical slice

- **Status:** LANDED
- **Landed:** `7c34f50fd99fcf34c478ec56cbae42240bcd7486`
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `4eafca31a295b5288f8c5b0b551e248e386e7791`
- **Last revalidated:** `2026-08-20`
- **Collision group:** `town-map-canonical-foundation`
- **Commit authority:** edits only; no stage, commit, merge, push, or broad cleanup

> Only this READY implementation packet defines coding authority. Design files, queues,
> progress notes, commit subjects, and briefs cannot expand that authority.

## 1. Outcome

Land one deliberately small, headless, end-to-end map path:

1. seal one explicit surface-leaf fabric artifact with one planar block face;
2. run one frontage-first W3 subdivision routine with the four explicit axes
   (`sizeFloorQ`, `gridChaosQ`, `sizeVariationQ`, `emptinessQ`), producing first-class
   frontages, plots, a backland core, and rectilinear fitted footprints;
3. compile one fully supplied building mass with no tier, culture, wealth, probability,
   or historical-evidence default;
4. project it under one fixed-survey light into the existing renderer-neutral draw-op
   vocabulary and serialize the exact same ops through `drawListToSvg`;
5. prove a built-in and custom recipe for the same semantic building produce identical
   geometry and projected semantic ops;
6. persist the custom recipe snapshot, reload after its package is absent, retain the
   building, mark the document read-only, and emit a visible unresolved-content warning;
7. execute one registered `EXPLICIT_FANTASY_CANON` construction operation without an
   evidence gate; and
8. prove PUBLIC filtering, DM inclusion, and byte-identical replay.

The current automatic morphology boundary remains `EUROPEAN_FANTASY_BASE`. Names and
custom content are not rejected by that boundary; this packet makes no authenticity claim
for any other map tradition.

## 2. Hard anti-runaway boundary

This is not the full W3 corpus wave. It may widen only to stop one of these release-blocking
classes: saved-data loss/corruption, a second geometry authority, nondeterministic replay,
PUBLIC/DM leakage, silent canonical fact invention, or a false historical-authority claim.

Explicitly excluded:

- W3 corpus tuning bands, all-leaf plate re-recording, full city subdivision, and visual soak;
- the W2 wall offset cure, concave/self-crossing walls, multiple leaves, portals, strata,
  vegetation, sky land, and terrain excavation;
- inferred roof/material/storey/function frequencies and every AMP/RSLP/HEEP promotion;
- world-time/probe/area lighting, atmosphere, ambient occlusion, glow, and painterly polish;
- UI/store/database cutover, broad migration matrices, PDF-specific styling, and deployment;
- non-European morphology packs and any claim that this European-fantasy routine models them;
- more fantasy operation families, generic plugin systems, or content-marketplace behavior.

Finding an excluded case is recorded for a later packet; it is not permission to solve it.

## 3. Authority and invariants

- The sealed fabric artifact is the sole plan-geometry authority. Frontages and buildings
  carry exact refs/digests back to it; render/export never regenerate geometry.
- W3 uses one subdivision routine. The four morphology axes are explicit inputs. Tier,
  culture, wealth, lawfulness, and evidence records are not accepted inputs.
- Every geometry-bearing building field is mandatory. Missing geometry rejects compilation;
  it is never defaulted.
- Origin and recipe binding are orthogonal. The geometry compiler consumes the normalized
  recipe snapshot and explicit mass specification, never the origin class.
- A custom package snapshot participates in hashes and persists with the document. Package
  absence is load-relative status, not a mutation of canonical geometry.
- PUBLIC projection filters semantic primitives before draw/export. A hidden identifier or
  unresolved warning for a hidden subject cannot reach PUBLIC bytes.
- The fantasy construction gate is `EXPLICIT_FANTASY_CANON`, never an evidence-domain gate.
  Historical evidence is relevant only to later prevalence/authenticity claims.

## 4. Change manifest and budget

Production files are limited to six logic leaves plus one barrel; each new logic leaf stays
under 260 effective lines. Tests are limited to the seven owner-facing acceptance families,
plus the two exact existing governance records those new files necessarily move.

| Action | Path |
|---|---|
| CREATE | `src/domain/townMap/fabric/foundation.js` |
| CREATE | `src/domain/townMap/fabric/frontage.js` |
| CREATE | `src/domain/townMap/fabric/building.js` |
| CREATE | `src/domain/townMap/fabric/content.js` |
| CREATE | `src/domain/townMap/fabric/projection.js` |
| CREATE | `src/domain/townMap/fabric/operations.js` |
| CREATE | `src/domain/townMap/fabric/index.js` |
| MODIFY | `src/domain/townMap/index.js` |
| CREATE | `tests/fixtures/townMapFirstSliceFixtures.js` |
| CREATE | `tests/domain/townMapFabricFoundation.test.js` |
| CREATE | `tests/domain/townMapFrontageW3.test.js` |
| CREATE | `tests/domain/townMapExplicitBuilding.test.js` |
| CREATE | `tests/domain/townMapCustomParity.test.js` |
| CREATE | `tests/domain/townMapFantasyConstruction.test.js` |
| CREATE | `tests/property/townMapFirstSliceDeterminism.test.js` |
| MODIFY | `scripts/mutation-coverage-manifest.json` |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` |

No other production, test, fixture, baseline, golden, or generated file is in scope. The two
governance edits above add no allowance: one records the direct parity controls and one banks
the exact six-file/17-title/six-suite census movement.

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
test "$(git rev-parse HEAD)" = 4eafca31a295b5288f8c5b0b551e248e386e7791
test ! -e src/domain/townMap/fabric/foundation.js
test ! -e tests/domain/townMapFabricFoundation.test.js
rg -n 'export function stableSceneStringify|export function sceneDigest' \
  src/domain/townScene/stableScene.js
rg -n 'export function drawListToSvg' src/domain/townMap/townMapDraw.js
rg -n 'export function projectSettlementForTownMapAudience' \
  src/domain/townMap/audienceProjection.js
npm run validate:packets
```

Any changed target, missing anchor, or wrong base makes the packet STALE. Foreign work is
left untouched.

## 6. Acceptance cases

1. **Sealed foundation:** one explicit leaf-0 block and street edge validate, deep-freeze,
   hash deterministically, and reject malformed/non-rectilinear or implicit geometry.
2. **Frontage/W3:** one routine emits frontage → plot → rectilinear footprint lineage; each
   of the four explicit axes changes its named metric; changing unrelated culture/tier data
   is impossible because those fields are outside the input contract.
3. **Explicit mass + fixed light:** complete geometry compiles; a missing roof/height/material
   fails closed; screen and SVG consume one identical ordered draw-op list.
4. **Built-in/custom parity:** equal semantic specification and recipe semantics produce
   byte-identical geometry and projected primitives while origin/registry identity remains
   separately hash-bound.
5. **Missing custom package:** save → package removal → reload preserves the building and
   geometry, returns a nonempty unresolved report, becomes read-only, and adds a visible
   warning without deleting or substituting content.
6. **Fantasy operation:** one registered construction operation replays from exact before
   hash + explicit payload, produces the same after bytes/receipt, and imports no historical
   evidence or probability authority.
7. **Privacy + determinism:** PUBLIC bytes contain no DM-only identifiers, geometry, warning,
   or package data; DM contains the authorized primitive; repeated compile/save/load/project/
   export produces byte-identical hashes, ops, and SVG.

## 7. Checks

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapFabricFoundation.test.js \
  tests/domain/townMapFrontageW3.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js \
  tests/domain/townMapFantasyConstruction.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npx eslint \
  src/domain/townMap/fabric/ \
  tests/fixtures/townMapFirstSliceFixtures.js \
  tests/domain/townMapFabricFoundation.test.js \
  tests/domain/townMapFrontageW3.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js \
  tests/domain/townMapFantasyConstruction.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npm run typecheck:domain:strict
npm run validate:packets
npx vitest run \
  tests/architecture/engineWorkerDomFree.test.js \
  tests/lint/domainAnyCastBaseline.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
```

Run the full `npm run check` only after these bounded checks pass. A foreign red is reported,
not repaired under this packet.
