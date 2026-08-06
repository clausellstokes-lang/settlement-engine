---
name: map-styles-wave-shipped
description: "MAP STYLES wave FOLDED into w7-prep (triple fold 2026-07-17; branch is an ancestor — verified by merge-base at the resume): bounded style layer + 4 lenses + craft pass + styleLens mapEdits key; parchment byte-identical proven; lens on anon gallery stays owner-gated §6"
metadata:
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

MAP STYLES (owner commission task #28, built 2026-07-17) on branch `claude/map-styles`
off c765a032 (Merge claude/chronicle, w7-prep lineage — NOT review-fixes). Six commits:
6412357a (style layer + 4 lenses), 547efee4 (craft pass + (seed,style) golden),
52d8ab9f (wiring), fea56940 (schema doc §7 → docs/DESIGN_CONTENT_PLANE.md),
ac5318a1 (JSDoc types). NOT pushed, NOT merged.

Architecture: `src/design/townMapStyles.js` (sanctioned raw-color zone) holds the four
bounded, data-only lens definitions; `buildTownMapDrawList(model, style)` resolves them;
geometry NEVER touched by a style (pinned by furniture-stripped geometry signatures in
tests/domain/townMapStyles.test.js). THE WALL: styles select only from FURNITURE_KINDS /
glyph vocabularies / hex / numbers — never SVG/code. Lens persists as
`settlement.mapEdits.styleLens` (dormancy-lawful: parchment ⇒ key dropped; denylist-safe;
schema now 9 keys — the exactness pin in tests/domain/townMapEdits.test.js was updated).
Honored by: viewer (SettlementMapPane; ephemeral lensOverride for read-only viewers incl.
gallery visitors), thumbnail (lens in cache key), PDF plate (skin only — base geometry stays
library-independent), VTT token export (renderTownMapTokenRaster, 1400px PNG).

**Why:** parchment's palette/weights reproduce the legacy EXPORT_PALETTE output EXACTLY —
verified byte-for-byte against a pre-refactor captured baseline, so every existing export
surface is unmoved. The (seed,style) golden (tests/property/townMapStyleGolden.test.js +
tests/fixtures/town-map-style-golden.json, hash eaf98306…) was minted ONCE at the crafted
output; a future deliberate style change reds it and re-mints with UPDATE_STYLE_GOLDEN=1.

**How to apply:** a new lens = one more data definition in townMapStyles.js OVERRIDES +
TOWN_MAP_STYLE_IDS + the golden re-mint; bespoke AI styles land as data of this same shape
(no code path change — designed-for, NOT built). SettlementMapPane sits at 677 lines vs a
600 max-lines lint ceiling that counts differently (677 passes; content threshold ≈ blank/
comment-excluded) — the hover/pin popovers were split to SettlementMapCards.jsx to get
under; next growth must split again, never raise. DEFERRED (recorded): lens on ANONYMOUS
gallery projections stays behind the owner-gated §6 mapEdits opt-in (toPublicSafe drops
mapEdits — a deliberate non-change of security posture); craft-pass taste veto artifact:
https://claude.ai/code/artifact/a10d9f68-d9d5-425a-bf3f-b8e8b2250d44

Related: [[settlement-map-workstream]], [[comprehensive-review-fix-program]].
