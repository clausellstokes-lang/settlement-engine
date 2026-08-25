---
name: ""
metadata: 
  node_type: memory
  title: SM-5 MAP LEGIBILITY WAVE shipped
  date: 2026-07-17
  branch: claude/sm-5-legibility
  base: 66eda8e8
  tip: f2e3d755
  status: "built, NOT merged (manager folds)"
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# SM-5 — THE MAP LEGIBILITY WAVE (shipped, awaiting fold)

All seven deliverables built on `claude/sm-5-legibility` off the double-folded w7-prep tip
`66eda8e8`. Each is one commit; NOT merged — the manager folds.

## Why
Owner commission "do it all appropriately!" — surface what the town map already simulates.
Seventh deliverable (analytics) arrived mid-flight from the manager.

## The commits (66eda8e8..f2e3d755)
- `1ceaf6aa` **(6) ACCESSIBILITY LENS** — 5th base lens `accessible` (Okabe-Ito CB-safe,
  high-contrast) in `src/design/townMapStyles.js`. Style golden re-minted ADDITIVELY
  (the 4 existing lenses proven byte-identical first: 670/670/670/1246; +accessible 508);
  `TOWN_MAP_STYLE_IDS` pins updated 4→5. `buildStyleVocabulary().baseLenses` left at 4
  DELIBERATELY (a functional a11y lens is not an AI-composition aesthetic base).
- `8d74a0b1` **(1) MAP EXPLAINS ITSELF** — district-hover provenance ("Why it sits here")
  + a left-edge "Read" drawer (`SettlementMapNotes`) with the surveyor's read (response
  mode + latent-advantage map). `provenanceModel.js` (view-time). v1 degrades: no
  provenance ⇒ no section, drawer self-gates away.
- `2d4537f4` **(2) CHANGE VIEW** — `changeView.js` (fabricRead scars/rebirths +
  calamityLedger, mirror-not-rederive). Drawer "What changed" section; dark-fabric
  whisper via `SurveyorNote surface="map"` (map→realm topic already existed). On-map
  dashed cue on rebuilt districts. Camera controller extracted to `useMapCamera.js`
  (pane hit max-lines).
- `c1bdfbca` **(3) EDGE ANNOTATIONS** — `edgeAnnotations.js`. HONEST: neighbours carry
  NO distance/bearing; roads are an even compass fan. Labels = wayfinding signs
  ("→ Neighbour") + relationship; NO invented numbers. Optional `weeksFor` resolver is
  the ONLY travel-number source (realm spatial-digest seam, left unwired — realm-scale +
  usually absent).
- `f4d4ad79` **(5) DM PINS** — `mapEdits.annotations` (new denylist-safe key + x/y/label/
  audience; schema-exactness pin extended 10→15). Dormancy-lawful, audience fail-closed
  (dm unless explicit player). Viewer (`SettlementMapAnnotations`, `AnnotationComposer`,
  `useMapAnnotations`) + a "Markers" edit toggle. Export: `annotationDrawOps` APPENDS to
  the draw list (buildTownMapDrawList untouched ⇒ golden safe), audience-filtered.
  ENTITLEMENT SEAM = the existing `editing` predicate; final free/premium OWNER-PENDING.
- `77dfa025` + `f2e3d755` **(7) MAP-LAYER ANALYTICS** — ONE feature-discriminated event
  `EVENTS.TOWN_MAP_LAYER_USED` ('town_map_layer_used', essential) via
  `src/lib/mapLayerAnalytics.js` (lazy) + `useMapLayerAnalytics.js`. feature:'render' =
  generation profile (layoutVersion/siteKind/morphology/responseMode/lynchBand/retry/
  hasFabric; v1→nulls); engagement = provenance_hover/change_view/edge_labels/
  annotation_add/lens_switch/panorama. EVENTS_REV 9→10; dictionary + edge bundle
  regenerated; metrics registry M8 added (the coverage pin). Fog/interiors INHERIT this
  event with new feature values.
- `d7a12586` **(4) ATLAS IDENTITY** — `scripts/gen-atlas-samples.mjs` +
  `docs/samples/atlas/atlas-<lens>.svg` (5 lenses of one v2 city) + freshness test.
  TASTE VETO PENDING. Realm+town lens unification is a RECORDED owner-gated seam (realm
  is FMG-iframe-bound, no lens param through the export bridge — realm-export territory).

## Gate (measured)
- Validators PASS; typecheck (full) PASS; lint PASS (warnings only).
- Full suite: 12,480 pass. Two reds triaged: metricsRegistry (MINE, fixed @ f2e3d755);
  advancePauseResume re-entrancy TIMEOUT (PRE-EXISTING, passes at 90s timeout, advance
  path byte-identical to base — a slow test flaking on the 20s default under load).
- build + verify:dist PASS (town-map lazy guard green, 145 tests).
- **First-paint closure = 1,034,099 / 1,040,000, margin 5,901 B. Eager delta = +43 B**
  (the single new analytics event string only; all six map surfaces stayed strictly lazy
  — the `::town-map:v1` fingerprint is ABSENT from the entry closure).

## How to apply
- The legibility drawer (`SettlementMapNotes`) is the shared home for map-level reads;
  add sections there, gated on real content (self-gates when empty).
- New map cosmetic edits: extend `mapEdits` + honestly extend the schema-exactness pin +
  re-verify NOT-in-PRIVATE_KEY_RE; the whole container is owner-gated off public
  projections, so DM content never leaks.
- New map signals: reuse `EVENTS.TOWN_MAP_LAYER_USED` with a new `feature` value (do NOT
  mint a new name); coarse enums/bands/counts only.
