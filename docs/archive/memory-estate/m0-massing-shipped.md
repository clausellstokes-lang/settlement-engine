---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  title: "M-0 procedural massing substrate SHIPPED (TRANCHE M, the map suite)"
  tags: 
    - townMap
    - massing
    - tranche-m
    - silhouette-law
    - composite
    - lazy
    - dormancy
  branch: claude/m0-massing
  base: 7d2f9e8f (composite-r4 post-W6/W7 fold)
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T18:38:48.513Z
---

# M-0 — the procedural massing substrate (composite institution silhouettes)

First lane of TRANCHE M (the map suite, docs/THE_MAP_SUITE_CONSTITUTION.md). Built the
volumetric construction layer the dimensional views (M-1..M-4) will consume. On branch
`claude/m0-massing` off `7d2f9e8f`; NOT folded yet — awaits manager visual validation + owner
taste checkpoint on the sample plates BEFORE M-0b / views dispatch.

## What shipped
- `src/domain/townMap/massing.js` (NEW, 201 eff lines, lazy, ~zero runtime imports — only
  SHADOW_DIR from glyphCompiler): `buildingMassingOps({x,y,footprint,height,roofKind,color,style,
  project,seedId,anchorKey})` → per-building COMPOSITE VOLUME (cast SE shadow + shaded front wall +
  kind-keyed roof planes) via an INJECTED cavalier projection (rational, trig-free). Exports
  `SILHOUETTE_BY_KIND`, `silhouetteForKind`, `ROOF_FORMS`, `OBLIQUE_PROJ`, `FLAT_PLAN_PROJ`,
  `makeCavalierProject`, `compareMassingDepth`.
- Panorama SEAM: `townPanorama.js` building loop branches on `style.massingSet` (dark; no shipped
  lens names it) → renders massing instead of the glyph facade. Also EXPORTED `buildingElevation`
  (additive) so the sample script derives heights from the one shared table (no duplication, no cycle).
- `massingSet` declared on the `TownMapStyle` typedef (townMapStyles.js) — a capability field like
  glyphSet; the resolver does NOT copy it, so shipped lenses stay undefined (dormancy by construction).
- `scripts/generate-massing-samples.mjs` (NEW): emits 3 taste plates to public/landing-maps/:
  `cnocby.parchment.massing.svg` (oblique seam), `cnocby.parchment.massing-plan.svg` (flat plan via
  FLAT_PLAN_PROJ), `massing-gallery.svg` (SYNTHETIC 4×4 institution recognition gallery — added
  because the mono-religious Cnocby fixture village is all spires and cannot show the range; vetoable).
- Enforcers: determinism pin + dormancy pin + op-budget (tests/domain/townMapMassing.test.js, NOT
  enumerated); SILHOUETTE TOTALITY walker (tests/lint/townMapMassingSilhouette.walker.test.js,
  enumerated) wired to mutation-sweep.sh area 27 + manifest (label "massing/silhouette totality
  unmapped kind", medieval.js in MUTATED_FILES). uncoveredBaseline unchanged at 199.

## THE INSTITUTION SILHOUETTE LAW (owner amendment mid-lane 2026-07-21)
⭐ Kind-keyed roof form is NOT the bar — each institution needs a RECOGNIZABLE ARCHITECTURAL SHAPE:
"a cathedral needs to look like a cathedral." Massing is COMPOSITE (multiple volumes per signature
building), keyed by the glyph vocabulary (glyphAssign's named-landmark taxonomy IS the silhouette
knowledge). SILHOUETTE_BY_KIND lifts each of the 18 live glyph kinds: cathedral(spire)=nave+transept+
spire tower+cross; keep=block+4 corner towers; mill(wheelhouse)=house+wheel; smithy(forge)=shed+
chimney+smoke; market(stall-rows)=3 gable stalls; manor=hall+wing+chimney; civic=hall+bell turret;
mage=tall spire tower+annex; +sign(inn)/jetty(docks) features; house-a/b/c/massing = GENERIC gable.
Recognition PASSED the visual gate (gallery screenshot: every institution identifiable unlabeled).

## Hazards / facts a successor needs
- ⚠️ THE CAVALIER IS X-PRESERVING (panorama idiom): a face at constant map-x (east/west walls)
  projects to ZERO screen width. So massing emits the FRONT wall + roof only; "faces shaded by
  orientation" is carried by the multi-plane ROOF, not side walls. A SKEWED bird's-eye projection
  (M-3) that opens the side faces is where two-wall shading gets added — deliberately deferred.
- FOOTPRINT is a RENDER choice (the model gives only position{x,y}, no rect). massing scales the
  passed footprint by per-kind `spec.foot` (cathedral 1.6, keep 1.5, house 0.9); parts inscribed
  WITHIN (walker pins |dx|+hw ≤ 1). Signature buildings out-claim cottages legitimately.
- ⚠️ TALL/THIN + dense-cluster muddiness: religious height (buildingElevation 1.55×) + tall towers →
  spindly spires; Cnocby (31 clustered religious buildings) reads as a dense church quarter. Honest
  for that fixture. Proportion tuning + framing/LOD/footprint-vs-density is a VIEW-layer (M-1..M-4)
  concern, flagged for the taste checkpoint — NOT a substrate defect (gallery proves recognition).
- Dormancy PROVEN vs base 7d2f9e8f: all 8 shipped-lens panoramas byte-identical (temp worktree diff).
  Closure EXACTLY 1,039,974 (Δ=0); massing absent from entry closure (lazy via townPanorama).
- E-A walker attribution proven: plant `zzz_orphan` kind in medieval.js → walker reds; revert → green.
- No import cycle: panorama→massing→{glyphCompiler} only. massing imports NOTHING from townMap.

## Gate receipts (all green, 2026-07-21)
new tests 12/12 · existing townMap 99/99 · mutationCoverageManifest 6/6 · domain-strict 0 · tsc(full+
strict) 0 · eslint 0 err · NUL 0 · xmllint OK · double-run cmp identical · VERIFY_DIST 29/29 · closure
1,039,974 Δ0. Deferred: side-wall shading (M-3), proportion/framing tuning (views + taste checkpoint).
