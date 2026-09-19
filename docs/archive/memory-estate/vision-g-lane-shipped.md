---
name: vision-g-lane-shipped
description: "⭐ VISION LANE V-G SHIPPED 2026-07-20 — claude/vision-g @ 2902bdaf (base 212758ad, NOT folded/pushed): V-17 campaign import + R-4 world book + R-2 founding seeds + R-3 375px companion. Closure 1,029,304/1,040,000. Fold seam + 3 hazards inside."
metadata: 
  node_type: memory
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T18:26:25.783Z
---

# VISION LANE V-G — bring your campaign, bind the book, light the seeds, set the companion

Branch `claude/vision-g`, tip **2902bdaf** (base 212758ad). 6 lettered commits (a–f).
NOT folded, NOT pushed. Full gate GREEN: strict 0 · tsc 0 · lint 0 err · focused
123/123 + verify:dist 162/162 · **closure 1,029,304 ≤ 1,040,000 (headroom 10,696)** ·
NUL-clean. Foreign stash `analytics-intelligence-layer` left untouched.

## What shipped
- **V-17 CAMPAIGN IMPORT** (a/b/c): `src/domain/tableEvents.js` = the schema-wall
  MIRROR of V-F's tableLedger (closed vocab incident/stressor-relief/obligation/
  exposure · named bands minor/moderate/major → bounded [0,1] · source:'table') +
  a deterministic keyword **bucketing clerk** (key-free, testable). Commit path:
  `campaignSlice.importTableEvents` appends source:'table' wizardNews entries at
  chosen ticks (registered in operationRegistry, klass mechanical; compendium
  regenerated). `src/lib/campaignImport.js` = resumable session (per-event confirm
  gate). UI: `CampaignImportPanel.jsx` (lazy, in CampaignFolder) — paste/upload →
  review → confirm → commit; keyboard-completable; clarity-clause voice.
- **R-4 WORLD BOOK** (d): `src/utils/generateWorldBook.js` — pure `collectWorldBook`
  collector (unit-tested by structure, NOT bytes — the campaignPDF precedent) + a
  jsPDF painter riding generateCampaignPDF's idiom. Two faces: mode:'dm' vs
  mode:'player' (toPublicSafe, covert-clean). "World Book"+"Player Book" buttons in
  CampaignFolder.
- **R-2 FOUNDING SEEDS** (e): `src/data/foundingSeeds.js` — 3 curated seeds
  (besi-5 "The Crown That Will Not Hold" / besi-1 "The Mill That Outlived Its Wars"
  / mini-3 "The Rot Beneath the Ore"), each claim proven by
  `tests/data/foundingSeeds.probe.test.js`. Surface: `FoundingWorlds.jsx` in the
  create landing (ForgeExactButton idiom).
- **R-3 TABLE COMPANION** (f): 375px viewport pins only — the player-facing dossier
  + TableView were ALREADY responsive (mobile-gated); the gap was enforcement.

## THE FOLD SEAM (V-17 → V-F's wall) — record precisely
V-F built `src/domain/tableLedger.js` (canonical vocab + the 'table-event'
pendingEdits kind) — NOT on this base. My `tableEvents.js` MIRRORS the three
constants (TABLE_EVENT_KINDS, MAGNITUDE_BANDS, source:'table'). AT FOLD: replace
those three constants in tableEvents.js with imports from tableLedger.js (must stay
value-identical — a parity pin guards the set), and if V-F's apply path should also
consume BACKFILLED history, wire `importTableEvents` to it. The source:'table'
history channel is shared. Nothing else in the import flow changes. My import is
BACKFILL of history at past ticks (distinct from V-F's LIVE session-ledger events).

## Durable hazards (each bit this lane)
1. **Founding-seed determinism**: `worldState.rngSeed = world-pulse:${campaign.id||name}`
   (createDefaultWorldState) — derived from the RANDOM campaign id, NOT the settlement
   seed. So post-advance NEWS is NOT reproducible from a founding seed. R-2 claims
   therefore rest on the DETERMINISTIC GENERATED STATE (founding + historicalEvents +
   legitimacy + NPC goals), which IS the ten-minute conversion moment. Recorded in the
   registry header. (Generation IS deterministic same-seed+config; verified.)
2. **Em-dash in JSDoc tag lines breaks tsc-strict**: a `—`/`–` inside `* @param`/
   `* @property`/`* @typedef`/`* @returns` lines throws TS1127 "Invalid character" in
   domain:strict. Prose comment em dashes are fine. Fix: hyphens in tag-line tails
   only. (Confirms the doc-wave "em-dash-JSDoc" hazard, now pinned to strict.)
3. **deepCraftKillList is TOLERANCE-0 and counts IMPORT lines**: adding ANY line
   under src/components matching `/borderRadius/`, `/rgba\(/`, `/boxShadow/`, or the
   tint tokens (GOLD_BG|AMBER_BG|GREEN_BG|RED_BG|SLATE_BG|BLUE_BG|successBg|...) reds
   it — INCLUDING the `import { RED_BG }` line and even `borderRadius: 0`. New
   component surfaces MUST use the rule-framed plate idiom (borders only, CARD/
   CARD_ALT bg — not tint tokens, no radius, no rgba; rely on the oc-m-warmdim CLASS
   for scrim bg). A second error alert reusing RED_BG must MERGE into the one existing
   alert, not add a new line.

## Byte-neutral seam (safe, reusable)
`wizardNews.normalizeEntry` gained a `source` passthrough via
`...(entry.source ? { source: entry.source } : {})` — world entries pass no source →
byte-identical serialization; only table imports carry source:'table' (soak-excludable).
Pinned in tests/store/importTableEvents.test.js.
