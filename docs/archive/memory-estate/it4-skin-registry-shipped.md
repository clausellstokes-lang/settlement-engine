---
name: ""
metadata:
  node_type: memory
  title: IT-4 THE SKIN REGISTRY shipped (dead seam closed)
  created: 2026-07-18
  updated: 2026-07-18
  status: shipped-unfolded
  branch: claude/illustrated-town (base 5324c246; IT4-a a161e0c7, IT4-b d7685332)
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# IT-4 THE SKIN REGISTRY — a saved AI skin can finally be WORN

THE ILLUSTRATED TOWN wave, slice IT-4 (design §5 in `docs/DESIGN_ILLUSTRATED_TOWN.md` on the
ledger branch). BUILT on `claude/illustrated-town`, NOT folded (manager folds). Two lettered
commits off base 5324c246: **IT4-a a161e0c7** (seam closure + picker), **IT4-b d7685332** (wall
extension + genre door + seasonBias).

## Why this existed / what was severed
`resolveActiveStyle` (bespokeStyles.js) had ZERO production callers; `coerceStyleId` collapsed any
bespoke id to parchment; the picker listed only base ids. A user could COMPOSE + SAVE an AI skin
(persists on `mapEdits.bespokeStyles`, re-previews inside StyleOverhaulPanel via a resolved OBJECT)
but could NEVER wear it on the real map. IT-4 wired the chokepoint end-to-end.

## How the seam closes (IT4-a) — the pattern to reuse
- `coerceStyleId(id, extraValidIds?)` — base lens checked FIRST (never shadowed, the flip-back law),
  `extraValidIds` (an array of saved-skin ids) widens acceptance. Absent 2nd arg ⇒ historical
  base-only behavior EXACTLY (every legacy single-arg caller byte-identical).
- `readStyleLens`/`withStyleLens` pass `Object.keys(readBespokeStyles(edits))` as extraValidIds, so
  a skin id present in the blob's OWN collection is admitted; a stale id self-heals to parchment;
  normalize keeps the selected skin, drops it on flip-back.
- `isBaseLensId` widened `TOWN_MAP_STYLE_IDS`→`TOWN_MAP_LENS_IDS` (⊇ 'illustrated') so a bespoke can
  never shadow ANY pickable base lens.
- **THE WYSIWYG LAW — every render surface resolves the ACTIVE style OBJECT via
  `resolveActiveStyle(lensId, collection)` and DRAWS with the object** (draw fns pass `__resolved`
  objects straight through): pane (illustrated underlay + panorama + viewer palette, via a NEW lazy
  leaf `components/townMap/useActiveSkin.js`), image export (`townMapExportSvg`), standalone PDF
  (`TownMapDocument`), thumbnail (`townMapThumb`). The lens picker lists saved skins under a rubric
  divider (`SettlementMapEditControls` MapLensSwitcher; `[data-town-skin]`, `[data-town-lens-divider]`).
- **DELIBERATE non-surfaces (recorded, correct):** the VTT token raster stays hardcoded `'vtt'`
  (functional export); the dossier 08C plate (`pdf/sections/TownMapPlate.jsx`) stays BASE-geometry —
  a bespoke id there collapses parchment-safe via `resolveTownMapStyle`; converting it is the §6
  ONE-REGEN deferral. Left untouched by design.

## The genre door (IT4-b) — wall extension + registry
- `validateBespokeStyle` whitelists (SELECT-only, bounded, CONDITIONAL keys so absent ⇒ no key ⇒
  plain re-skin byte-identical shape): `glyphSet` ∈ GLYPH_SET_IDS, `seasonBias` ∈ {4 quarters}, and
  the illustrated dress/shadow ROLES via `mergeRoleMap(..., extraRoles)` — stroke.dress;
  opacity.{dress,shadow,roofFill}. A geometry-shaped field never survives.
- `buildStyleVocabulary` now advertises `glyphSets`, `seasonBias`, and the dress/shadow roles so a
  StyleOverhaul proposal can name them through the existing accept→mint path (panel machinery
  untouched; AI stays Surveyor-gated upstream).
- `design/townGlyphs/index.js` is now a REGISTRATION MANIFEST: `registerGlyphSet(id, lib)` /
  `unregisterGlyphSet(id)` over a mutable Map seeded with 'medieval'; `getGlyphSet` reads it;
  `GLYPH_SET_IDS` stays the reviewed SHIPPED frozen wall vocabulary. A genre pack = a two-line data
  drop (register + add id). A test-registered second set proves the swap renders.
- `seasonBias` consumer: `groundDressOps` uses it as a FALLBACK season ONLY — the live world clock
  (`dress.season`) always wins; a base lens carries none ⇒ seasonless ⇒ byte-identical dormancy.

## ⚠️ HAZARD (bit me): react-pdf renderToBuffer is NOT byte-deterministic
`@react-pdf/renderer` `renderToBuffer` embeds a non-reproducible value (timestamp) — two identical-
input renders differ. NEVER assert PDF byte-equality/inequality across renders (both false-positive
and false-negative). To prove a PDF surface wears a style, WALK THE ELEMENT TREE (`TownMapDocument({
settlement, style })` is a plain fn returning the built tree; collect fill/stroke/backgroundColor
recursively) — deterministic. The `townMapDocument.smoke.test.js` skin test does exactly this.

## Verification (CONFIRMED)
Per-commit gates green both commits: ALL town-map goldens (townMap/style/v2/illustrated/season)
BYTE-IDENTICAL (no re-mint — illustrated golden EMPTY diff = the dormancy proof); domain:strict 0;
eslint; full typecheck; build; verify:dist (zero eager delta — `townMapLazy` green). ~72 town-map
test files pass incl. pane mount (the useActiveSkin refactor renders). New tests:
`townMapSkinRegistry` (done-when #4: worn on 4 surfaces + flip-back + base-never-shadowed),
`settlementMapSkinPicker`, `townGlyphSetRegistry` (swap), `townMapSkinReskin` (glyphSet+seasonBias).
Full suite reds = ONLY the known parked set (4 golden families + freshness) + timeout-shaped pglite
(pass in isolation) + jsdom-canvas UI — NONE import any module IT-4 touched.

## ⚠️ Pane is at its max-lines ceiling (600)
`SettlementMapPane.jsx` sat at EXACTLY 600 lines; my additions overflowed it. Fixed by extracting
`useActiveSkin` (lazy leaf) which also owns `pal`/`illustrated`. Any future pane addition must be a
leaf + re-export, not inline. (Reinforces `hot-files-at-max-lines-ceiling`.)

## What IT-5 (panorama) + the AI style panel inherit
- IT-5: `buildTownMapPanoramaDrawList` already accepts + honors a resolved style OBJECT (the pane
  passes `activeStyle`), so a worn skin re-poses the panorama. IT-5 mints the missing panorama
  golden FIRST, then enriches prisms with glyph facades.
- StyleOverhaulPanel: the accept→mint path is UNCHANGED but the wall now accepts the reskin fields —
  once the composer names glyphSet/seasonBias/dress, a full genre reskin persists + wears with no
  further wiring. Owner-gated: account-scoped skin packs (§5.4 ⛔OWNER), AI-authored glyph geometry
  (trust ladder), entitlement tiers (§6: illustrated FREE, packs CARTOGRAPHER, AI skins SURVEYOR).
