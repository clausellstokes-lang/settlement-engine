---
name: keyed-scale-interiors-shipped
description: "DOOR 3 THE KEYED SCALE (building interiors) BUILT on claude/interiors @ a4bc218a (2026-07-17, base w7-prep double-fold 66eda8e8): seeded semantic institution interiors — facet-law grammar, envelope law, covert-scrub fail-closed, pre-walled UVTT, scoped edits sidecar, lazy standalone view. NOT merged — manager folds. Full lane gate green."
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# DOOR 3 — THE KEYED SCALE (building interiors) — BUILT @ a4bc218a (2026-07-17)

Built on `claude/interiors` (1 commit off `66eda8e8`, the double-folded w7-prep tip that
carries town-layout-v2). All NEW files (`src/domain/interior/*`, `src/components/interior/*`,
tests). **NOT merged — the manager folds.** OWNER RULING #8 moved the doors pre-launch;
ships at launch under launch-whole.

## What shipped
- **The model** (`domain/interior/interiorModel.js`) — pure projection forked at
  `${_seed}::interior:v1:<institutionId>` (institutionId = `anchorForInstitution`). No
  engine coupling, no interior state; re-derives next mint when an institution changes hands.
- **Facet grammar** (`interiorTemplates.js`, THE WALL data-only) — interior KIND = the
  NATURE facet through cohesionWeave.facetOf (declared ?? inferred ?? `generic`); FUNCTION
  facet (heals/feeds/arms/judges) picks a variant room. Declared==inferred is byte-identical
  (custom institutions get interiors free).
- **Envelope law** (`interiorFootprint.js`) — builds the ACTIVE town model (v2 if
  layoutLawVersion=2 else v1) read-only to read the ENTRANCE SIDE from the map (centroid-
  facing edge); footprint SIZE derived KIND×tier×prosperity. ⚠️ JUDGMENT: v2 renders every
  landmark as a uniform 16×16 square and fills as district accents — there is NO per-building
  polygon, so size is derived, orientation is read from the map.
- **Covert-scrub (fail-closed)** — REVEALED corruption → visible `evidence` room; COVERT
  corruption → a `covert:true` `concealed` chamber nested in the back room that NEVER alters
  visible geometry. `publicSafe` build never derives it; `toPublicSafeInterior` strips it;
  the two public paths are byte-identical (path-independent pin).
- **Surfaces** — `interiorDraw.js` (all 4 map lenses via resolveTownMapStyle, geometry
  lens-invariant, zero new colors); `interiorExport.js` UVTT PRE-WALLED (line_of_sight 1:1
  with literal walls, covert filtered) + `interiorExportGateReady` pricing seam (rides
  resolveExportAccess, wired to nothing); `interiorEdits.js` scoped mapEdits-idiom sidecar
  (`settlement.interiorEdits[institutionId]`, denylist-safe keys, dormancy-lawful, pins
  survive re-derivation via edits-delta); `components/interior/InteriorView.jsx` store-free
  lazy standalone view mounted from plain props.

## Gotchas / seams
- **Enter-from-map hook is a RECORDED SEAM** — InteriorView is mountable-standalone; the
  townMap hover→enter wiring is the manager's at fold (fence forbade editing townMap/*).
- **facetOf reads name/type/category/facets/tags-as-`facet:kind:value`** — a plain `tavern`
  TAG does NOT infer vice; the fixture roster uses inferring NAMES ("The Sailor Tavern").
- **Pricing is OWNER-PENDING** — one predicate seam only; do not wire free/premium/bundle.
- **Golden family is NEW + additive** (48-entry seed×tier×kind sha matrix in
  `tests/interior/interiorGolden.json`); v1 town goldens untouched.

## Verification (full lane gate, 2026-07-17)
Zero eager bytes (interior fingerprint absent from entry closure — interiorLazy pin against
fresh dist). domain:strict 0 interior errors; 0 any-holes; no control bytes; full typecheck
0; lint 0 errors; 4 validators pass; build OK; verify:dist 146/146; **full suite 12495
passed / 11 skipped / 0 failed**; interior suite 49/49.
