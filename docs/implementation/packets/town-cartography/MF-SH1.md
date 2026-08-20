# Map Shape Kernel / MF-SH1 — bounded nonrectangular mass

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `codex/first-map-vertical-slice` at `7c34f50fd99fcf34c478ec56cbae42240bcd7486`
- **Last revalidated:** `2026-08-20`
- **Collision group:** `town-map-canonical-shape-kernel`
- **Commit authority:** edits only; no stage, commit, merge, push, or broad cleanup

> Only this READY implementation packet defines coding authority. The owner has selected the
> bounded nonrectangular correction; it does not reopen the broader architecture backlog.

## 1. Outcome

Extend the landed MF-VS1 path with one explicit semantic shape grammar that can compile:

1. the existing rectilinear primary mass as an attached range;
2. one `CIRCULAR` + `CYLINDER` shaft with a `CONICAL` cap; or
3. one `REGULAR_POLYGONAL` + `EXTRUDED_POLYGON` shaft with a `PYRAMIDAL` cap.

The semantic declaration survives beside the deterministic quantized closed shell. The fixed
survey projection derives the new building's shadow from its shell vertices in light space and
feeds the same ordered draw ops to screen and SVG export. Built-in and custom recipes consume
the same compiler and produce byte-identical geometry for the same semantic specification.

The map-tradition boundary remains `EUROPEAN_FANTASY_BASE`. A registered recipe may associate an
institution semantic type with this explicit shape, but no institution, culture, tier, wealth,
or historical-evidence record chooses a shape automatically.

## 2. Hard anti-runaway boundary

This packet proves one radial/polygonal tower attached to one existing rectangle. It may widen
only to prevent corrupt shell bytes, nondeterminism, PUBLIC/DM leakage, duplicate geometry
authority, origin-dependent geometry, or renderer-authored shape.

Explicitly excluded:

- domes, onion domes, apses, spires, frusta, elliptical plans, D-shaped plans, irregular hulls,
  curved walls, arbitrary compound graphs, boolean union, concavity, holes, and self-intersection;
- more than one shaft/cap pair, detached parts, bridges, wall towers, floating structures, and
  any general support-surface or multi-leaf expansion;
- world-time, point/area/local magical lights, softness, ambient terms, glow, atmosphere, and
  any painterly or UI work;
- automatic institution-to-form mapping, historical prevalence, cultural-authenticity claims,
  AMP/RSLP/HEEP activation, probability selection, or non-European morphology packs;
- full W3 corpus tuning, W2 offset work, database/store migration, editor commands, export
  families beyond the existing shared SVG serializer, and architecture-corpus cleanup.

Finding an excluded case records a later backlog item. It is not permission to implement it.

## 3. Authority and invariants

- The closed vocabulary is exactly `RECTILINEAR | CIRCULAR | REGULAR_POLYGONAL` for plan semantics,
  `EXTRUDED_POLYGON | CYLINDER` for the supported vertical solids, and
  `FLAT | GABLE | CONICAL | PYRAMIDAL` for this tranche's roof semantics.
- `CIRCULAR` is retained as semantic truth and compiles through one frozen 16-segment integer LUT;
  `REGULAR_POLYGONAL` accepts only 4, 6, or 8 sides. No floating-point trigonometry enters canon.
- Only the legal pairs above compile. Every centre, radius, elevation, material, part identity,
  side count, and apex is explicit and integer-quantized; missing or incompatible input refuses.
- The new shaft and cap each own a closed patch shell. Their base/eave rings are byte-equal, all
  part patch IDs are unique, and every undirected part-shell edge occurs exactly twice.
- The existing W3 fitted rectangle remains the plot authority and attached primary range. The
  added ring must lie inside it; no part may discover geometry from an institution or renderer.
- New-shape shadows use one deterministic convex light-space silhouette over actual canonical
  shell vertices under `FIXED_SURVEY_LIGHT_V1`. The old rectilinear law remains byte-stable.
- Projection creates plan primitives from stored canonical part rings. Screen and SVG serialize
  exactly the same draw-op list; neither may reconstruct plan, roof, or shadow geometry.
- Origin is not a geometry input. Built-in and custom recipe identity remains separately hashed.

## 4. Change manifest and budget

One new logic leaf owns the vocabulary and compiler. Existing leaves receive only the integration
needed to authorize its law and consume its canonical surfaces/silhouette. Each changed logic leaf
must remain below 300 effective lines; the new test stays below 280.

| Action | Path |
|---|---|
| CREATE | `src/domain/townMap/fabric/shapes.js` |
| MODIFY | `src/domain/townMap/fabric/building.js` |
| MODIFY | `src/domain/townMap/fabric/projection.js` |
| MODIFY | `src/domain/townMap/fabric/index.js` |
| CREATE | `tests/domain/townMapShapeKernel.test.js` |
| MODIFY | `scripts/mutation-coverage-manifest.json` |
| MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` |

No other production, test, fixture, baseline, golden, generated, corpus, or UI file is in scope.
The two governance edits add no allowance: they record the new direct controls and exact test
census movement.

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
test "$(git rev-parse HEAD)" = 7c34f50fd99fcf34c478ec56cbae42240bcd7486
test ! -e src/domain/townMap/fabric/shapes.js
test ! -e tests/domain/townMapShapeKernel.test.js
rg -n 'export function compileOriginNeutralBuildingGeometry|export function bindBuildingOrigin' \
  src/domain/townMap/fabric/building.js
rg -n 'export function projectFirstSliceFixedSurvey' src/domain/townMap/fabric/projection.js
rg -n 'export function drawListToSvg' src/domain/townMap/townMapDraw.js
npm run validate:packets
```

Any changed target, missing anchor, or wrong base makes the packet STALE. Foreign work remains
untouched.

## 6. Acceptance cases

1. **Semantic shell:** a circular/cylindrical shaft plus conical cap retains those exact semantic
   kinds and compiles deterministic integer rings, unique patches, and closed shaft/cap shells.
2. **Bounded variant:** a 4/6/8-sided polygonal shaft plus pyramidal cap compiles through the same
   grammar; illegal pairings, unsupported side counts, missing geometry, and out-of-plot rings fail.
3. **Actual silhouette:** the fixed-light shadow is the deterministic light-space hull of stored
   shell vertices, contains cap-apex influence, and is not a copied/offset rectangle.
4. **Shared path and parity:** screen and SVG consume the exact same draw ops; equal built-in and
   custom semantic specifications yield byte-identical geometry and public semantic primitives.
5. **Regression boundary:** the landed rectilinear MF-VS1 fixtures remain green and byte-stable;
   no culture, institution, evidence, probability, or origin field enters the geometry compiler.

## 7. Checks

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapShapeKernel.test.js \
  tests/domain/townMapExplicitBuilding.test.js \
  tests/domain/townMapCustomParity.test.js \
  tests/property/townMapFirstSliceDeterminism.test.js
npx eslint \
  src/domain/townMap/fabric/shapes.js \
  src/domain/townMap/fabric/building.js \
  src/domain/townMap/fabric/projection.js \
  src/domain/townMap/fabric/index.js \
  tests/domain/townMapShapeKernel.test.js
npm run typecheck:domain:strict
npm run validate:packets
npx vitest run \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
```

Run the full `npm run check` only after the bounded checks pass. A foreign red is reported, not
repaired under this packet.
