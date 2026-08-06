---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-19
  tags: 
    - illustrated-town
    - IT-5
    - IT-6
    - town-map
    - lenses
    - skin-registry
    - verification
    - wave-complete
  branch: claude/illustrated-town
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T04:41:28.357Z
---

# THE ILLUSTRATED TOWN — IT-5 verified + IT-6 THE FACE shipped (wave complete, unfolded)

## What / where
- Branch `claude/illustrated-town`, tip **d16d348e** (base composite; NOT folded — manager folds + writes the ledger row).
  Stack: aefaad49 (IT5-b) → 9cb2ece2 (IT6-a) → d16d348e (IT6-b).
- Design doc lives on the LEDGER branch `origin/review-fixes-2026-07-08` @ 02dbb942
  (`docs/DESIGN_ILLUSTRATED_TOWN.md`), NOT in the code worktree. §7 slices, §8 DONE-WHEN.

## IT-5 verdict: COMPLETE (the prior agent died before running gates, code was sound)
- All golden/domain/lazy/tsc/build/eslint gates green. IT5-b re-mint (aefaad49) confirmed
  properly DECLARED-ADDITIVE: the panorama golden diff moved ONLY the `illustrated` per-lens row
  (ops 1748→4334, totalOps +2586 = exactly the illustrated delta); the five base lenses'
  per-lens hashes byte-identical. No IT5-c fix needed.

## IT-6 THE FACE (final slice) — VERIFICATION slice; two test-only guard commits
- Decision surface: NOT built (already one click). The lens picker (`MapLensSwitcher` in
  SettlementMapEditControls.jsx, rendered UNCONDITIONALLY for every viewer) lists
  TOWN_MAP_LENS_IDS incl. `illustrated`; `doPickLens` flips an ephemeral override instantly+free.
  Default lens NOT flipped (parchment stays DEFAULT_STYLE_ID — owner taste call, gated).
- Export polish: verified, not changed. The 4 required WORN surfaces (pane · image export
  townMapExport.js · standalone PDF TownMapDocument · thumbnail townMapThumb.js) all resolve the
  active lens/bespoke-skin through `resolveActiveStyle`/`coerceStyleId` from the settlement blob.
- Entitlements: verified matches spec, not changed. `illustrated` FREE (in TOWN_MAP_LENS_IDS,
  deliberately EXCLUDED from paid TOWN_MAP_STYLE_IDS / LENS_COUNT=5); bespoke skins gated at MINT
  (SURVEYOR 3-credit lane); curated-pack CARTOGRAPHER gate N/A (only 'medieval' ships, free).
- IT6-a (9cb2ece2): `tests/ui/settlementMapIllustratedCensus.test.jsx` — done-when #9 census guard
  (all affordances co-exist with the illustrated underlay in owner mode + panorama wears glyphs).
- IT6-b (d16d348e): `tests/config/illustratedLensFree.test.js` — locks the free-face invariant
  ACROSS entitlementLadder.LENS_COUNT ↔ the lens registry (a refactor folding illustrated into the
  paid set, or bumping LENS_COUNT to include it, now reds).

## Deferred (recorded, DO NOT build): 08C illustrated conversion (dossier embedded plate wearing
bespoke skins → ONE REGEN window); CARTOGRAPHER gate for a 2nd glyph pack; ILLUSTRATED REALM;
town UVTT battlemap; account-scoped skin packs; AI-authored glyph packs.

## Full-suite result (lane end): reds = EXACTLY the 5 parked (generatorGoldenMaster · beliefMapGolden
· worldpulseDeityGolden · pdf goldenViewModel · aiGroundingBundle.freshness). 13193 passed.
The other 10 failed files were ALL timeout-shaped CONTENTION FLAKES under 3-lane load
(advancePauseResume · joins/ordering · foodModelSingleWriter · 7 pglite security files) —
each re-run GREEN in isolation. tsconfig.full EXCLUDES tests/ (test-only adds are outside tsc).

## Hazards seen
- ⚠️ `D public/map/libs/flatqueue.js` in status during heavy suite I/O = a transient git lstat
  artifact (file present + byte-identical), NOT a foreign change — manager-confirmed. Don't restore.
- ⚠️ A background `npm run test` DETACHES from its completion notification if the session stops
  waiting on it — poll the output file synchronously; do not architect a wait.
- Foreign `stash@{0}: On analytics-intelligence-layer` predates this lane — preserve, never touch.
