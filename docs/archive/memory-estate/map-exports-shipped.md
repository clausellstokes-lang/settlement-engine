---
name: map-exports-shipped
description: "MAP EXPORTS FOLDED into claude/w7-prep @ 7ff194aa (2026-07-17): settlement SVG/PNG/JPEG/WebP + VTT token + single-map PDF under the active lens, realm composite PNG, the $2.99 EXPORT BUNDLE via the exact single-dossier lane; UVTT scene + realm with/without toggle SEAMED in-file (MAP-EXPORTS-2)"
metadata:
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# MAP EXPORTS — FOLDED @ 7ff194aa (2026-07-17)

Built on `claude/map-exports` (2 commits off c1d3f6eb, tip 017a921c), folded into
claude/w7-prep @ 7ff194aa conflict-free. NOT pushed (the very end).

## What shipped
- Settlement map exports under the ACTIVE lens (override > persisted `styleLens`),
  honoring cosmetic mapEdits (WYSIWYG law): native SVG (byte-pinned per
  (settlement,lens,resolution)), PNG/JPEG/WebP @ 1200/2400/4800 via ONE shared
  self-contained-SVG→canvas idiom (bytes deliberately unpinned — browser-native
  encoders are platform-variant, stated in-file), VTT token PNG (the recorded
  `renderTownMapTokenRaster` seam CLOSED), single-map PDF via the plate's shared
  `renderTownMapOp` (no dossier-plate drift; dossier 08C plate untouched/golden).
- Realm map: composite PNG (bridge `exportThumb` terrain + `[data-map-overlay-svg]`
  markers). PLAUSIBLE-verified (statically matched to the proven captureCampaignThumb
  idiom); one browser click settles it.
- **THE $2.99 EXPORT BUNDLE (owner ruling)**: every export format gates through the
  EXACT single-dossier lane (`resolveExportAccess` + `dossierEntitlements[saveId]` +
  `BuyThisDossier` unlock rung) — one flag unlocks dossier PDF + Foundry + all map
  exports; premium/founder/elevated free; NO new gate class, NO schema change.
- Filenames: `<settlement>-<lens>-map-<date>.<ext>` via kernel slugify (pinned).

## Seams (in-file, MAP-EXPORTS-2)
- UVTT/Foundry pre-walled scene: full .dd2vtt/.uvtt JSON shape documented
  (pixels_per_grid=70, 20×20), wall derivation from the draw list (fortification
  polys + landmark rects → LoS segments, gates → portals), 1:1 wall-geometry fixture
  pin SPECIFIED in `townMapExport.js`. Honest caveat: stock Foundry needs a community
  importer.
- Realm with/without-settlements toggle: `withSettlements=false` overlay-skip flag +
  terrain-bytes-identical pin specified in `realmMapExport.js`; v1 always composites.
- FMG bridge exposes ONLY `exportThumb` (≤1024px JPEG); the fork's native
  `getMapURL("svg"|"png"|"tiles")` + saveGeoJson* exporters exist UNBRIDGED — bridging
  them lifts realm export beyond 1024px and adds realm SVG.
- Anon/gallery export affordance: none in v1 (owner decision).

## JUDGMENTs (vetoable)
`src/utils` home for the PDF builder (a src/lib .js importing the .jsx PDF tree drags
~650 latent JSDoc errors into tsc — proven, isolated; sits beside
generateSettlementPDF.js) · single-map PDF on the MAIN thread (tiny vector doc; the
F41 worker stays dossier-only) · bundle copy rename (2 tests updated, owner-directed).

## Verification
Zero eager bytes (closure 1,032,077/1,040,000 on its base); dist 143/143; strict 0/0;
lane pins 59 green on the MERGED tree (incl. slugify + typed-surface walkers +
dossierEntitlements pglite). ⚠️ The lane hit the slugify-idiom walker (inlined slug
helpers are BANNED — import kernel slugify) and the typed-surface walker (a comment
containing "sf-bridge.js" trips the regex). Related: [[map-styles-wave-shipped]],
[[gallery-phase2-shipped]].
