---
name: landforms-rendering-shipped
description: "NON-WATER LANDFORM rendering (task #38 fenced follow-up) BUILT on claude/landforms @ 5cb92caa (base 08613d1b, the w7-prep fog tip) — marsh/dunes/mountain-flank now RENDER as frame.landform marks; v2 golden DECLARED-ADDITIVE re-minted; style golden untouched; NOT folded (manager folds); mark vocab + density = vetoable JUDGMENTs, taste-veto pending"
metadata:
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

BUILT on **claude/landforms @ 5cb92caa** (base 08613d1b). NOT merged — the manager folds.
Closes the town-layout-v2 fenced follow-up ([[town-layout-v2-shipped]] line 39-40): the v2 site
genesis already made marsh/dunes/mountain-flank as model data + placement influence, but only
water rendered. Now the site is VISIBLE.

**What exists / how it works:**
- `siteGenesis.generateLandform(kind, seed, waterAnchor)` → `frame.landform = { kind, marks }`
  (only for marsh/dunes/mountain-flank; null for water/plain). Marks are a bounded primitive
  vocabulary: `{m:'dot',x,y,r}` (stipple), `{m:'stroke',...,w}` (reed/hachure), `{m:'curve',pts,w}`
  (contour). `w` = ink-weight TIER (0/1/2). Seed-expressed, trig-free, deterministic (integer
  hash `jit()`, no rng/Date/localeCompare — the townMap purity scan).
- ONE geometry source read by every renderer (no drift): `townMapDraw.landformDrawOps(landform,
  style)` maps marks → ops (all `palette.ink`; distinction by PATTERN not colour). Called by
  buildTownMapDrawList (after water, before roads) ⇒ PDF plate + thumbnail inherit; by the lazy
  `components/townMap/SettlementMapLandform.jsx` leaf (one element in SettlementMapPane, uses the
  pane's active `C.ink`); and re-posed by townPanorama.projectLandformOp (per-kind pseudo-elev
  lift — mountain-flank stands proud).
- Style adds ONLY `stroke.landform` + `opacity.landform` (numbers) — THE WALL holds (top-level
  style keys unchanged; accessible lens gets heavier ink, geometry lens-independent).
- Provenance hover = FREE: `mapProvenanceStory().site` already surfaces site:landform/site:water
  (site-slope/site-flats/site-water), verified in the render test.

**Golden handling (the honest additive):**
- v2 model golden `town-map-v2-golden.json` RE-MINTED (declared): proved 12/20 non-landform
  configs byte-identical, only the 8 landform-kind configs gain frame.landform; meta
  configs/totalBuildings(247)/totalDistricts(132)/morphologies(5)/minLynchScore(0.6634) ALL
  unchanged — only hash+bytes(154778→165667) moved.
- STYLE golden `town-map-style-golden.json` UNTOUCHED — it renders v1 models (no landform); 18/18
  byte-identical (empirically confirmed). No style-golden re-mint needed (unlike the SM-5
  accessible-lens case, because that golden never exercises v2 landform ops).
- New `tests/domain/townMapLandform.test.js` (18 pins) + frozen geometry hash
  `6c1fa59289571b81bffa5d83b3c2cf1125cc00ed326cf41365e9f55cdd8c7686` pins marsh/dunes/mountain
  (corpus lacked a marsh — added `LANDFORM_FIXTURES` w/ reed-economy marsh).

**Gate (focused, all green):** 179 townMap tests · tsc 0 · domain-strict 0 · lint 0 · vite build ·
verify:dist 150 · townMapLazy closure (eager delta 0, all lazy) · F24 python NUL scan clean.

**JUDGMENTs (vetoable):** the mark vocabularies + density/placement constants (siteGenesis:
34 marsh dots+13 reeds, 5 dune contours+12 stipple, mountain crest+~26 hachures; peripheral
edge bands, seeded flank via `d%4`); landform ink weights (parchment 1.4/0.5, accessible 2/0.8);
panorama lift (mountain 34, dunes 10, marsh 0). Aesthetics = OWNER TASTE-VETO PENDING (same as
the v2 fold's 9-sample veto). Emit samples for sign-off if asked.

**Open/deferred:** no per-geometry hover popover on the landform itself (the surveyor's-read
drawer already explains the cause — deliberate, not a gap). Marsh not in the shared v2 corpus
(only in LANDFORM_FIXTURES) — intentional (corpus size/meta kept stable).

Related: [[town-layout-v2-shipped]], [[sm-5-legibility-shipped]], [[map-styles-wave-shipped]],
[[comprehensive-review-fix-program]].
