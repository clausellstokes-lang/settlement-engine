---
name: ""
metadata:
  node_type: memory
  title: "W7 SHIPPED — the deterministic realm renderer + the Cnocby illustrated-dress re-emit (flat-square cause fixed)"
  date: 2026-07-21
  tags:
    - shipped
    - realm-map
    - landing
    - town-map
    - illustrated-town
    - determinism
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T17:34:25.223Z
---

# W7 — realm renderer (new capability) + Cnocby dressed re-emit

Lane W7 off `claude/composite-r4` (5e23db2d) + W4 cherry-pick (e3752b7c), branch
`claude/w7-realm-renderer`. All gates green; NOT merged, NOT pushed (owner-gated walk).

## PART (b) — THE FLAT-SQUARE CAUSE (the sharpest reusable fact)
W4's Cnocby plates read as "arranged squares" because they render through the `parchment`
/ `watercolor` lenses, which are the **pure RE-SKIN family**. Two capability fields —
`style.glyphSet` and `style.opacity.dress` / `style.stroke.dress` — live **ONLY on the
`illustrated` lens** (`src/design/townMapStyles.js`: `ILLUSTRATED` override, line ~324).
So under the DORMANCY LAW:
- `townMapDraw.js:306` `const glyphLib = style.glyphSet ? … : null` → **null** for
  parchment/watercolor → buildings fall to the **legacy rect branch** (`:315-322`, 8px
  rounded squares = the "generic rectangles").
- `townMapDraw.js:261` `groundDressOps(model, style, dress)` → **[]** (groundDress gates on
  the dress fields) → zero furrows/stipple/ripples/relief/wall-shadows.
- EMPIRICAL: bare parchment `groundDressOps`=0, 35 rects, ~5-8 KB; dressed = 40-46 dress
  ops, rects 35→4 (buildings become glyph facades), ~43-47 KB.

**CURE (reusable):** compose the illustrated glyph+dress fields ONTO any palette and mark
`__resolved:true` so `buildTownMapDrawList`'s resolver passes it through unchanged (else it
rebuilds from the bare lens id and drops the fields). Helper shipped as
`dressedStyle(styleId)` in `scripts/generate-landing-map-plates.mjs` (exported).
`resolveTownMapStyle('illustrated')` IS already "parchment + dress + glyphs"; the helper
generalises it to watercolor. Re-emitted 6 cnocby plates (2 canonicals + 4 candidates) +
1 `cnocby.parchment.panorama.svg` (townPanorama oblique 2.5D, also dressed).

**Cnocby fixture structural facts (per-layer honesty):** 1 district, 31 named landmark
buildings, **water NONE**, **fortifications NONE** (no walls), roads 3; v2 adds a
`mountain-flank` landform (27 marks), v1 has none. ⇒ the WATER-RIPPLE and WALL-SHADOW dress
layers are STRUCTURALLY EMPTY for Cnocby (nothing to draw); furrows/meadow/hedge/relief(v2)
do fill. The dominant visible change is the 31 glyph facades + NW-light shadows.

**Contract:** `tests/ui/homeLanding.test.jsx:206` pins the canonicals by SUBSTRING only
(`seed <s>`, `style parchment`/`style watercolor`, town name, `<svg`) — not bytes — so the
dressed re-emit stays green as long as the provenance keeps `style <id>`. It does. (10/10.)

## PART (a) — THE REALM RENDERER (new pure domain module)
`src/domain/realmMap/realmPlateRenderer.js` — pure, headless, LAZY (imported only by the
generator script + the test; **closure = 1,039,974, Δ=0** vs baseline — zero eager bytes).
Composes `deriveWorldPlan` sites/tiers → primitive draw ops → `drawListToSvg` (never a
parallel serializer), then crops the fixed 1000×1000 viewBox down to a wide 1000×560 hero
band by a viewBox+bg-rect string rewrite (the `generate-landing-map-plates.mjs` crop idiom).
Layers: seeded enclosing coastline (a per-ray Euclidean-reach radius so **no settlement is
ever stranded in the sea**, jittered outward, one neighbour-smooth pass) + concentric
sea-lines + interior mountain carets (mapKind-keyed) + **road MST** (worldPlan carries NO
connectivity — JUDGMENT, vetoable: derive a Euclidean minimum spanning tree) + tier-scaled
settlement markers + house furniture (neatline + compass re-posed for the wide sheet).
Emitted `realm-preview.<seed>.<style>.svg` for 3 seeds (fallowmere/cindermere/holloway) ×
parchment/watercolor. Candidates only — NOT wired to the landing (owner/W1 picks).

**PURITY (the four domain ratchets all pass):** no store/generators/React import
(layerBoundaries + domainGeneratorsBoundary), 0 `any` (domainAnyCastBaseline), strict-clean
(check-domain-strict, ceiling 0). NO trig / no `**` (transcendentalMathBaseline: new files
must be 0 — **Math.sqrt is exempt by spec**, the only root used). Coastline directions come
from a **FROZEN authored 24-vector UNIT_DIRS table** (cos/sin evaluated once at authoring
time, embedded as literals) so ZERO runtime trig. ⚠️ PRNG TRAP fixed mid-build: `rng.fork(label)`
inside a `.map` returns an identically-seeded child every iteration — fork ONCE, advance
across iterations.

## Gate receipts (all green)
double-run cmp byte-identical (13/13) · xmllint well-formed (13/13) · eslint 0/0 · tsc raw
exit 0 · check-domain-strict 0 (ceiling 0) · NUL scan 0 · build ok · VERIFY_DIST 220/220
(closure 1,039,974 == baseline) · new test 13/13 · homeLanding 10/10.

## Tooling gotchas (this machine)
- **qlmanage squares SVGs** — `qlmanage -t` forces a square canvas, vertically stretching a
  wide viewBox. Rasterize an UNCROPPED 1000×1000 square (content in the top band) for
  undistorted inspection. (No rsvg/cairosvg/inkscape/imagemagick installed; qlmanage only.)
- **Browser pane blocks non-preview localhost ports** (8791 blocked) and renders file:// as a
  sandboxed data: snapshot that won't screenshot. Use qlmanage→PNG→Read for SVG inspection.
